import { Zodios, makeApi } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { api as generatedApi } from '../schemas/api';
import { useAuthStore } from '../store/authStore';

// Get the API URL from environment variable or default to localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// 1. Create the Zodios client using the generated API definition
export const apiClient = new Zodios(API_URL, generatedApi.api);

// 2. Add an interceptor to inject the token
apiClient.axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Create the React hooks
export const useApi = new ZodiosHooks('api', apiClient);
