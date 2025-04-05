import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants';

/**
 * Hook to protect routes that require admin access
 * @param redirectTo Where to redirect non-admin users, defaults to home
 * @returns Object containing authentication state information
 */
export function useAdminProtection(redirectTo = ROUTES.HOME) {
  const router = useRouter();
  const { session, isLoading, isAdmin, checkIsAdmin } = useAuthStore();
  
  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    checkIsAdmin().then(() => {
      if (!isAdmin) {
        router.replace(redirectTo);
      }
    });
  }, [session, isLoading, isAdmin, redirectTo, router, checkIsAdmin]);
  
  return {
    session,
    isLoading: isLoading || (!!session && isAdmin === undefined),
    isAdmin,
    isAuthenticated: !!session,
  };
}