import { type UserRole } from '@/lib/api';

// Change this to test different roles: 'DOCTOR', 'PATIENT', or 'ADMIN'
const MOCK_ROLE: UserRole = 'DOCTOR';

export function useUserRole() {
  return {
    data: MOCK_ROLE,
    isLoading: false,
    isError: false,
  };
}

export function useUser() {
  return {
    data: {
      id: 'mock-id',
      clerkId: 'mock-clerk-id',
      email: 'test@example.com',
      role: MOCK_ROLE,
      firstName: 'Test',
      lastName: 'User',
    },
    isLoading: false,
    isError: false,
  };
}
