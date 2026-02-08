import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
    token: string | null;
    user: any | null;
    setToken: (token: string | null) => void;
    setUser: (user: any | null) => void;
    logout: () => void;
}

// Simple persistence helper
const saveToken = async (token: string | null) => {
    if (Platform.OS === 'web') {
        if (token) localStorage.setItem('auth_token', token);
        else localStorage.removeItem('auth_token');
    } else {
        if (token) await SecureStore.setItemAsync('auth_token', token);
        else await SecureStore.deleteItemAsync('auth_token');
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setToken: (token) => {
        saveToken(token);
        set({ token });
    },
    setUser: (user) => set({ user }),
    logout: () => {
        saveToken(null);
        set({ token: null, user: null });
    },
}));

// Initialize token from storage on startup (can be called in _layout)
export const initAuth = async () => {
    let token = null;
    if (Platform.OS === 'web') {
        token = localStorage.getItem('auth_token');
    } else {
        token = await SecureStore.getItemAsync('auth_token');
    }
    if (token) {
        useAuthStore.getState().setToken(token);
    }
};
