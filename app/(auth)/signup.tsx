// app/(auth)/signup.tsx
import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter, Link } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useUserStore } from '@/store/userStore';

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const handleSignup = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
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
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        // TODO: call backend /api/users/me to get full user record (id, role, names)
        // Use the Zustand store getter so this works outside of React hooks.
        useUserStore
          .getState()
          .setUser({
            id: '',
            clerkID: emailAddress,
            email: emailAddress,
            role: null,
          });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <InputField
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button onPress={handleVerifyPress}>
          <Text>Verify</Text>
        </Button>
      </>
    );
  }
  return (
    <Box className="flex-1 justify-center p-6 bg-background-100">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>

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
