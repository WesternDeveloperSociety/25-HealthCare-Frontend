import React from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from 'react-native';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: (text: string) => void;
  sending?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  sending = false,
  placeholder = 'Send a message...',
}: Props) {
  return (
    <Box className="relative">
      <Input
        size="xl"
        className="rounded-full w-full bg-background-50 pl-4 pr-1"
        variant="rounded"
      >
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="py-2 flex-1"
        />
        <InputSlot className="mr-1">
          <Button
            size="md"
            className={`h-9 px-4 rounded-full bg-blue-500 ${sending || !value.trim() ? 'opacity-60' : ''}`}
            onPress={() => onSend(value)}
            disabled={sending || !value.trim()}
          >
            <ButtonText className="text-white">Send</ButtonText>
          </Button>
        </InputSlot>
      </Input>
    </Box>
  );
}
