import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';

export function LoadingScreen() {
  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      <Spinner size="large" />
      <Text className="mt-4 text-typography-500">Loading...</Text>
    </Box>
  );
}
