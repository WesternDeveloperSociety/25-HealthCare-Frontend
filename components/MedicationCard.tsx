// components/MedicationCard.tsx
// Individual medication card with refill status

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import CircularProgress from './CircularProgress';
import { Medication } from '../data/mockMedications';
import { 
  calculateRefillStatus, 
  calculateProgress, 
  formatDaysRemaining 
} from '../utils/medicationUtils';

interface MedicationCardProps {
  medication: Medication;
  onPress?: () => void;
}

export default function MedicationCard({ medication, onPress }: MedicationCardProps) {
  const refillStatus = calculateRefillStatus(medication.startDate, medication.duration);
  const progress = calculateProgress(refillStatus.daysRemaining, medication.duration);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-700"
      activeOpacity={0.7}
    >
      <HStack className="items-center justify-between">
        {/* Left: Medication Info */}
        <VStack className="flex-1 mr-4">
          <Text className="text-lg font-bold">
            {medication.name}
          </Text>
          <Text size="sm" className="mt-1 text-gray-600 dark:text-gray-400">
            {medication.dosage} • {medication.frequency}
          </Text>
          <Box className="mt-2">
            <Box 
              className="px-3 py-1 rounded-full self-start"
              style={{ backgroundColor: `${refillStatus.color}15` }}
            >
              <Text 
                size="xs"
                className="font-semibold"
                style={{ color: refillStatus.color }}
              >
                {refillStatus.message}
              </Text>
            </Box>
          </Box>
        </VStack>

        {/* Right: Circular Progress */}
        <VStack className="items-center">
          <CircularProgress
            progress={progress}
            color={refillStatus.color}
            text={formatDaysRemaining(refillStatus.daysRemaining)}
            size={70}
            strokeWidth={7}
          />
          <Text size="xs" className="mt-2 text-gray-500 dark:text-gray-400">
            days left
          </Text>
        </VStack>
      </HStack>

      {/* Additional Info */}
      {medication.instructions && (
        <Box className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Text size="xs" className="text-gray-600 dark:text-gray-400">
            📋 {medication.instructions}
          </Text>
        </Box>
      )}
    </TouchableOpacity>
  );
}