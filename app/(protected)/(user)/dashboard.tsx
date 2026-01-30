import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Link } from 'expo-router';

export default function UserDashboard() {
  return (
    <Box className="flex-1 justify-center items-center bg-background-100">
      <Text className="text-3xl font-bold">User Dashboard</Text>
      <Link href="/(protected)/(user)/chat/clinic-1" asChild>
        <Button className="mt-4" size="lg" variant="solid" action="primary">
          <ButtonText>Chat with Clinic</ButtonText>
        </Button>
      </Link>
    </Box>
  );
}
