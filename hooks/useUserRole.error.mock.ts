// Use this to test error handling
export function useUserRole() {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    error: new Error('Failed to fetch user role'),
  };
}

export function useUser() {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    error: new Error('Failed to fetch user'),
  };
}
