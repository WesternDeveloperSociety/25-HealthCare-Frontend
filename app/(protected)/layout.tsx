// app/(protected)/_layout.tsx
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect, Slot } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const clerkUser = useUser();
  
  // Sync Clerk user with local store when in protected routes
  useEffect(() => {
    if (isSignedIn && clerkUser?.user) {
      const userObject = clerkUser.user;
      useUserStore.getState().setUser({ 
        id: '', 
        clerkID: userObject.id, 
        email: userObject.primaryEmailAddress?.emailAddress || userObject.emailAddresses?.[0]?.emailAddress || '', 
        role: useUserStore.getState().user?.role || null // Preserve existing role
      });
    } else if (!isSignedIn) {
      // Clear user when signed out
      useUserStore.getState().clearUser();
    }
  }, [isSignedIn, clerkUser]);
  
  if (!isLoaded) return null; // Loading state
  
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Slot />;
}