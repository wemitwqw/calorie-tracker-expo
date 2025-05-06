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

      <View style={styles.footerContainer}>
        <View style={styles.buttonContainer}>
          <Admin>
            <TouchableOpacity 
              style={styles.adminButton} 
              onPress={() => router.push(ROUTES.WHITELIST)}
            >
              <Ionicons name="shield-outline" size={20} color="white" />
            </TouchableOpacity>
          </Admin>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push(ROUTES.ADD_MEAL)}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <CustomCalendar 
        calendarVisible={calendarVisible} 
        setCalendarVisible={setCalendarVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6EFD8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  mealsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginHorizontal: 16,
  },
  footerContainer: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  adminButton: {
    backgroundColor: '#1A5319',
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
  adminButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#1A5319',
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
});