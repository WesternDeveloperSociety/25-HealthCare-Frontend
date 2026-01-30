import { Tabs } from 'expo-router';
import CustomNavBar from '@/components/CustomNavBar';

export default function UserLayout() {
  return (
    <Tabs
      tabBar={() => <CustomNavBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="upload" />
      <Tabs.Screen name="services" />
      <Tabs.Screen name="visits" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
