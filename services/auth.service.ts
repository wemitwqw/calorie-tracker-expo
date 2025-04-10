import { ROUTES } from '@/constants';
import { supabase } from '@/services/supabase';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const redirectUri = Linking.createURL(ROUTES.CALLBACK);

export function handleDiscordSignIn({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    if (Platform.OS === 'web') {
      signInWithDiscordWeb({ setIsLoading });
    } else {
      signInWithDiscordMobile({ setIsLoading });
    }
}

async function signInWithDiscordMobile({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    setIsLoading(true);

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true,
        },
        });
        
        if (error) throw error;
        if (!data?.url) throw new Error('No OAuth URL returned');
        
        const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
        );
        
        if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
            if (sessionError) throw sessionError;
        }
        } else if (result.type === 'cancel') {
        setIsLoading(false);
        }
    } catch (error: any) {
        console.error('Error in Discord OAuth flow:', error);
        Alert.alert('Error', error.message || 'Authentication failed');
        setIsLoading(false);
    }
}

async function signInWithDiscordWeb({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    setIsLoading(true);

    try {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: window.location.origin,
        },
        });
        
        if (error) throw error;
    } catch (error: any) {
        console.error('Error signing in with Discord:', error);
        Alert.alert('Error', error.message || 'Failed to sign in with Discord');
        setIsLoading(false);
    }
}

export function handleGoogleSignIn({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    if (Platform.OS === 'web') {
      signInWithGoogleWeb({ setIsLoading });
    } else {
      signInWithGoogleMobile({ setIsLoading });
    }
}

async function signInWithGoogleMobile({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    setIsLoading(true);

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true,
        },
        });
        
        if (error) throw error;
        if (!data?.url) throw new Error('No OAuth URL returned');
        
        const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
        );
        
        if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
            if (sessionError) throw sessionError;
        }
        } else if (result.type === 'cancel') {
        setIsLoading(false);
        }
    } catch (error: any) {
        console.error('Error in OAuth flow:', error);
        Alert.alert('Error', error.message || 'Authentication failed');
        setIsLoading(false);
    }
}

async function signInWithGoogleWeb({setIsLoading}: {setIsLoading: (loading: boolean) => void}) {
    setIsLoading(true);

    try {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        },
        });
        
        if (error) throw error;
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        Alert.alert('Error', error.message || 'Failed to sign in with Google');
        setIsLoading(false);
    }
}