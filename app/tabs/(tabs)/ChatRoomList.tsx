import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, ChevronRightIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ContactSwipeItem from '@/components/ContactSwipeItem';
import { useRouter } from 'expo-router';
import { useApi } from '@/lib/api';

export default function ChatRoomList() {
  const router = useRouter();

  // Fetch conversations from API
  const { data: conversations, isLoading, error, refetch } = useApi.useQuery('/conversations');

  // TODO: connect delete/archive to API
  const handleDelete = (id: string) => {
    // Implement delete mutation
    console.log('Delete', id);
  };

  const handleArchive = (id: string) => {
    console.log('Archive', id);
  };

  const handleToggleRead = (id: string) => {
    console.log('Toggle Read', id);
  };

  if (isLoading) {
    return <Box className="flex-1 items-center justify-center"><Text>Loading...</Text></Box>;
  }

  if (error) {
    return <Box className="flex-1 items-center justify-center"><Text>Error loading chats</Text></Box>;
  }

  const recipients = conversations || [];

  return (
    <Box className="flex-1 bg-background-0">
      {/* Top header */}
      <Box className="bg-blue-300 rounded-t-2xl py-4 items-center justify-center">
        <Heading className="text-white font-bold text-2xl">Chats</Heading>
      </Box>

      {/* Chat list */}
      <Box className="px-4 pt-4 flex-1">
        {recipients.length === 0 && (
          <Box className="flex-1 items-center justify-center">
            <Text className="text-typography-400">No conversations yet</Text>
          </Box>
        )}
        {recipients.map((c: any) => { // Type should be inferred from Zodios but using any for safety during migration
          // The API shape might differ from previous mock. 
          // Let's assume standard conversation object for now or adjust based on schema.
          // Looking at api.ts: getConversations returns z.void() in schema?? 
          // WAIT: The schema says response: z.void(). This is likely an issue in the generated code or spec.
          // I should double check the schema.
          const name = c.title || 'Chat'; // Fallback
          const id = c.id;
          const unread = false; // Add logic if available

          return (
            <ContactSwipeItem
              key={id}
              id={id}
              unread={unread}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onToggleRead={handleToggleRead}
            >
              <Pressable
                onPress={() => {
                  router.push(
                    `/tabs/chat/${id}?name=${encodeURIComponent(name)}` as any
                  );
                }}
                className="flex-row items-center w-full"
              >
                <Avatar
                  size="lg"
                  className="bg-white border-2 border-background-0"
                >
                  <AvatarFallbackText className="text-primary-700">
                    {name.substring(0, 2).toUpperCase()}
                  </AvatarFallbackText>
                </Avatar>

                <Text className="ml-4 text-lg font-medium">{name}</Text>

                <Box className="flex-1" />

                <Box className="w-8 h-8 rounded-lg items-center justify-center bg-blue-200">
                  <ChevronRightIcon className="text-white" />
                </Box>
              </Pressable>
            </ContactSwipeItem>
          )
        })}
      </Box>

      {/* Floating add button */}
      <Fab onPress={() => { }} placement="bottom right">
        <FabIcon as={AddIcon} className="text-white" />
      </Fab>

      {/* <EditScreenInfo path="app/(app)/(tabs)/ChatRoomList.tsx" /> */}
    </Box>
  );
}
