import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter, Link } from 'expo-router';
import { Pressable } from 'react-native';
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { Divider } from '@/components/ui/divider';
import { CheckIcon } from '@/components/ui/icon';
import { useSignIn } from '@clerk/clerk-expo';

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false); // TODO: Implement remember me functionality in future PR

  // Handle the submission of the sign-in form
  const handleLogin = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(protected)/(user)/dashboard'); // need to give roles later
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Box className="flex-1 bg-white">
      {/* HEADER */}
      <Box
        className="h-[230px] w-full rounded-br-[80px] justify-center items-center px-8"
        style={{
          backgroundColor: 'transparent',
          backgroundImage: 'linear-gradient(135deg, #5fa8f5, #6aa8f7, #9ccbf9)',
        }}
      >
        {/* Row container for circle + text */}
        <Box className="flex-row items-center">
          <Box className="bg-[#ddeafe] w-20 h-20 rounded-full mr-1" />
          <Text className="text-black text-3xl font-bold ml-3">BRAND</Text>
        </Box>
      </Box>

      {/* CARD */}
      <Box className="mx-6 mt-[-70px] bg-white p-6 rounded-2xl">
        <Text className="text-3xl font-bold mb-2">Sign in</Text>

        <Box className="flex-row mb-6">
          <Text className="text-gray-500 mr-1">Don’t have an account?</Text>
          <Link href="/(auth)/signup">
            <Text className="text-primary-600 font-semibold">Sign up</Text>
          </Link>
        </Box>

        <Input className="mb-4">
          <InputField
            autoCapitalize="none"
            value={emailAddress}
            placeholder="example@gmail.com"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </Input>

        <Input className="mb-3">
          <InputField
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <InputSlot></InputSlot>
        </Input>

        {/* REMEMBER + FORGOT */}
        <Box className="flex-row justify-between items-center mb-6 w-full">
          <Checkbox
            value="remember"
            isChecked={rememberMe}
            onChange={setRememberMe}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className="ml-1">Remember me</CheckboxLabel>
          </Checkbox>

          <Link href="/(auth)/forgot-password">
            <Text className="text-primary-600 text-sm">Forgot Password?</Text>
          </Link>
        </Box>

        {/* LOGIN BUTTON */}
        <Button
          onPress={handleLogin}
          className="rounded-xl mb-6 h-14 bg-primary-600"
        >
          <ButtonText className="font-bold">Login</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
