import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '@/services/supabase';

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initAuth = async () => {
      initialize();
      setIsInitialized(true);
    };
    
    initAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initialize]);

  if (!isInitialized) {
    return null;
  }

  return <Slot />;
}