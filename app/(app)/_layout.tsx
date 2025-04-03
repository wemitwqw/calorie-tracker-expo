import { Stack } from 'expo-router';
import { useAuth } from '../../context/auth';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { ROUTES } from '@/routes';

export default function AppLayout() {
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.LOGIN);
    }
  }, [session]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Nutrition Tracker',
        }}
      />
      <Stack.Screen
        name="add-meal"
        options={{
          title: 'Add Meal',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="admin/whitelist"
        options={{
          title: 'Account Whitelist',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
