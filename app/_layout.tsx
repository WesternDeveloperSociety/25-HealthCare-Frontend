import { Platform } from 'react-native';

// Quick dev: set API_BASE_URL based on platform
// Android Emulator: 10.0.2.2, iOS Simulator: localhost
const devOrigin = Platform.OS === 'android' ? 'http://10.0.2.2:5110' : 'http://localhost:5110';
(global as any).API_BASE_URL = (global as any).API_BASE_URL ?? devOrigin;
console.log('DEV: API_BASE_URL =', (global as any).API_BASE_URL);

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Global Providers Only - Keep it simple!
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
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
import { Slot, usePathname } from 'expo-router';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import ClerkTokenSync from '@/components/ClerkTokenSync';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkTokenSync>
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider mode={colorMode}>
            <ThemeProvider
              value={colorMode === 'dark' ? DarkTheme : DefaultTheme}
            >
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
        </QueryClientProvider>
      </ClerkTokenSync>
    </ClerkProvider>
  );
}
