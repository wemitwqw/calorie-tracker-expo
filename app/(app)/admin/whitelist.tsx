import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../../services/supabase';
import { Ionicons } from '@expo/vector-icons';

type WhitelistEntry = {
  email: string;
  added_at: string;
  added_by: string | null;
  notes: string | null;
};

export default function WhitelistScreen() {
  const [emails, setEmails] = useState<WhitelistEntry[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [addingEmail, setAddingEmail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      setIsAdmin(!!data);
      
      if (data) {
        fetchEmails();
      } else {
        Alert.alert(
          'Access Denied', 
          'You do not have admin privileges to access this page.',
          [{ text: 'Go Back', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEmails() {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('allowed_emails')
        .select('*')
        .order('added_at', { ascending: false });
        
      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      Alert.alert('Error', 'Failed to fetch whitelisted emails');
    } finally {
      setRefreshing(false);
    }
  }

  async function addEmail() {
    if (!newEmail || !newEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setAddingEmail(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('allowed_emails')
        .insert([{ 
          email: newEmail.toLowerCase().trim(),
          added_by: user?.id,
          notes: notes.trim() || null
        }]);
        
      if (error) throw error;
      
      setNewEmail('');
      setNotes('');
      fetchEmails();
      Alert.alert('Success', 'Email added to whitelist');
    } catch (error: any) {
      console.error('Error adding email:', error);
      Alert.alert('Error', error.message || 'Failed to add email to whitelist');
    } finally {
      setAddingEmail(false);
    }
  }

  async function removeEmail(email: string) {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to remove ${email} from the whitelist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('allowed_emails')
                .delete()
                .eq('email', email);
                
              if (error) throw error;
              
              fetchEmails();
              Alert.alert('Success', 'Email removed from whitelist');
            } catch (error: any) {
              console.error('Error removing email:', error);
              Alert.alert('Error', error.message || 'Failed to remove email');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.centered}>
        <Text style={styles.accessDenied}>Access Denied</Text>
        <Text style={styles.accessDeniedDetails}>
          You do not have permission to view this page.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Whitelisted Emails</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchEmails}
          disabled={refreshing}
        >
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.addContainer}>
        <TextInput 
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Email address or *@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes (optional)"
          multiline
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addEmail}
          disabled={addingEmail || !newEmail}
        >
          <Text style={styles.addButtonText}>
            {addingEmail ? 'Adding...' : 'Add to Whitelist'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>
        {emails.length} {emails.length === 1 ? 'Email' : 'Emails'} Whitelisted
      </Text>
      
      <FlatList
        data={emails}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.emailItem}>
            <View style={styles.emailInfo}>
              <Text style={styles.emailText}>{item.email}</Text>
              {item.notes && (
                <Text style={styles.notesText}>{item.notes}</Text>
              )}
              <Text style={styles.dateText}>
                Added: {new Date(item.added_at).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => removeEmail(item.email)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={fetchEmails}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No emails whitelisted yet</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  addContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emailItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emailInfo: {
    flex: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  accessDenied: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  accessDeniedDetails: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});