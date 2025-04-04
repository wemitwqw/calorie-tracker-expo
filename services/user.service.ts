import { useUserStore } from '@/stores/useUserStore';
import { supabase } from './supabase';

export const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      console.log(!!data)
    //   useUserStore((!!data) => state.is);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
}