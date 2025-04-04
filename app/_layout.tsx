import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  
  useEffect(() => {
    const unsubscribe = initialize();

    return () => {
      unsubscribe.then(unsub => unsub && unsub());
    };
  }, [initialize]);

  return <Slot />;
}