import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { useMealStore } from '@/stores/useMealStore';
import { addMeal } from '@/services/meal.service';
import { useDateStore } from '@/stores/useDateStore';
import { router } from 'expo-router';

export default function AddMealScreen() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const selectedDate = useDateStore(state => state.selectedDate);

  const loading = useMealStore(state => state.isLoading);

  const validateForm = () => {
    const fields = [
      { value: name, message: 'Please provide a meal name' },
      { value: calories, message: 'Please enter calories' },
      // { value: protein, message: 'Please enter protein' },
      // { value: carbs, message: 'Please enter carbs' },
      // { value: fat, message: 'Please enter fat' }
    ];
    
    for (const field of fields) {
      if (!field.value) {
        Alert.alert('Error', field.message);
        return false;
      }
    }
    
    return true;
  };

  async function handleAddMeal() {
    if (validateForm()) {
      try {
        addMeal(
          {
            name,
            calories: parseFloat(calories) || 0,
            protein: parseFloat(protein) || 0,
            carbs: parseFloat(carbs) || 0,
            fat: parseFloat(fat) || 0,
            date: selectedDate,
          },
        );
        
        router.back();
      } catch (error) {
        console.error('Error adding meal:', error);
      }
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Meal Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Breakfast, Lunch, Snack"
          />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g., 500"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            placeholder="e.g., 30"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            placeholder="e.g., 50"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            placeholder="e.g., 15"
            keyboardType="numeric"
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleAddMeal}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Adding...' : 'Add Meal'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});