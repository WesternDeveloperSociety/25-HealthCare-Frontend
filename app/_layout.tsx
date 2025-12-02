// Global Providers + Auth Provider

import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'


import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { useUser } from '@clerk/clerk-expo'
import { useUserStore } from '@/store/userStore'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const clerkUser = useUser()
  useEffect(() => {
    if (clerkUser?.isSignedIn) {
      const userObject = clerkUser.user
      if (userObject) {
        useUserStore.getState().setUser({ id: '', clerkID: userObject.id, email: userObject.primaryEmailAddress?.emailAddress || userObject.emailAddresses?.[0]?.emailAddress || '', role: null })
      }
    }
    else {
    // signed out
    useUserStore.getState().clearUser()
    }
  }, [clerkUser])
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <GluestackUIProvider mode={colorMode}>
        <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
          {pathname === '/' && (
            <Fab
              onPress={() =>
                setColorMode(colorMode === 'dark' ? 'light' : 'dark')
              }
              className="m-6"
              size="lg"
            >
              <FabIcon as={colorMode === 'dark' ? MoonIcon : SunIcon} />
            </Fab>
          )}
        </ThemeProvider>
      </GluestackUIProvider>
    </ClerkProvider>
  );
}
