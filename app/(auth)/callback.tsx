import { useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabase';
import { useLocalSearchParams } from 'expo-router';

export default function AuthCallback() {
  const { code } = useLocalSearchParams();

  useEffect(() => {
    if (code) {
      const handleCode = async () => {
        try {
          await supabase.auth.exchangeCodeForSession(code as string);
        } catch (error) {
          console.error('Error exchanging code for session:', error);
        }
      };
      
      handleCode();
    }
  }, [code]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});