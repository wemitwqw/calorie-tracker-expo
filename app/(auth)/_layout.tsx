import { Stack } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { ROUTES } from '@/constants';

export default function AuthLayout() {
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (session) {
      router.replace(ROUTES.HOME);
    }
  }, [session]);

  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="callback" />
    </Stack>
  );
}