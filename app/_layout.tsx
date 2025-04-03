import { Slot } from 'expo-router';
import AuthContextProvider from '../context/auth';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}