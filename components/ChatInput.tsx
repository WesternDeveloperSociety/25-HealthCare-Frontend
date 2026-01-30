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

<<<<<<< Updated upstream
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
=======
			<Pressable
				onPress={() => {
					console.log('ChatInput: onPress send value=', value);
					// onSend(value);
				}}
				disabled={sending || !value.trim()}
				style={{ position: 'absolute', right: 10, top: 8 }}
				accessibilityRole="button"
			>
				<Button
					size="md"
					className={`h-8 px-4 rounded-full bg-blue-500 ${sending || !value.trim() ? 'opacity-60' : ''}`}
					onPress={() => onSend(value)}
					disabled={sending || !value.trim()}
				>
					<ButtonText className="text-white">Send</ButtonText>
				</Button>
			</Pressable>
		</Box>
	);
>>>>>>> Stashed changes
}
