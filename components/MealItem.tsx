import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Meal } from '../types/meal';

type MealItemProps = {
  meal: Meal;
};

export default function MealItem({ meal }: MealItemProps) {
  return (
    <View style={styles.mealItem}>
      <View>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealTime}>
          {new Date(meal.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
      <View style={styles.macros}>
        <Text style={styles.macroText}>{meal.calories} cal</Text>
        <View style={styles.macroDetails}>
          <Text style={styles.macroDetail}>P: {meal.protein}g</Text>
          <Text style={styles.macroDetail}>C: {meal.carbs}g</Text>
          <Text style={styles.macroDetail}>F: {meal.fat}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  macros: {
    alignItems: 'flex-end',
  },
  macroText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroDetails: {
    flexDirection: 'row',
    marginTop: 4,
  },
  macroDetail: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});