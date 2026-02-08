import { Zodios, makeApi } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { api as generatedApi } from '../schemas/api';
import { useAuthStore } from '../store/authStore';

import { Platform } from 'react-native';

// Get the API URL from environment variable
// Fallback logic:
// - Android Emulator: 10.0.2.2:5110
// - iOS Simulator / Web: localhost:5110
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5110/api' : 'http://localhost:5110/api';
const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

// 1. Create the Zodios client using the generated API definition
export const apiClient = new Zodios(API_URL, generatedApi.api);

import type { InternalAxiosRequestConfig } from 'axios';

// 2. Add an interceptor to inject the token
apiClient.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Create the React hooks
export const useApi = new ZodiosHooks('api', apiClient);
