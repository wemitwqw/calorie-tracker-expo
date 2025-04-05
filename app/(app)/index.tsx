import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ROUTES } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import MacroSummary from '@/components/MacroSummary';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDate } from '@/utils/date';
import CustomCalendar from '@/components/Calendar';
import { fetchMealDates, fetchMealsForDate } from '@/services/meal.service';
import { useMealStore } from '@/stores/useMealStore';
import { useDateStore } from '@/stores/useDateStore';
import MealList from '@/components/MealList';
import Admin from '@/components/AdminAccess';

function useAppLoading() {
  const mealLoading = useMealStore(state => state.isLoading);
  const dateLoading = useDateStore(state => state.isLoading);
  
  return mealLoading || dateLoading;
}

export default function HomeScreen() {
  const signOut = useAuthStore(state => state.signOut);
  const selectedDate = useDateStore(state => state.selectedDate);
  const meals = useMealStore(state => state.meals);

  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate]);
  
  useEffect(() => {
    fetchMealDates();
  }, []);

  const isLoading = useAppLoading();
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <MacroSummary />

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
          <MealList />
        )}
      </View>

      <Admin>
        <TouchableOpacity 
          style={styles.adminButton} 
          onPress={() => router.push(ROUTES.WHITELIST)}
        >
          <Ionicons name="shield-outline" size={20} color="white" />
          <Text style={styles.adminButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      </Admin>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push(ROUTES.ADD_MEAL)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <CustomCalendar 
        calendarVisible={calendarVisible} 
        setCalendarVisible={setCalendarVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});