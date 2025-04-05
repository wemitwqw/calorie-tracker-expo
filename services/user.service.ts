import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from './supabase';

export const checkAdminStatus = async () => {
  try {
    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    console.log(!!data);
  } catch (error) {
    console.error('Error checking admin status:', error);
  }
}