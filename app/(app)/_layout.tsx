import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants';

export default function AppLayout() {
  const session = useAuthStore(state => state.session);
  const isLoading = useAuthStore(state => state.isLoading);
  const signOut = useAuthStore(state => state.signOut);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace(ROUTES.LOGIN);
    }
  }, [session, isLoading]);

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
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(ROUTES.PRODUCTS)}
              >
                <Ionicons name="nutrition-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={signOut}
              >
                <Ionicons name="exit-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
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
      <Stack.Screen
        name="products/index"
        options={{
          title: 'Products',
        }}
      />
      <Stack.Screen
        name="products/add"
        options={{
          title: 'Add Product',
        }}
      />
      <Stack.Screen
        name="products/edit"
        options={{
          title: 'Edit Product',
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
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 15,
    padding: 3,
  },
});