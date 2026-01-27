// utils/notificationUtils.ts
// Setup and schedule medication refill notifications using expo-notifications

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../data/mockMedications';
import { calculateRefillStatus } from './medicationUtils';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  // Configure Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Medication Refill Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
    });
  }

  return true;
}

/**
 * Schedule a notification 48 hours before medication expiry
 * @param medication - Medication object
 * @returns Notification ID or null if scheduling failed
 */
export async function scheduleMedicationNotification(
  medication: Medication
): Promise<string | null> {
  try {
    const refillStatus = calculateRefillStatus(medication.startDate, medication.duration);
    
    // Only schedule if medication hasn't expired
    if (refillStatus.daysRemaining <= 0) {
      console.log(`Medication ${medication.name} has expired, not scheduling notification`);
      return null;
    }

    // Calculate trigger time (48 hours before expiry)
    const startDate = new Date(medication.startDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + medication.duration);
    
    const notificationTime = new Date(expiryDate);
    notificationTime.setHours(notificationTime.getHours() - 48); // 48 hours before

    // Don't schedule if notification time is in the past
    const now = new Date();
    if (notificationTime <= now) {
      console.log(`Notification time for ${medication.name} is in the past, skipping`);
      return null;
    }

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Medication Refill Reminder',
        body: `Time to refill ${medication.name} (${medication.dosage}). Only 2 days of supply remaining.`,
        data: { 
          medicationId: medication.id,
          medicationName: medication.name,
          type: 'refill-reminder'
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationTime,
      }
    });

    console.log(`Scheduled notification for ${medication.name} at ${notificationTime.toISOString()}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Schedule notifications for all active medications
 * @param medications - Array of medications
 */
export async function scheduleAllMedicationNotifications(
  medications: Medication[]
): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  
  if (!hasPermission) {
    console.log('Cannot schedule notifications without permission');
    return;
  }

  // Cancel all existing medication notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule new notifications
  const scheduledCount = await Promise.all(
    medications.map(med => scheduleMedicationNotification(med))
  );

  const successCount = scheduledCount.filter(id => id !== null).length;
  console.log(`Scheduled ${successCount} medication notifications`);
}

/**
 * Cancel all medication notifications
 */
export async function cancelAllMedicationNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Cancelled all medication notifications');
}