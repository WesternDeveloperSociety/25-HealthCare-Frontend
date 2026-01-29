import React, { useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
// chat input replaced by `ChatInput` component
import ChatInput from '@/components/ChatInput';

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
  const { recipientId, name } = useLocalSearchParams();
  const rid = String(recipientId ?? 'default');

  // Store messages per-recipient so chats are isolated by `recipientId`.
  // Each conversation is an array of `ChatItem` (date separators and messages).
  const [conversations, setConversations] = useState<
    Record<string, ChatItem[]>
  >(() => ({
    // Seed the currently-open recipient with a date separator + example messages.
    [rid]: [
      { id: 'd-1', kind: 'date', label: 'September 30', date: '2025-09-30' },
      {
        id: '1',
        kind: 'message',
        text: "Hi, I can't make the appointment today. Can we reschedule to tomorrow?",
        time: '9:59 AM',
        fromMe: true,
        date: '2025-09-30',
      },
      {
        id: '2',
        kind: 'message',
        text: 'Yes we can, does the same time work for you?',
        time: '10:01 AM',
        fromMe: false,
        date: '2025-09-30',
      },
      {
        id: '3',
        kind: 'message',
        text: "Perfect, thanks! I'll see you then.",
        time: '10:04 AM',
        fromMe: true,
        date: '2025-09-30',
      },
    ],
  }));

  const [text, setText] = useState('');
  // No separate date header state needed — date separators are embedded in `conversations`.
  const scrollRef = useRef<ScrollView | null>(null);

  // Real API call to send a message.
  // Notes:
  // - For web this can use a relative `/api` route. For native (Expo) set `API_BASE_URL` to your server.
  // - If your API requires auth, include the Authorization header (e.g. Bearer token).
  const sendMessageApi = async (payload: { text: string; recipientId: string }) => {
    const API_BASE = (global as any).API_BASE_URL ?? '';
    const url = `${API_BASE}/api/chats/${encodeURIComponent(payload.recipientId)}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // add if needed
      },
      body: JSON.stringify({ text: payload.text }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Send message failed: ${res.status} ${body}`);
    }

    // Expect backend to return at least { id: string, time?: string }
    const data = await res.json();
    return data as { id?: string; serverId?: string; time?: string };
  };

  const mutation = useMutation<
    { id?: string; serverId?: string; time?: string },
    unknown,
    { text: string; recipientId: string },
    { previous: Record<string, ChatItem[]>; tempId?: string }
  >({
    mutationFn: sendMessageApi,
    // optimistic update
    onMutate: async (variables: { text: string; recipientId: string }) => {
      const { text: newText } = variables;
      if (!newText.trim()) return { previous: conversations };

      const prevSnapshot = { ...conversations };

      const tempId = `temp-${Date.now()}`;

      setConversations((prev) => {
        const prevFor = prev[rid] ?? [];

        const todayISO = new Date().toISOString().slice(0, 10);
        const todayLabel = new Date().toLocaleDateString([], {
          month: 'long',
          day: 'numeric',
        });

        const last = prevFor[prevFor.length - 1];
        const lastDate = last?.date ?? null;

        const itemsToAppend: ChatItem[] = [];

        if (lastDate !== todayISO) {
          itemsToAppend.push({
            id: `d-${Date.now()}`,
            kind: 'date',
            label: todayLabel,
            date: todayISO,
          });
        }
        const messageItem: MessageItem = {
          id: tempId,
          kind: 'message',
          text: newText.trim(),
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          fromMe: true,
          date: todayISO,
        };

        itemsToAppend.push(messageItem);

        // optimistic append
        return { ...prev, [rid]: [...prevFor, ...itemsToAppend] };
      });

      // clear local input immediately for optimistic UX
      setText('');

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

      return { previous: prevSnapshot, tempId };
    },
    onError: (err: unknown, variables: { text: string; recipientId: string }, context?: { previous: Record<string, ChatItem[]> | undefined; tempId?: string }) => {
      // rollback to previous conversations if available
      if (context?.previous) {
        setConversations(context.previous);
      }
    },
    onSuccess: (data: { id?: string; serverId?: string; time?: string }, variables: { text: string; recipientId: string }, context?: { previous?: Record<string, ChatItem[]>; tempId?: string }) => {
      // Replace the temp message id with the server id (if returned) and optionally update time.
      const serverId = data.id ?? data.serverId;
      const tempId = context?.tempId;
      if (!serverId || !tempId) return;

      setConversations((prev) => {
        const conv = prev[variables.recipientId] ?? [];
        const idx = conv.findIndex((it) => it.kind === 'message' && it.id === tempId);
        if (idx === -1) return prev;

        const updated = [...conv];
        const item = updated[idx] as MessageItem;
        updated[idx] = { ...item, id: serverId, time: data.time ?? item.time };

        return { ...prev, [variables.recipientId]: updated };
      });
    },
  });

  const send = (messageText?: string) => {
    const toSend = messageText ?? text;
    if (!toSend?.trim()) return;
    mutation.mutate({ text: toSend, recipientId: rid });
  };

  // `useMutation` types in this project don't expose `isLoading` on the result
  // (different react-query typing). Use a small cast to read it for UI state.
  const sending = Boolean((mutation as any).isLoading);

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
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        >
          {(conversations[rid] ?? []).map((item) => {
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
                    className={`px-4 py-3 rounded-lg break-words ${
                      m.fromMe
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

        {/* Typing bar (input full-width implemented by ChatInput) */}
        <Box className="absolute left-0 right-0 bottom-0 px-4 py-4 bg-background-0">
          <ChatInput value={text} onChangeText={setText} onSend={send} sending={sending} />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
