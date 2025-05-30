import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { supabase } from '../../config/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { handleDiscordSignIn, handleGoogleSignIn } from '@/services/auth.service';

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

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
        <Text style={styles.title}>n&27b-X&lt;#</Text>
        <Text style={styles.subtitle}>Sign in to track your calories</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={() => handleGoogleSignIn({ setIsLoading })}
          disabled={isLoading}
        >
          <Ionicons name="logo-google" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.discordButton} 
          onPress={() => handleDiscordSignIn({ setIsLoading })}
          disabled={isLoading}
        >
          <Ionicons name="logo-discord" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Continue with Discord'}
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
    gap: 16,
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
  discordButton: {
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