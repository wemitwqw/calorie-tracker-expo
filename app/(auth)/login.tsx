import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { ROUTES } from '@/constants';

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const redirectUri = Linking.createURL(ROUTES.CALLBACK);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  async function signInWithGoogleWeb() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  }

  async function signInWithGoogleMobile() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });
      
      if (error) throw error;
      if (!data?.url) throw new Error('No OAuth URL returned');
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );
      
      if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
          const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;
        }
      } else if (result.type === 'cancel') {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Error in OAuth flow:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    if (Platform.OS === 'web') {
      signInWithGoogleWeb();
    } else {
      signInWithGoogleMobile();
    }
  }

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="nutrition-outline" size={64} color="#4CAF50" />
        <Text style={styles.title}>Nutrition Tracker</Text>
        <Text style={styles.subtitle}>Sign in to track your nutrition</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginVertical: 24,
  },
  googleButton: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});