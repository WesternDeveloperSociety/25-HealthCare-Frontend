import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { usePathname, router } from 'expo-router';
import {
  Upload,
  HeartPlus,
  Calendar,
  UserRound,
  Pill,
} from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';

export default function CustomNavBar() {
  const pathname = usePathname();

  const tabs: Array<{
    name: string;
    label: string,
    icon: any;
    route: string;
  }> = [
      { name: 'upload', label: 'Upload', icon: Upload, route: '/(protected)/(user)/upload' },
      { name: 'medications', label: 'Meds', icon: Pill, route: '/(protected)/(user)/medications' },
      { name: 'dashboard', label: 'Home', icon: HeartPlus, route: '/(protected)/(user)/dashboard' },
      { name: 'visits', label: 'Visits', icon: Calendar, route: '/(protected)/(user)/visits' },
      { name: 'profile', label: 'Profile', icon: UserRound, route: '/(protected)/(user)/profile' },
    ];

  return (
    <Box
      style={{ backgroundColor: '#0a7ea4' }}
      className="absolute bottom-6 left-4 right-4 p-4 rounded-3xl shadow-lg"
    >
      <HStack className="justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Check if current path starts with the tab route (handling nested routes potentially)
          const active = pathname.includes(tab.name);

          return (
            <Pressable
              key={tab.name}
              className="flex-1"
              onPress={() => router.push(tab.route as any)}
            >
              <Center>
                <Icon size={24} color={active ? '#c1bfbfff' : '#ffffffff'} />
                {/* Optional label */}
                <Text
                  className={`mt-1 text-xs ${active ? 'text-gray-300' : 'text-white'}`}
                >
                  {tab.label}
                </Text>
              </Center>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}
