import React from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
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
        className="rounded-full w-full bg-background-50"
        variant="rounded"
      >
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="py-2 pr-20"
        />
      </Input>

      <Pressable
        onPress={() => onSend(value)}
        disabled={sending || !value.trim()}
        style={{ position: 'absolute', right: 16, top: 12 }}
        accessibilityRole="button"
      >
        <Button
          size="sm"
          variant="solid"
          action="primary"
          disabled={sending || !value.trim()}
        >
          <ButtonText className="text-white">Send</ButtonText>
        </Button>
      </Pressable>
    </Box>
  );
}
