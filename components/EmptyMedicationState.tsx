// components/EmptyMedicationState.tsx
// Empty state when user has no active medications

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';

interface EmptyMedicationStateProps {
  onAddPress: () => void;
}

export default function EmptyMedicationState({ onAddPress }: EmptyMedicationStateProps) {
  return (
    <Center className="flex-1 pb-32 px-6">
      {/* Icon/Illustration */}
      <Box className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-full items-center justify-center mb-6">
        <Text className="text-5xl">💊</Text>
      </Box>

      {/* Heading */}
      <Heading size="xl" className="text-center mb-3">
        No Active Medications
      </Heading>

      {/* Description */}
      <Text className="text-center mb-8 max-w-sm text-gray-600 dark:text-gray-400">
        Start tracking your prescriptions to get refill reminders and never miss a dose
      </Text>

      {/* Add Button */}
      <TouchableOpacity 
        onPress={onAddPress}
        className="bg-blue-600 px-8 py-4 rounded-xl shadow-sm"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold">
          Add Prescription
        </Text>
      </TouchableOpacity>
    </Center>
  );
}