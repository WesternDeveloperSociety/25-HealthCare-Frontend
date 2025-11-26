// app/(auth)/signup.tsx
import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, Link } from "expo-router";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // TODO: create account then redirect
    router.replace("/(auth)/login");
  };

  return (
    <Box className="flex-1 justify-center p-6 bg-background-100">
      <Text className="text-3xl font-bold mb-8">Create Account</Text>

      <Input className="mb-4">
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </Input>

      <Input className="mb-6">
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
