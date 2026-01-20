import React from 'react';
import { X } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { EventData, formatDate, formatTime } from '@/utils/calendarUtils';

interface DayPressPopupProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Selected date in YYYY-MM-DD format */
  selectedDate: string | null;
  /** Events for the selected date */
  events: EventData[];
  /** Callback when an event is pressed */
  onEventPress?: (event: EventData) => void;
  /** Callback when "Add Event" is pressed */
  onAddEvent?: (date: string) => void;
}

/**
 * Pop-up component for displaying events when a day is pressed on the calendar.
 * This component is triggered by onDayPress(day) in the Calendar component.
 *
 * Usage with react-native-calendars:
 * ```tsx
 * const [selectedDate, setSelectedDate] = useState<string | null>(null);
 * const [showPopup, setShowPopup] = useState(false);
 *
 * // In your onDayPress handler, update markedDates with selected: true
 * const onDayPress = (day: DateData) => {
 *   setSelectedDate(day.dateString);
 *   setShowPopup(true);
 * };
 *
 * // markedDates should include selected: true for the selectedDate
 * const markedDates = transformEventsToMarkedDates(eventsData, selectedDate);
 *
 * <DayPressPopup
 *   isOpen={showPopup}
 *   onClose={() => setShowPopup(false)}
 *   selectedDate={selectedDate}
 *   events={getEventsForDate(eventsData, selectedDate)}
 * />
 * ```
 */
export default function DayPressPopup({
  isOpen,
  onClose,
  selectedDate,
  events,
  onEventPress,
  onAddEvent,
}: DayPressPopupProps) {
  const handleAddEvent = () => {
    if (selectedDate && onAddEvent) {
      onAddEvent(selectedDate);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" className="text-typography-950">
            {selectedDate ? formatDate(selectedDate) : 'Select a Date'}
          </Heading>
          <ModalCloseButton onPress={onClose}>
            <X size={20} color="#6b7280" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {events.length > 0 ? (
            <VStack space="md">
              <Text className="text-typography-600 text-sm font-medium">
                Events ({events.length})
              </Text>
              {events.map((event) => (
                <Pressable
                  key={event.id}
                  onPress={() => onEventPress?.(event)}
                  className="p-3 bg-background-50 rounded-lg border border-outline-100"
                >
                  <HStack className="justify-between items-start">
                    <VStack space="xs" className="flex-1">
                      <Text className="text-typography-900 font-medium">
                        {event.title || event.type || 'Event'}
                      </Text>
                      {event.description && (
                        <Text className="text-typography-600 text-sm" numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
                    </VStack>
                    <Text className="text-typography-500 text-sm">
                      {formatTime(event.date)}
                    </Text>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          ) : (
            <VStack space="sm" className="items-center py-4">
              <Text className="text-typography-500 text-center">
                No events scheduled for this day.
              </Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onPress={onClose} className="mr-2">
            <ButtonText>Close</ButtonText>
          </Button>
          {onAddEvent && (
            <Button onPress={handleAddEvent}>
              <ButtonText>Add Event</ButtonText>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
