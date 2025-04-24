import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

const createCrossStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string): Promise<string | null> => {
        try {
          const value = localStorage.getItem(key);
          return Promise.resolve(value);
        } catch (error) {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string): Promise<void> => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      },
      removeItem: (key: string): Promise<void> => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          return Promise.resolve();
        }
      },
    };
  } 

  else {
    return {
      getItem: (key: string): Promise<string | null> => {
        return SecureStore.getItemAsync(key);
      },
      setItem: (key: string, value: string): Promise<void> => {
        return SecureStore.setItemAsync(key, value);
      },
      removeItem: (key: string): Promise<void> => {
        return SecureStore.deleteItemAsync(key);
      },
    };
  }
};

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: createCrossStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);