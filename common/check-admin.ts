import { supabase } from '@/services/supabase';

export async function checkAdminStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  }