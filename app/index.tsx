import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/useAuthStore';
import { View, ActivityIndicator } from 'react-native';
import { ROUTES } from '@/constants';

export default function Index() {
  const { session, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (session) {
    return <Redirect href={ROUTES.HOME} />;
  } else {
    return <Redirect href={ROUTES.LOGIN} />;
  }
}