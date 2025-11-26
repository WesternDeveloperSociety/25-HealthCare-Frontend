import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, Link } from "expo-router";
import { Pressable } from "react-native";
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { CheckIcon } from "@/components/ui/icon";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const mockRole = email.includes("doc") ? "doctor" : "user";
    if (mockRole === "doctor") {
      router.replace("/(doctor)/dashboard");
    } else {
      router.replace("/(user)/dashboard");
    }
  };

  return (
    <Box className="flex-1 bg-white">
      {/* HEADER */}
      <Box
        className="h-[230px] w-full rounded-br-[80px] justify-center items-center px-8"
        style={{
            backgroundColor: "transparent",
            backgroundImage: "linear-gradient(135deg, #5fa8f5, #6aa8f7, #9ccbf9)",
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
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
        </Input>

        <Input className="mb-3">
          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <InputSlot>
          </InputSlot>
        </Input>

        {/* REMEMBER + FORGOT */}
        <Box className="flex-row justify-between items-center mb-6">
          <Checkbox value="remember">
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon}/>
            </CheckboxIndicator>
            <CheckboxLabel className="ml-1">Remember me</CheckboxLabel>
          </Checkbox>

          <Pressable>
            <Text className="text-primary-600 text-sm">Forgot Password?</Text>
          </Pressable>
        </Box>

        {/* LOGIN BUTTON */}
        <Button onPress={handleLogin} className="rounded-xl mb-6 h-14 bg-primary-600">
          <ButtonText className="font-bold">Login</ButtonText>
        </Button>

        {/* DIVIDER */}
        <Box className="flex-row items-center my-4">
          <Divider className="flex-1 mr-3" />
          <Text className="text-gray-500 text-sm">OR CONTINUE WITH</Text>
          <Divider className="flex-1 ml-3" />
        </Box>

        {/* SOCIAL BUTTONS */}
        <Box className="flex-row justify-center space-x-6 mt-4">
          <Pressable>
            <Box className="p-4 w-24 h-12 mr-3 border border-gray-300 rounded-md">
            </Box>
          </Pressable>

          <Pressable>
            <Box className="p-4 w-24 h-12 mr-3 border border-gray-300 rounded-md">
              {/* <Twitter size={22} /> */}
            </Box>
          </Pressable>

          <Pressable>
            <Box className="p-4 w-24 h-12 border border-gray-300 rounded-md">
              {/* <Github size={22} /> */}
            </Box>
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}
