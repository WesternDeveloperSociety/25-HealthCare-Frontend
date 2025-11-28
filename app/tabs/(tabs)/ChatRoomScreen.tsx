import React, { useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Input, InputField } from '@/components/ui/input';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MailIcon } from '@/components/ui/icon';

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
  const [conversations, setConversations] = useState<Record<string, ChatItem[]>>(() => ({
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

  const send = () => {
    if (!text.trim()) return;

    setConversations((prev) => {
      const prevFor = prev[rid] ?? [];

      const todayISO = new Date().toISOString().slice(0, 10);
      const todayLabel = new Date().toLocaleDateString([], { month: 'long', day: 'numeric' });

      // Determine the last item's date (if any)
      const last = prevFor[prevFor.length - 1];
      const lastDate = last?.date ?? null;

      const itemsToAppend: ChatItem[] = [];

      // If the last date differs from today, insert a date separator before the new message.
      if (lastDate !== todayISO) {
        itemsToAppend.push({ id: `d-${Date.now()}`, kind: 'date', label: todayLabel, date: todayISO });
      }

      const messageItem: MessageItem = {
        id: String(Date.now()),
        kind: 'message',
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fromMe: true,
        date: todayISO,
      };

      itemsToAppend.push(messageItem);

      return { ...prev, [rid]: [...prevFor, ...itemsToAppend] };
    });

    setText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

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
                    <Avatar size="sm" className="bg-white border-2 border-background-0">
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
                    <Text className={`${m.fromMe ? 'text-white' : 'text-typography-900'}`}>
                      {m.text}
                    </Text>
                  </Box>
                  <Text className="text-typography-500 text-xs mt-1">{m.time}</Text>
                </Box>
              </Box>
            );
          })}
        </ScrollView>

        {/* Typing bar (input full-width; FAB overlaps right) */}
        <Box className="absolute left-0 right-0 bottom-0 px-4 py-4 bg-background-0">
          <Box className="relative">
            <Input size="xl" className="rounded-full w-full bg-background-50" variant="rounded">
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