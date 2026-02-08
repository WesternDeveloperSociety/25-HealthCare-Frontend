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
import { useApi } from '@/lib/api';
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
  const { conversationId, name } = useLocalSearchParams<{ conversationId: string, name: string }>();
  // conversationId might be "undefined" or a real UUID. 
  // If we came from the list, it should be a UUID.

  const currentUser = useAuthStore(s => s.user);
  const { data: messagesData, isLoading, refetch } = useApi.useQuery('/messages/:conversationId', {
    params: { conversationId: conversationId! },
    queries: {
      enabled: !!conversationId
    }
  });

  const { mutate: sendMessage } = useApi.useMutation('post', '/messages/:conversationId');

  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  // Process messages into ChatItems (with date separators)
  const chatItems: ChatItem[] = React.useMemo(() => {
    if (!messagesData) return [];
    // Assuming messagesData is an array of message objects from backend.
    // We need to map them to our internal format.
    // Schema says z.void() again, so we assume `any`.

    const rawMessages = (messagesData as any[]) || [];
    const items: ChatItem[] = [];

    // Sort by date/time if needed? Assuming backend returns sorted.

    let lastDate = '';

    rawMessages.forEach((msg: any) => {
      // msg structure unknown, guessing: content, createdAt, senderId?
      const dateObj = new Date(msg.createdAt || Date.now());
      const dateIso = dateObj.toISOString().slice(0, 10);

      if (dateIso !== lastDate) {
        items.push({
          id: `d-${dateIso}`,
          kind: 'date',
          label: dateObj.toLocaleDateString([], { month: 'long', day: 'numeric' }),
          date: dateIso
        });
        lastDate = dateIso;
      }

      items.push({
        id: msg.id,
        kind: 'message',
        text: msg.content,
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fromMe: msg.senderId === currentUser?.id, // Need current user ID to determine this
        date: dateIso
      });
    });

    return items;
  }, [messagesData, currentUser]);


  const send = () => {
    if (!text.trim() || !conversationId) return;

    sendMessage({
      params: { conversationId },
      body: { content: text }
    } as any, {
      onSuccess: () => {
        setText('');
        refetch(); // Refresh messages
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      }
    });
  };

  if (isLoading) {
    return <Box className="flex-1 items-center justify-center"><Text>Loading...</Text></Box>;
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box className="bg-blue-500 rounded-t-2xl py-4 items-center justify-center">
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
          contentContainerStyle={{ padding: 16, paddingBottom: 120, flexGrow: 1 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
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

            // item is MessageItem
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
                    className={`px-4 py-3 rounded-lg break-words ${m.fromMe
                        ? 'bg-blue-400 w-60' // darker blue for sent messages
                        : 'bg-blue-200 max-w-[70%]' // lighter blue for received messages
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

        {/* Typing bar (input full-width; FAB overlaps right) */}
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
              // absolute overlap so it sits partly on the input; adjust top to center with taller input
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
