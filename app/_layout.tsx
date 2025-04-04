import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '@/services/supabase';

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  
  useEffect(() => {
    initialize();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initialize]);

  return <Slot />;
}