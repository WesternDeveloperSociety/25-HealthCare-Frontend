import React, { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Pressable } from '@/components/ui/pressable';
import ChatInput from '@/components/ChatInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/clerk-expo';

type MessageItem = {
  id: string;
  kind: 'message';
  text: string;
  time: string;
  fromMe: boolean;
  senderName: string;
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
  const router = useRouter();
  const queryClient = useQueryClient();

  const { userId: currentUserId } = useAuth();

  const {
    data: messagesData,
    isLoading,
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      apiClient.get('/messages/:conversationId', {
        params: { conversationId: conversationId! },
      }),
    enabled: !!conversationId,
    refetchInterval: 5000, // poll every 5 seconds for new messages
  });

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (content: string) =>
      apiClient.post(
        '/messages/:conversationId',
        { content },
        { params: { conversationId: conversationId! } }
      ),
  });

  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  const chatItems: ChatItem[] = React.useMemo(() => {
    if (!messagesData) return [];

    const rawMessages = (messagesData as any[]) || [];

    // Backend returns messages in desc order (newest first) -- reverse for display
    const sorted = [...rawMessages].reverse();

    const items: ChatItem[] = [];
    let lastDate = '';

    sorted.forEach((msg: any) => {
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

      // Backend field is `body`, not `content`
      const senderFirst = msg.sender?.firstName ?? '';
      const senderLast = msg.sender?.lastName ?? '';
      const senderName = [senderFirst, senderLast].filter(Boolean).join(' ') || 'Unknown';

      items.push({
        id: msg.id,
        kind: 'message',
        text: msg.body ?? '',
        time: dateObj.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fromMe: msg.senderId === currentUserId,
        senderName,
        date: dateIso,
      });
    });

    return items;
  }, [messagesData, currentUserId]);

  const send = (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || !conversationId) return;

    sendMessage(trimmed, {
      onSuccess: () => {
        setText('');
        queryClient.invalidateQueries({
          queryKey: ['messages', conversationId],
        });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          100
        );
      },
    });
  };

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0">
        <Text className="text-typography-400">Loading messages...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box className="bg-blue-500 rounded-b-2xl pt-14 pb-4 px-4 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
        >
          <Text className="text-white text-lg">{'\u2190'}</Text>
        </Pressable>
        <Box className="flex-1">
          <Heading className="text-white font-bold text-xl" numberOfLines={1}>
            {name ?? 'Chat'}
          </Heading>
        </Box>
      </Box>

      {/* Messages area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 16,
            flexGrow: 1,
          }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {chatItems.length === 0 && (
            <Box className="flex-1 items-center justify-center">
              <Text className="text-typography-400">No messages yet</Text>
              <Text className="text-typography-400 text-sm mt-1">
                Send a message to start the conversation
              </Text>
            </Box>
          )}
          {chatItems.map((item) => {
            if (item.kind === 'date') {
              return (
                <Box key={item.id} className="items-center mb-4 mt-2">
                  <Box className="bg-background-100 px-3 py-1 rounded-full">
                    <Text className="text-typography-500 text-xs">
                      {item.label}
                    </Text>
                  </Box>
                </Box>
              );
            }

            const m = item as MessageItem;
            return (
              <Box
                key={m.id}
                className={`mb-3 flex-row ${m.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                {!m.fromMe && (
                  <Box className="mr-2 mt-1">
                    <Avatar
                      size="sm"
                      className="bg-blue-100 border border-blue-200"
                    >
                      <AvatarFallbackText className="text-blue-700">
                        {m.senderName.substring(0, 2).toUpperCase()}
                      </AvatarFallbackText>
                    </Avatar>
                  </Box>
                )}

                <Box
                  className={`max-w-[75%] ${m.fromMe ? 'items-end' : 'items-start'}`}
                >
                  {!m.fromMe && (
                    <Text className="text-typography-500 text-xs mb-1 ml-1">
                      {m.senderName}
                    </Text>
                  )}
                  <Box
                    className={`px-4 py-3 rounded-2xl ${
                      m.fromMe
                        ? 'bg-blue-500 rounded-br-sm'
                        : 'bg-background-100 rounded-bl-sm'
                    }`}
                  >
                    <Text
                      className={
                        m.fromMe ? 'text-white' : 'text-typography-900'
                      }
                    >
                      {m.text}
                    </Text>
                  </Box>
                  <Text className="text-typography-400 text-xs mt-1 mx-1">
                    {m.time}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </ScrollView>

        {/* Input bar -- padded above the floating CustomNavBar */}
        <Box className="px-4 pt-3 pb-2 bg-background-0 border-t border-outline-100"
          style={{ marginBottom: 100 }}
        >
          <ChatInput
            value={text}
            onChangeText={setText}
            onSend={send}
            sending={isSending}
            placeholder="Type a message..."
          />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
