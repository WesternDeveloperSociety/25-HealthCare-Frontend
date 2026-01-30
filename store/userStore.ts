import { create } from 'zustand';

// Removed MMKV storage implementation

export interface User {
  id: string;
  clerkID: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'DOCTOR' | 'PATIENT' | null;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setRole: (role: 'DOCTOR' | 'PATIENT') => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  setRole: (role) =>
    set((state) => ({ user: state.user ? { ...state.user, role } : null })),
}));
