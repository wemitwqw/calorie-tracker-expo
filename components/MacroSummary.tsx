import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyTotals } from '../types/meal';
import { useMealStore } from '@/stores/useMealStore';

export default function MacroSummary() {
  const dailyTotals = useMealStore(state => state.dailyTotals);

  return (
    <View style={styles.container}>
      <Text style={styles.todayText}>Macros</Text>
      <Text style={styles.caloriesText}>{dailyTotals.calories} calories</Text>
      <View style={styles.macroRow}>
        <View style={styles.macroBox}>
          <Text style={styles.macroValue}>{dailyTotals.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroBox}>
          <Text style={styles.macroValue}>{dailyTotals.carbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroBox}>
          <Text style={styles.macroValue}>{dailyTotals.fat}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
        <View style={styles.macroBox}>
          <Text style={styles.macroValue}>{dailyTotals.fiber}g</Text>
          <Text style={styles.macroLabel}>Fiber</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayText: {
    fontSize: 16,
    color: '#666',
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
});