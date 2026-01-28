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
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Toggle between these imports to use mock data for testing without API
// import { useUserRole } from '@/hooks/useUserRole';
import { useUserRole } from '@/hooks/useUserRole.mock';
import { LoadingScreen } from '@/components/LoadingScreen';

const queryClient = new QueryClient();

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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const { data: role, isLoading, isError } = useUserRole();

  // Track when component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Role-based routing logic
  useEffect(() => {
    // Wait for component to be fully mounted
    if (!isMounted) {
      return;
    }

    // Skip routing logic if we're already on a role-specific route
    if (pathname.startsWith('/(doctor)') || pathname.startsWith('/(user)')) {
      return;
    }

    // Skip if still loading or there's an error
    if (isLoading || isError || !role) {
      return;
    }

    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      // Redirect based on role
      if (role === 'DOCTOR') {
        router.replace('/(doctor)/home');
      } else if (role === 'PATIENT' || role === 'ADMIN') {
        // Treat PATIENT and ADMIN as regular users for now
        router.replace('/(user)/home');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [role, isLoading, isError, pathname, router, isMounted]);

  // Show loading screen while determining role
  if (isLoading && !pathname.startsWith('/(doctor)') && !pathname.startsWith('/(user)')) {
    return (
      <GluestackUIProvider mode={colorMode}>
        <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
          <LoadingScreen />
        </ThemeProvider>
      </GluestackUIProvider>
    );
  }

  return (
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
  );
}
