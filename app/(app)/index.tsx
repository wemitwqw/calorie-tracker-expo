import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/auth';
import { DailyTotals, Meal } from '../../types/meal';
import MacroSummary from '../../components/MacroSummary';
import MealItem from '../../components/MealItem';
import { ROUTES } from '@/routes';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyTotals, setDailyTotals] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodaysMeals();
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  }

  async function fetchTodaysMeals() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMeals(data || []);
      
      const totals = (data || []).reduce((acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.carbs += meal.carbs || 0;
        acc.fat += meal.fat || 0;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      setDailyTotals(totals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <MacroSummary totals={dailyTotals} />

      <View style={styles.mealsContainer}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals recorded today. Add your first meal!</Text>
        ) : (
          <FlatList
            data={meals}
            renderItem={({ item }) => <MealItem meal={item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.mealsList}
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push(ROUTES.ADD_MEAL)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity 
          style={styles.adminButton} 
          onPress={() => router.push(ROUTES.WHITELIST)}
        >
          <Ionicons name="shield-outline" size={20} color="white" />
          <Text style={styles.adminButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mealsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mealsList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  signOutButton: {
    padding: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#f44336',
    fontWeight: '500',
  },
  adminButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: '#4361EE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
});