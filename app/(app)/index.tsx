import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Modal } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/auth';
import { DailyTotals, Meal } from '../../types/meal';
import MacroSummary from '../../components/MacroSummary';
import MealItem from '../../components/MealItem';
import { ROUTES } from '@/routes';
import { Calendar } from 'react-native-calendars';
import { getFormattedLocalDate } from '@/common/date';

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
  const [selectedDate, setSelectedDate] = useState(getFormattedLocalDate(new Date()));
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState<{[date: string]: {marked: boolean}}>({}); 

  useEffect(() => {
    fetchMealDates();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMeals();
      fetchMealDates();
    }, [selectedDate])
  );
  
  useEffect(() => {
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

  async function fetchMealDates() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('meals')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const datesWithMeals = data.reduce((acc: {[date: string]: {marked: boolean}}, item) => {
        acc[item.date] = {marked: true};
        return acc;
      }, {});
      
      setMarkedDates(datesWithMeals);
    } catch (error) {
      console.error('Error fetching meal dates:', error);
    }
  }

  async function fetchMeals() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MacroSummary totals={dailyTotals} />

      <View style={styles.mealsContainer}>
        <View style={styles.dateSelector}>
          <Text style={styles.sectionTitle}>
            {formatDate(selectedDate)}
          </Text>
          <TouchableOpacity 
            onPress={() => setCalendarVisible(true)}
            style={styles.calendarButton}
          >
            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals recorded for this date. Add a meal!</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={{
                ...markedDates,
                [selectedDate]: { selected: true, selectedColor: '#4CAF50' }
              }}
              theme={{
                todayTextColor: '#4CAF50',
                selectedDayBackgroundColor: '#4CAF50',
                dotColor: '#4CAF50',
              }}
            />
            
            <View style={styles.calendarFooter}>
              <TouchableOpacity 
                style={styles.todayButton} 
                onPress={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  setCalendarVisible(false);
                }}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarButton: {
    padding: 4,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  todayButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  todayButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});