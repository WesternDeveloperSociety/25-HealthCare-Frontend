import React from 'react';
import {
  Upload,
  SquareActivity,
  HeartPlus,
  Calendar,
  UserRound,
  Pill,
} from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import CustomNavBar from './customNavBar';

function TabBarIcon({ color, Icon }: { color: string; Icon: any }) {
  return <Icon color={color} size={22} />;
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen
          name="upload"
          options={{
            title: 'Upload',
            tabBarIcon: ({ color }) => (
              <TabBarIcon color={color} Icon={Upload} />
            ),
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ color }) => (
              <TabBarIcon color={color} Icon={SquareActivity} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <TabBarIcon color={color} Icon={HeartPlus} />
            ),
          }}
        />
        <Tabs.Screen
          name="visits"
          options={{
            title: 'Visits',
            tabBarIcon: ({ color }) => (
              <TabBarIcon color={color} Icon={Calendar} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <TabBarIcon color={color} Icon={UserRound} />
            ),
          }}
        />
        <Tabs.Screen
          name="medications"
          options={{
            title: 'Medications',
            tabBarIcon: ({ color }) => <TabBarIcon color={color} Icon={Pill} />,
          }}
        />
      </Tabs>

      <CustomNavBar />
    </>
  );
}
