import React, { ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface AdminAccessProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render content only for admin users
 * @param children Content to show to admin users
 * @param fallback Optional content to show to non-admin users (defaults to null)
 */
export default function AdminAccess({ children, fallback = null }: AdminAccessProps) {
  const { isAdmin } = useAuthStore();
  
  return isAdmin ? <>{children}</> : <>{fallback}</>;
}