import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useAuthStore } from '@/store/authStore';

/**
 * This component syncs the Clerk token to the authStore,
 * allowing the Zodios API client to use it in request interceptors.
 */
export default function ClerkTokenSync({ children }: { children: React.ReactNode }) {
    const { getToken, isSignedIn } = useAuth();
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                const token = await getToken();
                setToken(token);
            } else {
                setToken(null);
            }
        };

        syncToken();
    }, [isSignedIn, getToken, setToken]);

    return <>{children}</>;
}
