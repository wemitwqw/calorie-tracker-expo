
import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  initialize: () => Promise<void> | undefined;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, isLoading: false });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          set({ session });
        }
      );
      
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));