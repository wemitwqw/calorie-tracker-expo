import { Stack } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { ROUTES } from '@/constants';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const session = useAuthStore(state => state.session);
  const isLoading = useAuthStore(state => state.isLoading);

  const signOut = useAuthStore(state => state.signOut);

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
    <Stack screenOptions={{
      headerShown: true,
    }}>
      <Stack.Screen
        name="index"
        options={{
          title: '',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.signOutButton} 
              onPress={signOut}
            >
              <Ionicons name="exit-outline" size={28} color="red"/>
            </TouchableOpacity>
          ),
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
          title: 'Whitelisted Emails',
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
  signOutButton: {
    padding: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#f44336',
    fontWeight: '500',
  },
});