import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthState {
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;

  initialize: () => void;
  signOut: () => Promise<void>;
  checkIsAdmin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  isAdmin: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, isLoading: false });

      // if (data.session) {
      //   setTimeout(async () => {
      //     await get().checkIsAdmin();
      //   }, 100);
      // }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          set({ session });
          
          if (session) {
            setTimeout(async () => {
              await get().checkIsAdmin();
            }, 100);
          } else {
            set({ isAdmin: false });
          }
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
      return null;
    }
  },

  checkIsAdmin: async () => {
    try {
      const session = get().session;
      if (!session) {
        set({ isAdmin: false });
        return;
      }

      const { data, error } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });
      
      if (error) throw error;

      set({ isAdmin: data });
    } catch (error) {
      console.error('Error checking admin status:', error);
      set({ isAdmin: false });
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