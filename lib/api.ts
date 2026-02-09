import { Zodios, makeApi } from '@zodios/core';
import { ZodiosHooks } from '@zodios/react';
import { api as generatedApi } from '../schemas/api';
import { useAuthStore } from '../store/authStore';

import { Platform } from 'react-native';

// Single source of truth for the backend URL.
// Set EXPO_PUBLIC_API_URL in .env (see .env.example).
// Fallback: Android emulator needs 10.0.2.2 to reach the host machine;
// iOS simulator and web can use localhost.
const DEFAULT_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:5110' : 'http://localhost:5110';

/**
 * Base URL for the backend server (no trailing slash, no /api suffix).
 * Other modules that need to make direct HTTP calls should import this
 * instead of hardcoding their own URL.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || DEFAULT_BASE;

const API_URL = `${API_BASE_URL}/api`;

// 1. Create the Zodios client using the generated API definition
export const apiClient = new Zodios(API_URL, generatedApi.api);

import type { InternalAxiosRequestConfig } from 'axios';

// 2. Add an interceptor to inject the token
apiClient.axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// 3. Create the React hooks
export const useApi = new ZodiosHooks('api', apiClient);
