import { Stack } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { ROUTES } from '@/constants';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function AppLayout() {
  const session = useAuthStore(state => state.session);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace(ROUTES.LOGIN);
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  
  if (!session) {
    return null;
  }

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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});