// app/(auth)/signup.tsx
import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter, Link, Redirect } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useUserStore } from '@/store/userStore';

import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();

  // All hooks must be declared before any early returns
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Redirect after hooks are declared
  if (isSignedIn) {
    return <Redirect href="/(protected)/(user)/dashboard" />;
  }

  const handleSignup = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(err);
    }

    // // TODO: create account then redirect
    // router.replace("/(auth)/login");
  };
  // Handle submission of verification form
  const handleVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        // TODO: call backend /api/users/me to get full user record (id, role, names)
        // Sync user to backend DB
        await syncUserWithBackend();

        // Use the Zustand store getter so this works outside of React hooks.
        useUserStore.getState().setUser({
          id: '',
          clerkID: emailAddress,
          email: emailAddress,
          role: null,
        });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signUpAttempt);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(err);

      // Check if the error is "already verified"
      if (err.errors?.[0]?.code === 'verification_already_verified') {
        // If it's already verified, we can check if the signup is complete
        // and if so, try to set active.
        if (signUp.status === 'complete') {
          await setActive({ session: signUp.createdSessionId });
          await syncUserWithBackend();
          useUserStore.getState().setUser({
            id: '',
            clerkID: emailAddress,
            email: emailAddress,
            role: null,
          });
          router.replace('/');
          return;
        }
      }

      const errorMessage =
        err.errors?.[0]?.message || err.message || 'An unknown error occurred';
      alert(errorMessage);
    }
  };

  const syncUserWithBackend = async () => {
    try {
      const axios = (await import('axios')).default;
      const baseUrl =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:5110'
          : 'http://localhost:5110';

      // Get auth token from Clerk
      const token = await getToken();

      await axios.post(
        `${baseUrl}/api/users`,
        {
          role: 'PATIENT',
          email: emailAddress.toLowerCase(),
          firstName,
          lastName,
          phoneNumber: '0000000000',
          dateOfBirth: new Date().toISOString(),
          gender: 'PREFER_NOT_TO_SAY',
          emergencyContactName: 'None',
          emergencyContactPhone: '0000000000',
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
    } catch (error: any) {
      console.error(
        'Failed to sync user with backend:',
        error?.response?.data || error
      );
    }
  };

  if (pendingVerification) {
    return (
      <Box className="flex-1 justify-center p-6 bg-background-100">
        <Text className="text-3xl font-bold mb-8">Verify your email</Text>
        <Input className="mb-4">
          <InputField
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
        </Input>
        <Button onPress={handleVerifyPress}>
          <ButtonText>Verify</ButtonText>
        </Button>
      </Box>
    );
  }
  return (
    <Box className="flex-1 justify-center p-6 bg-background-100">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>

      <Input className="mb-4">
        <InputField
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </Input>
      <Input className="mb-4">
        <InputField
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </Input>

      <Input className="mb-4">
        <InputField
          placeholder="Email"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={(email) => setEmailAddress(email)}
        />
      </Input>

      <Input className="mb-6">
        <InputField
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </Input>

      <Button onPress={handleSignup}>
        <ButtonText>Sign Up</ButtonText>
      </Button>

      <Link href="/(auth)/login">
        <Text className="text-primary-500 mt-4 text-center">
          Already have an account? Login
        </Text>
      </Link>
    </Box>
  );
}
