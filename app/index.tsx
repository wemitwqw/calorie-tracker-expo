import { Redirect } from 'expo-router';
import { useAuth } from '../context/auth';
import { View, ActivityIndicator } from 'react-native';
import { ROUTES } from '@/routes';

export default function Index() {
  const { session, isLoading } = useAuth();
  
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
