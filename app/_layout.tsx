import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let subscription: any = null;
    
    const initAuth = async () => {
      subscription = initialize();
      setIsInitialized(true);
    };

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [initialize]);

  if (!isInitialized) {
    return null;
  }

  return <Slot />;
}