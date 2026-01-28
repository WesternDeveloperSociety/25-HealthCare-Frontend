import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  profileImage?: string;
  specialty?: string;
  npi?: string;
  licenseNumber?: string;
}

async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getCurrentUser: () => apiRequest<User>('/api/users/me'),

  updateUser: (data: Partial<User>) =>
    apiRequest<User>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
