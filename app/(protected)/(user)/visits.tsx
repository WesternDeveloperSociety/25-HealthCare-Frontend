import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Avatar } from '@/components/ui/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import DataViewContainer from '@/components/DataViewContainer';

export default function VisitsScreen() {
  const [selectedTab, setSelectedTab] = useState('Calendar');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2025-12-04');

  // Mock appointments data organized by date
  const appointmentsByDate = {
    '2025-12-04': [
      {
        id: 1,
        patientName: 'John Smith',
        description: 'Regular checkup appointment',
        dateTime: '10:00 AM',
        type: 'appointment',
      },
    ],
    '2025-12-05': [
      {
        id: 2,
        patientName: 'Sarah Johnson',
        description: 'Post-surgery follow-up',
        dateTime: '2:00 PM',
        type: 'appointment',
      },
      {
        id: 3,
        patientName: 'Mike Davis',
        description: 'Blood work results review',
        dateTime: '4:30 PM',
        type: 'document',
      },
    ],
    '2025-12-06': [
      {
        id: 4,
        patientName: 'Emma Wilson',
        description: 'Physical therapy session',
        dateTime: '11:00 AM',
        type: 'appointment',
      },
    ],
    '2025-12-10': [
      {
        id: 5,
        patientName: 'System Reminder',
        description: 'Patient needs prescription refill',
        dateTime: '9:00 AM',
        type: 'reminder',
      },
    ],
  };

  // Get appointments for selected date
  const getAppointmentsForDate = (date: string) => {
    const appointments =
      appointmentsByDate[date as keyof typeof appointmentsByDate] || [];

    if (selectedFilter === 'All') {
      return appointments;
    }

    return appointments.filter((appointment) => {
      switch (selectedFilter) {
        case 'Appointments':
          return appointment.type === 'appointment';
        case 'Documents':
          return appointment.type === 'document';
        case 'Reminders':
          return appointment.type === 'reminder';
        default:
          return true;
      }
    });
  };

  // function for dot indicators for dates with appointments
  const getMarkedDates = () => {
    const marked: any = {};

    // Mark dates with appointments
    Object.keys(appointmentsByDate).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: '#4F46E5',
      };
    });

    // Mark selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#4F46E5',
      selectedTextColor: '#ffffff',
    };

    return marked;
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  // Fix timezone issue by parsing date parts manually
  const formatSelectedDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const selectedDateFormatted = formatSelectedDate(selectedDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Box className="flex-1 bg-gray-100">
        <VStack className="px-4 pt-4 pb-2 space-y-4">
          {/* Header */}
          <Heading size="2xl" className="text-black font-bold">
            Visits & Calendar
          </Heading>

          {/* Calendar/Tags Toggle */}
          <HStack className="bg-white rounded-xl p-1">
            <Button
              variant={selectedTab === 'Calendar' ? 'solid' : 'outline'}
              className={`flex-1 ${selectedTab === 'Calendar' ? 'bg-blue-500' : 'bg-transparent border-0'}`}
              onPress={() => setSelectedTab('Calendar')}
            >
              <Text
                className={
                  selectedTab === 'Calendar' ? 'text-white' : 'text-blue-500'
                }
              >
                Calendar
              </Text>
            </Button>
            <Button
              variant={selectedTab === 'Tags' ? 'solid' : 'outline'}
              className={`flex-1 ${selectedTab === 'Tags' ? 'bg-blue-500' : 'bg-transparent border-0'}`}
              onPress={() => setSelectedTab('Tags')}
            >
              <Text
                className={
                  selectedTab === 'Tags' ? 'text-white' : 'text-blue-500'
                }
              >
                Tags
              </Text>
            </Button>
          </HStack>
        </VStack>

        {selectedTab === 'Calendar' ? (
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          >
            <VStack className="space-y-6">
              {/* Calendar */}
              <Card className="bg-white rounded-xl overflow-hidden">
                <Calendar
                  current={selectedDate}
                  onDayPress={(day: {
                    dateString: React.SetStateAction<string>;
                  }) => {
                    setSelectedDate(day.dateString);
                  }}
                  markedDates={getMarkedDates()}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#9CA3AF',
                    selectedDayBackgroundColor: '#4F46E5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#4F46E5',
                    dayTextColor: '#1F2937',
                    textDisabledColor: '#D1D5DB',
                    dotColor: '#4F46E5',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#4F46E5',
                    monthTextColor: '#1F2937',
                    indicatorColor: '#4F46E5',
                    textDayFontWeight: '400',
                    textMonthFontWeight: '600',
                    textDayHeaderFontWeight: '600',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                  hideExtraDays={true}
                  firstDay={0}
                  enableSwipeMonths={true}
                />
              </Card>

              {/* Selected Date's Appointments */}
              <VStack className="space-y-4">
                <Heading size="lg" className="text-black">
                  {selectedDateFormatted}
                </Heading>

                {/* if the selected date has appointments */}
                {selectedDateAppointments.length > 0 ? (
                  selectedDateAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="bg-white rounded-xl p-4"
                    >
                      <HStack className="items-center space-x-4">
                        {/* Blue indicator line */}
                        <Box className="w-1 h-12 bg-blue-500 rounded-full" />

                        {/* Avatar */}
                        <Avatar size="md" className="bg-gray-200">
                          <Text className="text-gray-600 font-medium">
                            {appointment.patientName.charAt(0)}
                          </Text>
                        </Avatar>

                        {/* Appointment Details */}
                        <VStack className="flex-1 space-y-1">
                          <Text className="font-semibold text-gray-900">
                            {appointment.patientName}
                          </Text>
                          <Text className="text-gray-600">
                            {appointment.description}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {appointment.dateTime}
                          </Text>
                        </VStack>

                        {/* Type Badge */}
                        <Box
                          className={`px-2 py-1 rounded-full ${
                            appointment.type === 'appointment'
                              ? 'bg-blue-100'
                              : appointment.type === 'document'
                                ? 'bg-green-100'
                                : 'bg-yellow-100'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              appointment.type === 'appointment'
                                ? 'text-blue-700'
                                : appointment.type === 'document'
                                  ? 'text-green-700'
                                  : 'text-yellow-700'
                            }`}
                          >
                            {appointment.type.charAt(0).toUpperCase() +
                              appointment.type.slice(1)}
                          </Text>
                        </Box>
                      </HStack>
                    </Card>
                  ))
                ) : (
                  //   if date has no appointments
                  <Card className="bg-white rounded-xl p-6">
                    <Text className="text-gray-500 text-center">
                      No appointments for this date
                    </Text>
                  </Card>
                )}
              </VStack>
            </VStack>
          </ScrollView>
        ) : (
          <Box className="flex-1" style={{ paddingBottom: 110 }}>
            <DataViewContainer />
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
}
