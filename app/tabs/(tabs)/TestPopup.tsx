import React, { useState, useMemo } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { Box } from '@/components/ui/box';
import DayPressPopup from '@/components/DayPressPopup';
import {
  transformEventsToMarkedDates,
  getEventsForDate,
  EventData,
} from '@/utils/calendarUtils';

const EVENTS: EventData[] = [
  {
    id: '1',
    date: '2025-12-05T10:00:00Z',
    title: 'Doctor Appointment',
    description: 'Annual checkup with Dr. Smith',
    type: 'appointment',
  },
  {
    id: '2',
    date: '2025-12-05T14:30:00Z',
    title: 'Lab Work',
    description: 'Blood test follow-up',
    type: 'lab',
  },
  {
    id: '3',
    date: '2025-12-10T09:00:00Z',
    title: 'Dental Cleaning',
    description: 'Routine dental visit',
    type: 'appointment',
  },
  {
    id: '4',
    date: '2025-12-15T11:00:00Z',
    title: 'Specialist Visit',
    description: 'Consultation appointment',
    type: 'consultation',
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const markedDates = useMemo(() => {
    return transformEventsToMarkedDates(EVENTS, selectedDate || undefined);
  }, [selectedDate]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setShowPopup(true);
  };

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(EVENTS, selectedDate);
  }, [selectedDate]);

  return (
    <Box className="flex-1 bg-background-0">
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#3b82f6',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3b82f6',
          dotColor: '#3b82f6',
          arrowColor: '#3b82f6',
        }}
      />

      <DayPressPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        selectedDate={selectedDate}
        events={selectedEvents}
        onEventPress={() => setShowPopup(false)}
        onAddEvent={(date) => console.log('Add event for:', date)}
      />
    </Box>
  );
}
