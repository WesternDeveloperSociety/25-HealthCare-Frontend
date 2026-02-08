import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // Loading state

  // If user already signed in, redirect to role selection or dashboard
  // Redirect logic Removed to prevent infinite loop
  // Individual pages (login/signup) will handle redirects if needed

  // Hide header for all auth screens
  return <Stack screenOptions={{ headerShown: false }} />;
}
