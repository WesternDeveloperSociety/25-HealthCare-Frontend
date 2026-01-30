import React, { useRef, useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
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
  const flatListRef = useRef<FlatList<ChatItem> | null>(null);

  // Local derived messages for the current recipient to ensure FlatList
  // receives a stable array reference when `conversations` updates.
  const [messages, setMessages] = useState<ChatItem[]>(conversations[rid] ?? []);

  useEffect(() => {
    setMessages(conversations[rid] ?? []);
  }, [conversations, rid]);

  const normalizeTime = (t?: string) => {
    if (!t) return '';
    // Match times like "7:17:27 PM", "7:17 PM", "19:17:27" or "19:17"
    const m = String(t).match(/^(\d{1,2}:\d{2})(:\d{2})?(\s*[AaPp][Mm])?$/);
    if (m) {
      const ampm = m[3] ? m[3].toUpperCase() : '';
      return `${m[1]}${ampm}`.trim();
    }
    const parsed = new Date(t);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return t;
  };

  useEffect(() => {
    const onShow = () => {
      setTimeout(() => {
        (flatListRef.current as any)?.scrollToEnd?.({ animated: true }) ||
          (flatListRef.current as any)?.scrollToOffset?.({ offset: 100000, animated: true });
      }, 50);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    return () => showSub.remove();
  }, [rid, conversations]);

  // Debug: log conversation for current rid whenever it changes
  useEffect(() => {
    console.log('ChatRoomScreen: conversation for', rid, conversations[rid]);
  }, [rid, conversations]);

  // Real API call to send a message.
  // Notes:
  // - For web this can use a relative `/api` route. For native (Expo) set `API_BASE_URL` to your server.
  // - If your API requires auth, include the Authorization header (e.g. Bearer token).
  const sendMessageApi = async (payload: {
    text: string;
    recipientId: string;
  }) => {
    const API_BASE = (global as any).API_BASE_URL ?? '';
    const url = `${API_BASE}/api/chats/${encodeURIComponent(payload.recipientId)}`;
    // If no API base is set (local/dev mode), mock a successful response so
    // optimistic updates don't get rolled back during manual testing.
    if (!API_BASE) {
      return new Promise<{ id?: string; serverId?: string; time?: string }>((res) =>
        setTimeout(() =>
          res({
            serverId: `local-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }),
        200),
      );
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // add if needed
        },
        body: JSON.stringify({ text: payload.text }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Send message failed: ${response.status} ${body}`);
      }

      // Expect backend to return at least { id: string, time?: string }
      const data = await response.json();
      return data as { id?: string; serverId?: string; time?: string };
    } catch (err) {
      // Network or server error — warn and fall back to a local success so optimistic message remains visible during dev.
      console.warn('sendMessageApi: network error, falling back to local mock', err);
      return { serverId: `local-${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    }
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
      const { text: newText, recipientId: targetRid } = variables;
      console.log('ChatRoomScreen: onMutate variables=', variables);
      if (!newText.trim()) return { previous: conversations };

      const prevSnapshot = { ...conversations };

      const tempId = `temp-${Date.now()}`;

      // Build items to append
      const prevFor = prevSnapshot[targetRid] ?? [];

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

      // Compose next conversations object and update both conversations and messages immediately
      const nextConversations = { ...prevSnapshot, [targetRid]: [...prevFor, ...itemsToAppend] };
      console.log('ChatRoomScreen: optimistic next conversation for', targetRid, nextConversations[targetRid]);

      // Update global conversations state and local messages snapshot so UI reflects optimistic change
      setConversations(nextConversations);
      setMessages(nextConversations[targetRid]);

      // schedule a scroll to the newly-appended message index
      const prevLen = (prevSnapshot[targetRid]?.length ?? 0);
      const newLen = prevLen + itemsToAppend.length;
      const newIndex = Math.max(0, newLen - 1);
      setTimeout(() => {
        try {
          (flatListRef.current as any)?.scrollToIndex?.({ index: newIndex, animated: true });
        } catch (e) {
          // fallback to offset scroll if scrollToIndex fails
          (flatListRef.current as any)?.scrollToOffset?.({ offset: 100000, animated: true });
        }
      }, 80);

      // clear local input immediately for optimistic UX
      setText('');

      setTimeout(() => {
        (flatListRef.current as any)?.scrollToEnd?.({ animated: true }) ||
          (flatListRef.current as any)?.scrollToOffset?.({ offset: 100000, animated: true });
      }, 50);

      return { previous: prevSnapshot, tempId };
    },
    onError: (
      err: unknown,
      variables: { text: string; recipientId: string },
      context?: {
        previous: Record<string, ChatItem[]> | undefined;
        tempId?: string;
      }
    ) => {
      // rollback to previous conversations if available
      if (context?.previous) {
        setConversations(context.previous);
      }
    },
    onSuccess: (
      data: { id?: string; serverId?: string; time?: string },
      variables: { text: string; recipientId: string },
      context?: { previous?: Record<string, ChatItem[]>; tempId?: string }
    ) => {
      // Replace the temp message id with the server id (if returned) and optionally update time.
      const serverId = data.id ?? data.serverId;
      const tempId = context?.tempId;
      if (!serverId || !tempId) return;

      setConversations((prev) => {
        const conv = prev[variables.recipientId] ?? [];
        const idx = conv.findIndex(
          (it) => it.kind === 'message' && it.id === tempId
        );
        if (idx === -1) return prev;

        const updated = [...conv];
        const item = updated[idx] as MessageItem;
        updated[idx] = { ...item, id: serverId, time: normalizeTime(data.time ?? item.time) };

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
        <FlatList
          ref={flatListRef}
          data={messages}
          extraData={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            console.log('ChatRoomScreen: renderItem item=', item.id, item.kind, (item as any).text);
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
                      m.fromMe
                        ? 'bg-blue-400 w-60'
                        : 'bg-blue-200 max-w-[70%]'
                    }`}
                  >
                    <Text
                      className={`${m.fromMe ? 'text-white' : 'text-typography-900'}`}
                    >
                      {m.text}
                    </Text>
                  </Box>
                  <Text className="text-typography-500 text-xs mt-1">
                    {normalizeTime(m.time)}
                  </Text>
                </Box>
              </Box>
            );
          }}
        />

        {/* Typing bar (input full-width implemented by ChatInput) */}
        <Box className="absolute left-0 right-0 bottom-0 px-4 py-4 bg-background-0">
          <ChatInput
            value={text}
            onChangeText={setText}
            onSend={send}
            sending={sending}
          />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
