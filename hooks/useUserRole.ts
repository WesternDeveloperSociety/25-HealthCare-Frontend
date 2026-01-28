import { useQuery } from '@tanstack/react-query';
import { api, type UserRole } from '@/lib/api';

export function useUserRole() {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const user = await api.getCurrentUser();
      return user.role;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: api.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
