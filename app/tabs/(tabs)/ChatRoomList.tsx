import React from 'react';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, ArrowRightIcon, ChevronRightIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ContactSwipeItem from '@/components/ContactSwipeItem';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ChatRoomList() {
  const router = useRouter();

  const [recipients, setRecipients] = useState([
    { id: 'dr-1', name: 'Dr. Name', unread: true, archived: false },
    { id: 'dr-2', name: 'Dr. Smith', unread: false, archived: false },
  ] as Array<any>);

  const handleDelete = (id: string) => {
    setRecipients((r) => r.filter((x) => x.id !== id));
  };

  const handleArchive = (id: string) => {
    setRecipients((r) => r.map((x) => (x.id === id ? { ...x, archived: true } : x)));
  };

  const handleToggleRead = (id: string) => {
    setRecipients((r) => r.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x)));
  };

  return (
    <Box className="flex-1 bg-background-0">
      {/* Top header */}
      <Box className="bg-blue-300 rounded-t-2xl py-4 items-center justify-center">
        <Heading className="text-white font-bold text-2xl">Chats</Heading>
      </Box>

      {/* Chat list */}
      <Box className="px-4 pt-4 flex-1">
        {recipients.map((r) => (
          <ContactSwipeItem
            key={r.id}
            id={r.id}
            unread={r.unread}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onToggleRead={handleToggleRead}
          >
            <Pressable
              onPress={() => {
                router.push(`/tabs/chat/${r.id}?name=${encodeURIComponent(r.name)}`);
              }}
              className="flex-row items-center w-full"
            >
              <Avatar size="lg" className="bg-white border-2 border-background-0">
                <AvatarFallbackText className="text-primary-700">Dr</AvatarFallbackText>
              </Avatar>

              <Text className="ml-4 text-lg font-medium">{r.name}</Text>

              <Box className="flex-1" />

              <Box className="w-8 h-8 rounded-lg items-center justify-center bg-blue-200">
                <ChevronRightIcon className="text-white" />
              </Box>
            </Pressable>
          </ContactSwipeItem>
        ))}
      </Box>

      {/* Floating add button */}
      <Fab onPress={() => {}} placement="bottom right">
        <FabIcon as={AddIcon} className="text-white" />
      </Fab>

      {/* <EditScreenInfo path="app/(app)/(tabs)/ChatRoomList.tsx" /> */}
    </Box>
  );
}