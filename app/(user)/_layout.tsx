import { Tabs } from 'expo-router';
import { Home, FileText, Clipboard, User } from 'lucide-react-native';

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color }) => <Clipboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
