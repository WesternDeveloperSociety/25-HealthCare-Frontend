import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { AddIcon, ChevronRightIcon, CloseIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import ContactSwipeItem from '@/components/ContactSwipeItem';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Modal, ScrollView } from 'react-native';

export default function ChatRoomList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations from API
  const {
    data: conversations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/conversations');
        return res;
      } catch (err) {
        console.error('ChatRoomList Error:', err);
        throw err;
      }
    },
  });

  // Fetch users for new conversation
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/users');
        return res;
      } catch (err) {
        console.error('Users fetch error:', err);
        return [];
      }
    },
    enabled: showNewChat,
  });

  // Create conversation mutation
  const { mutate: createConversation, isPending: isCreating } = useMutation({
    mutationFn: async (userIds: string[]) => {
      return apiClient.post('/conversations', { userIds });
    },
    onSuccess: (newConvo: any) => {
      setShowNewChat(false);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.push(
        `/(protected)/(user)/chat/${newConvo.id}?name=${encodeURIComponent(newConvo.title || 'Chat')}` as any
      );
    },
    onError: (err: any) => {
      console.error('Create Conversation Error:', err?.response?.data || err);
    },
  });

  const handleDelete = (id: string) => {
    console.log('Delete', id);
  };

  const handleArchive = (id: string) => {
    console.log('Archive', id);
  };

  const handleToggleRead = (id: string) => {
    console.log('Toggle Read', id);
  };

  const handleSelectUser = (userId: string) => {
    createConversation([userId]);
  };

  const recipients = conversations || [];

  return (
    <Box className="flex-1 bg-background-0">
      {/* Top header with safe area padding */}
      <Box className="bg-blue-300 rounded-b-2xl pt-14 pb-4 px-4 flex-row items-center justify-between">
        <Box className="w-10" />
        <Heading className="text-white font-bold text-2xl">Chats</Heading>
        <Pressable
          onPress={() => setShowNewChat(true)}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        >
          <AddIcon className="text-white" />
        </Pressable>
      </Box>

      {/* Chat list */}
      <Box className="px-4 pt-4 flex-1">
        {isLoading && (
          <Box className="flex-1 items-center justify-center">
            <Text className="text-typography-400">Loading...</Text>
          </Box>
        )}
        {error && !isLoading && (
          <Box className="flex-1 items-center justify-center">
            <Text className="text-typography-400">Error loading chats</Text>
            <Text className="text-typography-400 text-sm mt-2">
              Tap + to start a new chat
            </Text>
          </Box>
        )}
        {!isLoading && !error && recipients.length === 0 && (
          <Box className="flex-1 items-center justify-center">
            <Text className="text-typography-400">No conversations yet</Text>
            <Text className="text-typography-400 text-sm mt-2">
              Tap + to start a new chat
            </Text>
          </Box>
        )}
        {recipients.map((c: any) => {
          const name = c.title || 'Chat';
          const id = c.id;
          const unread = false;

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
                    `/(protected)/(user)/chat/${id}?name=${encodeURIComponent(name)}` as any
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
          );
        })}
      </Box>

      {/* New Conversation Modal */}
      <Modal visible={showNewChat} animationType="slide" transparent>
        <Box className="flex-1 bg-black/50 justify-end">
          <Box className="bg-background-0 rounded-t-3xl p-6 h-3/4">
            {/* Header with close button */}
            <Box className="flex-row justify-between items-center mb-4">
              <Heading size="lg">New Conversation</Heading>
              <Pressable
                onPress={() => setShowNewChat(false)}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
              >
                <CloseIcon className="text-typography-700 w-6 h-6" />
              </Pressable>
            </Box>

            {/* Search input */}
            <Input className="mb-4">
              <InputField
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>

            {/* Users list */}
            <ScrollView className="flex-1">
              {!users || users.length === 0 ? (
                <Box className="items-center py-8">
                  <Text className="text-typography-400">Loading users...</Text>
                  <Text className="text-typography-300 text-sm mt-2">
                    If this persists, restart the backend server
                  </Text>
                </Box>
              ) : (
                users
                  .filter((u: any) =>
                    `${u.firstName} ${u.lastName}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((user: any) => (
                    <Pressable
                      key={user.id}
                      onPress={() => handleSelectUser(user.id)}
                      className="flex-row items-center py-3 border-b border-outline-100"
                    >
                      <Avatar size="md" className="bg-blue-200">
                        <AvatarFallbackText>
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </AvatarFallbackText>
                      </Avatar>
                      <Text className="ml-3">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Pressable>
                  ))
              )}
            </ScrollView>

            {/* Cancel button at bottom */}
            <Button
              variant="outline"
              onPress={() => setShowNewChat(false)}
              className="mt-4"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
