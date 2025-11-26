
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() { 
  const { isSignedIn } = useAuth() // useAuth() access the user's authentication state. 

  // --> if user already signed in, redirect to the home page.
  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}