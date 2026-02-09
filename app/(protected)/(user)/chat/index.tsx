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
import { useAuth } from '@clerk/clerk-expo';
import { Modal, ScrollView } from 'react-native';

/** Derive a display name for a conversation */
function getConversationDisplayName(
  conversation: any,
  currentUserId: string | undefined
): string {
  // Use explicit title if set (typically group chats)
  if (conversation.title) return conversation.title;

  // For 1:1 chats, show the other member's name
  const members: any[] = conversation.members ?? [];
  const otherMember = members.find(
    (m: any) => m.userId !== currentUserId
  );

  if (otherMember?.user) {
    const { firstName, lastName } = otherMember.user;
    return [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  }

  return 'Chat';
}

/** Get last message preview text */
function getLastMessagePreview(conversation: any): string | null {
  const messages: any[] = conversation.messages ?? [];
  if (messages.length === 0) return null;
  const last = messages[0]; // already ordered desc by backend
  const body: string = last?.body ?? '';
  return body.length > 50 ? body.slice(0, 50) + '...' : body;
}

export default function ChatRoomList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId: currentUserId } = useAuth();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations from API
  const {
    data: conversations,
    isLoading,
    error,
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

      const displayName = getConversationDisplayName(newConvo, currentUserId ?? undefined);
      router.push(
        `/(protected)/(user)/chat/${newConvo.id}?name=${encodeURIComponent(displayName)}` as any
      );
    },
    onError: (err: any) => {
      console.error(
        'Create Conversation Error:',
        err?.response?.data || err
      );
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
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        >
          <Text className="text-white text-lg">{'\u2190'}</Text>
        </Pressable>
        <Heading className="text-white font-bold text-2xl">Chats</Heading>
        <Pressable
          onPress={() => setShowNewChat(true)}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
        >
          <AddIcon className="text-white" />
        </Pressable>
      </Box>

      {/* Chat list */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {isLoading && (
          <Box className="flex-1 items-center justify-center py-20">
            <Text className="text-typography-400">Loading...</Text>
          </Box>
        )}
        {error && !isLoading && (
          <Box className="flex-1 items-center justify-center py-20">
            <Text className="text-typography-400">Error loading chats</Text>
            <Text className="text-typography-400 text-sm mt-2">
              Tap + to start a new chat
            </Text>
          </Box>
        )}
        {!isLoading && !error && recipients.length === 0 && (
          <Box className="flex-1 items-center justify-center py-20">
            <Text className="text-typography-400">No conversations yet</Text>
            <Text className="text-typography-400 text-sm mt-2">
              Tap + to start a new chat
            </Text>
          </Box>
        )}
        {recipients.map((c: any) => {
          const name = getConversationDisplayName(c, currentUserId ?? undefined);
          const id = c.id;
          const preview = getLastMessagePreview(c);
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

                <Box className="ml-4 flex-1 mr-2">
                  <Text className="text-lg font-medium" numberOfLines={1}>
                    {name}
                  </Text>
                  {preview && (
                    <Text
                      className="text-sm text-typography-500 mt-0.5"
                      numberOfLines={1}
                    >
                      {preview}
                    </Text>
                  )}
                </Box>

                <Box className="w-8 h-8 rounded-lg items-center justify-center bg-blue-200">
                  <ChevronRightIcon className="text-white" />
                </Box>
              </Pressable>
            </ContactSwipeItem>
          );
        })}
      </ScrollView>

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
                  <Text className="text-typography-400">
                    Loading users...
                  </Text>
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
                      disabled={isCreating}
                      className={`flex-row items-center py-3 border-b border-outline-100 ${isCreating ? 'opacity-50' : ''}`}
                    >
                      <Avatar size="md" className="bg-blue-200">
                        <AvatarFallbackText>
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </AvatarFallbackText>
                      </Avatar>
                      <Box className="ml-3">
                        <Text>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text className="text-xs text-typography-400">
                          {user.role}
                        </Text>
                      </Box>
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
