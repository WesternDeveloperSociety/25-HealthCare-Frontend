import React from 'react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';

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
  const disabled = sending || !value.trim();

  return (
    <HStack space="sm" className="items-center">
      <Box className="flex-1">
        <Input
          size="xl"
          className="rounded-full bg-background-50"
          variant="rounded"
        >
          <InputField
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={() => {
              if (!disabled) onSend(value);
            }}
            returnKeyType="send"
            className="py-2 px-4"
          />
        </Input>
      </Box>
      <Button
        size="md"
        className={`h-11 px-5 rounded-full bg-blue-500 ${disabled ? 'opacity-50' : ''}`}
        onPress={() => onSend(value)}
        disabled={disabled}
      >
        <ButtonText className="text-white font-semibold">Send</ButtonText>
      </Button>
    </HStack>
  );
}
