import React from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';

export default function RoleSelection() {
  const router = useRouter();
  const { setRole, user } = useUserStore((state) => ({
    setRole: state.setRole,
    user: state.user,
  }));

  const selectRole = async (role: 'doctor' | 'patient') => {
    try {
      // TODO: Call your backend API to update user role
      // const response = await fetch('/api/users/role', {
      //   method: 'POST',
      //   body: JSON.stringify({ role }),
      // });

      // Map UI role to store role type and update local store
      const storeRole = role === 'doctor' ? 'DOCTOR' : 'PATIENT';

      // Check if user exists before updating
      if (!user) {
        console.error('No user found');
        return;
      }

      // Use the setRole method from the store
      setRole(storeRole);

      // Redirect based on role
      if (role === 'doctor') {
        router.replace('/(protected)/(doctor)/dashboard');
      } else {
        router.replace('/(protected)/(user)/dashboard');
      }
    } catch (error) {
      console.error('Error setting role:', error);
    }
  };

  return (
    <Box className="flex-1 justify-center p-6 bg-background-100">
      <Text className="text-lg mb-8 text-center text-gray-600">
        Please select your role to continue
      </Text>

      <Button onPress={() => selectRole('doctor')} className="mb-4 bg-blue-500">
        <ButtonText>I'm a Doctor</ButtonText>
      </Button>

      <Button onPress={() => selectRole('patient')} className="bg-green-500">
        <ButtonText>I'm a Patient</ButtonText>
      </Button>
    </Box>
  );
}
