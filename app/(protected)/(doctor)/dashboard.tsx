import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function DoctorDashboard() {
  const router = useRouter();

  return (
    <Box className="flex-1 justify-center items-center bg-background-100">
      <Text className="text-3xl font-bold mb-4">Doctor Dashboard</Text>
      <Button onPress={() => router.push('/(protected)/(doctor)/calendar')}>
        <ButtonText>View Calendar</ButtonText>
      </Button>
    </Box>
  );
}
