import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Box className="flex-1 justify-center items-center bg-background-100">
      <Text className="text-xl mb-4">Profile Page</Text>
      <Button onPress={handleSignOut} action="negative">
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </Box>
  );
}
