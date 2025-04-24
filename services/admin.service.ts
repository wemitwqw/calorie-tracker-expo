import { supabase } from '@/config/supabase';
import { WhitelistEntry } from '@/types/admin';

export const fetchWhitelistedEmails = async (): Promise<WhitelistEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('allowed_emails')
      .select('*')
      .order('added_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

export const addEmailToWhitelist = async (email: string, notes?: string): Promise<WhitelistEntry> => {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('allowed_emails')
      .insert([{ 
        email: email.toLowerCase().trim(),
        added_by: user?.id,
        notes: notes?.trim() || null
      }])
      .select();
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after adding email');
    }
    
    return data[0];
  } catch (error) {
    console.error('Error adding email:', error);
    throw error;
  }
};

export const removeEmailFromWhitelist = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('allowed_emails')
      .delete()
      .eq('email', email);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error removing email:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};