import React, { useRef, useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Input, InputField } from '@/components/ui/input';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MailIcon } from '@/components/ui/icon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type MessageItem = {
  id: string;
  kind: 'message';
  text: string;
  time: string;
  fromMe: boolean;
  date: string; // ISO date (YYYY-MM-DD)
};

type DateSeparator = {
  id: string;
  kind: 'date';
  label: string; // human friendly label, e.g. "November 27"
  date: string; // ISO date
};

type ChatItem = MessageItem | DateSeparator;

export default function ChatRoomScreen() {
  const { conversationId, name } = useLocalSearchParams<{
    conversationId: string;
    name: string;
  }>();
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((s) => s.user);
  const {
    data: messagesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      apiClient.get('/messages/:conversationId', {
        params: { conversationId: conversationId! },
      }),
    enabled: !!conversationId,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: (content: string) =>
      apiClient.post(
        '/messages/:conversationId',
        { content },
        { params: { conversationId: conversationId! } }
      ),
    onSuccess: () => {
      refetch();
      // Invalidate to refresh the list if needed
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });

  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  const chatItems: ChatItem[] = React.useMemo(() => {
    if (!messagesData) return [];

    const rawMessages = (messagesData as any[]) || [];
    const items: ChatItem[] = [];

    let lastDate = '';

    rawMessages.forEach((msg: any) => {
      const dateObj = new Date(msg.createdAt || Date.now());
      const dateIso = dateObj.toISOString().slice(0, 10);

      if (dateIso !== lastDate) {
        items.push({
          id: `d-${dateIso}`,
          kind: 'date',
          label: dateObj.toLocaleDateString([], {
            month: 'long',
            day: 'numeric',
          }),
          date: dateIso,
        });
        lastDate = dateIso;
      }

      items.push({
        id: msg.id,
        kind: 'message',
        text: msg.content,
        time: dateObj.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fromMe: msg.senderId === currentUser?.id,
        date: dateIso,
      });
    });

    return items;
  }, [messagesData, currentUser]);

  const send = () => {
    if (!text.trim() || !conversationId) return;

    sendMessage(
      {
        params: { conversationId },
        body: { content: text },
      } as any,
      {
        onSuccess: () => {
          setText('');
          refetch(); // Refresh messages
          setTimeout(
            () => scrollRef.current?.scrollToEnd({ animated: true }),
            50
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box className="bg-blue-500 rounded-b-2xl py-4 items-center justify-center">
        <Heading className="font-bold text-3xl">
          <Text className="text-white">Chat with </Text>
          <Text className="text-blue-200">{name ?? 'Name'}</Text>
        </Heading>
      </Box>

      {/* Messages area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
            flexGrow: 1,
          }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {chatItems.length === 0 && (
            <Box className="flex-1 items-center justify-center">
              <Text className="text-typography-400">No messages yet</Text>
            </Box>
          )}
          {chatItems.map((item) => {
            if (item.kind === 'date') {
              return (
                <Box key={item.id} className="items-center mb-4">
                  <Text className="text-typography-500">{item.label}</Text>
                </Box>
              );
            }

            const m = item as MessageItem;
            return (
              <Box
                key={m.id}
                className={`mb-4 flex-row ${m.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                {!m.fromMe && (
                  <Box className="mr-3">
                    <Avatar
                      size="sm"
                      className="bg-white border-2 border-background-0"
                    >
                      <AvatarFallbackText>Dr</AvatarFallbackText>
                    </Avatar>
                  </Box>
                )}

                <Box className={`${m.fromMe ? 'items-end' : ''}`}>
                  <Box
                    className={`px-4 py-3 rounded-lg break-words ${
                      m.fromMe ? 'bg-blue-400 w-60' : 'bg-blue-200 max-w-[70%]'
                    }`}
                  >
                    <Text
                      className={`${m.fromMe ? 'text-white' : 'text-typography-900'}`}
                    >
                      {m.text}
                    </Text>
                  </Box>
                  <Text className="text-typography-500 text-xs mt-1">
                    {m.time}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </ScrollView>

        {/* Typing bar */}
        <Box className="absolute left-0 right-0 bottom-0 px-4 py-4 bg-background-0">
          <Box className="relative">
            <Input
              size="xl"
              className="rounded-full w-full bg-background-50"
              variant="rounded"
            >
              <InputField
                placeholder="Send a message..."
                value={text}
                onChangeText={setText}
                className="py-2 pr-20"
              />
            </Input>

            <Fab
              onPress={send}
              size="sm"
              style={{ position: 'absolute', right: 16, top: 12 }}
            >
              <FabIcon as={MailIcon} className="text-white" />
            </Fab>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
