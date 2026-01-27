// app/(tabs)/(tabs)/medications.tsx
// Main medication tracker screen with refill reminders

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  useColorScheme
} from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import MedicationCard from '../../../components/MedicationCard';
import EmptyMedicationState from '../../../components/EmptyMedicationState';
import { mockMedications, Medication } from '../../../data/mockMedications';
import {
  scheduleAllMedicationNotifications,
  requestNotificationPermissions,
} from '../../../utils/notificationUtils';

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Initialize medications and setup notifications
  useEffect(() => {
    loadMedications();
    setupNotifications();
  }, []);

  // Schedule notifications whenever medications change
  useEffect(() => {
    if (medications.length > 0 && notificationsEnabled) {
      scheduleAllMedicationNotifications(medications);
    }
  }, [medications, notificationsEnabled]);

  const loadMedications = () => {
    setMedications(mockMedications);
  };

  const setupNotifications = async () => {
    const hasPermission = await requestNotificationPermissions();
    setNotificationsEnabled(hasPermission);

    if (!hasPermission) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications to receive medication refill reminders',
        [
          { text: 'Not Now', style: 'cancel' },
          {
            text: 'Enable',
            onPress: async () => {
              if (Platform.OS === 'ios') {
                Alert.alert(
                  'Enable Notifications',
                  'Go to Settings > Notifications > [App Name] to enable notifications'
                );
              } else {
                const granted = await requestNotificationPermissions();
                setNotificationsEnabled(granted);
              }
            },
          },
        ]
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadMedications();
    if (notificationsEnabled) {
      await scheduleAllMedicationNotifications(medications);
    }
    setRefreshing(false);
  };

  const handleAddPrescription = () => {
    Alert.alert(
      'Add Prescription',
      'Feature coming soon! You will be able to add new prescriptions here.',
      [{ text: 'OK' }]
    );
  };

  const handleMedicationPress = (medication: Medication) => {
    Alert.alert(
      medication.name,
      `Dosage: ${medication.dosage}\nFrequency: ${medication.frequency}\nPrescribed by: ${medication.prescribedBy}\n\n${medication.instructions || ''}`,
      [{ text: 'OK' }]
    );
  };

  // Empty state
  if (medications.length === 0) {
    return (
      <View className="flex-1">
        <EmptyMedicationState onAddPress={handleAddPrescription} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Box className="pt-14 pb-4 px-6">
        <HStack className="justify-between items-center">
          <VStack>
            <Heading size="xl">My Medications</Heading>
            <Text size="sm" className="mt-1">
              {medications.length} active prescription{medications.length !== 1 ? 's' : ''}
            </Text>
          </VStack>
          <TouchableOpacity 
            onPress={handleAddPrescription}
            className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center shadow-sm"
          >
            <Text className="text-white text-2xl font-light">+</Text>
          </TouchableOpacity>
        </HStack>
      </Box>

      {/* Medication List */}
      <ScrollView
        className="flex-1 pb-32"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
      >
        {/* Notification Status Banner */}
        {!notificationsEnabled && (
          <TouchableOpacity 
            onPress={setupNotifications}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4"
          >
            <HStack className="items-center">
              <Text className="text-3xl mr-3">🔔</Text>
              <VStack className="flex-1">
                <Text className="text-amber-900 font-semibold mb-1">
                  Enable Refill Reminders
                </Text>
                <Text size="sm" className="text-amber-700">
                  Get notified 2 days before your medications run out
                </Text>
              </VStack>
            </HStack>
          </TouchableOpacity>
        )}

        {/* Medication Cards */}
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            onPress={() => handleMedicationPress(medication)}
          />
        ))}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}