import React, { useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';

type RawMessage = {
  id: string;
  text: string;
  senderId?: string;
  receiverId?: string;
  createdAt: string; // ISO
};

type Page = { messages: RawMessage[]; nextCursor: string | null };

const PAGE_LIMIT = 20;

export default function RecipientChatRoute() {
  const { recipientId, name } = useLocalSearchParams();
  const rid = String(recipientId ?? 'default');
  const scrollRef = useRef<ScrollView | null>(null);

  async function fetchMessagesPage({ pageParam }: { pageParam?: string | null }): Promise<Page> {
    const qp = new URLSearchParams();
    if (pageParam) qp.set('cursor', pageParam);
    qp.set('limit', String(PAGE_LIMIT));

    const url = `/chats/${rid}?${qp.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch chat messages');
    return (await res.json()) as Page;
  }

  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chat-history', rid] as const,
    queryFn: ({ pageParam = null }) => fetchMessagesPage({ pageParam }),
    initialPageParam: null,
    // return the cursor for the next page (older messages) or undefined when finished
    getNextPageParam: (lastPage: Page) => lastPage.nextCursor ?? undefined,
    refetchInterval: 3000,
    enabled: Boolean(rid),
  });

  const historyMessages: RawMessage[] = (infiniteData?.pages ?? ([] as Page[])).flatMap((p) => p.messages);

  // Convert raw messages (assumed newest-first) to items with date separators (oldest->newest)
  function buildItems(messages: RawMessage[]) {
    const ordered = [...messages].reverse();
    const items: Array<{ type: 'date' | 'message'; id: string; label?: string; text?: string; time?: string }>
      = [];
    let lastDate: string | null = null;

    for (const m of ordered) {
      const iso = m.createdAt.slice(0, 10);
      if (iso !== lastDate) {
        items.push({ type: 'date', id: `d-${iso}`, label: new Date(iso).toLocaleDateString([], { month: 'long', day: 'numeric' }) });
        lastDate = iso;
      }
      items.push({ type: 'message', id: m.id, text: m.text, time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    }

    return items;
  }

  const items = buildItems(historyMessages);

  return (
    <Box className="flex-1 bg-background-0">
      <Box className="bg-blue-500 rounded-t-2xl py-4 items-center justify-center">
        <Heading className="font-bold text-3xl">
          <Text className="text-white">Chat with </Text>
          <Text className="text-blue-200">{String(name ?? 'Name')}</Text>
        </Heading>
      </Box>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          {isError && (
            <Box className="items-center mb-4">
              <Text className="text-red-500">Failed loading history</Text>
            </Box>
          )}

          {isLoading && (
            <Box className="items-center mb-4">
              <Text className="text-typography-500">Loading history...</Text>
            </Box>
          )}

          {hasNextPage && (
            <Box className="items-center mb-4">
              <Button title={isFetchingNextPage ? 'Loading...' : 'Load more'} onPress={() => fetchNextPage()} />
            </Box>
          )}

          {items.length === 0 && !isLoading && (
            <Box className="items-center my-6">
              <Text className="text-typography-500">No messages yet.</Text>
            </Box>
          )}

          {items.map((it) => {
            if (it.type === 'date') {
              return (
                <Box key={it.id} className="items-center mb-4">
                  <Text className="text-typography-500">{it.label}</Text>
                </Box>
              );
            }

            return (
              <Box key={it.id} className="mb-4 flex-row justify-start">
                <Box className="mr-3">
                  <Avatar size="sm" className="bg-white border-2 border-background-0">
                    <AvatarFallbackText>Dr</AvatarFallbackText>
                  </Avatar>
                </Box>

                <Box>
                  <Box className={`px-4 py-3 rounded-lg break-words bg-blue-200 max-w-[70%]`}>
                    <Text className={`text-typography-900`}>{it.text}</Text>
                  </Box>
                  <Text className="text-typography-500 text-xs mt-1">{it.time}</Text>
                </Box>
              </Box>
            );
          })}
        </ScrollView>

        {/* Note: sending/optimistic updates are task #3 — kept out of this patch */}
      </KeyboardAvoidingView>
    </Box>
  );
}
