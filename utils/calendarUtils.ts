import type { DateData } from 'react-native-calendars';

/**
 * MarkedDates type for react-native-calendars
 */
export type MarkedDates = {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    selectedColor?: string;
    selectedTextColor?: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
    customStyles?: {
      container?: object;
      text?: object;
    };
  };
};

/**
 * Event data structure from the backend
 */
export interface EventData {
  id: string;
  date: string; // ISO date string (e.g., '2025-12-01T10:00:00Z')
  title?: string;
  description?: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * Marking configuration for a single date
 */
export interface DayMarking {
  selected?: boolean;
  marked?: boolean;
  dotColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  customStyles?: {
    container?: object;
    text?: object;
  };
}

/**
 * Transforms an array of events into react-native-calendars markedDates format.
 * Groups events by date and marks them on the calendar.
 *
 * @param eventsData - Array of events from the backend
 * @param selectedDate - Optional currently selected date (YYYY-MM-DD format)
 * @returns MarkedDates object for react-native-calendars
 */
export function transformEventsToMarkedDates(
  eventsData: EventData[],
  selectedDate?: string
): MarkedDates {
  const markedDates: MarkedDates = {};

  // Group events by date and mark them
  eventsData.forEach((event) => {
    const dateKey = event.date.split('T')[0]; // Extract YYYY-MM-DD

    if (!markedDates[dateKey]) {
      markedDates[dateKey] = {
        marked: true,
        dotColor: '#3b82f6', // Blue dot for events
      };
    }
  });

  // Add selected date styling if provided
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#3b82f6',
      selectedTextColor: '#ffffff',
    };
  }

  return markedDates;
}

/**
 * Gets events for a specific date from the events array
 *
 * @param eventsData - Array of events from the backend
 * @param date - Date string in YYYY-MM-DD format
 * @returns Array of events on that date, sorted by time
 */
export function getEventsForDate(eventsData: EventData[], date: string): EventData[] {
  return eventsData
    .filter((event) => event.date.startsWith(date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Formats a date string to a readable format
 *
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "December 1, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats time from ISO date string
 *
 * @param dateString - ISO date string
 * @returns Formatted time string (e.g., "10:00 AM")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
