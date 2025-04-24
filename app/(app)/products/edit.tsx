// app/products/edit.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { updateProduct } from '@/services/product.service';
import { router, useLocalSearchParams } from 'expo-router';
import { useProductStore } from '@/stores/useProductStore';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const products = useProductStore(state => state.products);
  const loading = useProductStore(state => state.isLoading);
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        setName(product.name);
        setCalories(product.calories.toString());
        setProtein(product.protein.toString());
        setCarbs(product.carbs.toString());
        setFat(product.fat.toString());
        setFiber(product.fiber.toString());
        setServingSize(product.serving_size.toString());
        setServingUnit(product.serving_unit);
      }
      setIsLoading(false);
    }
  }, [id, products]);

  const validateForm = () => {
    const fields = [
      { value: name, message: 'Please provide a product name' },
      { value: calories, message: 'Please enter calories' },
      { value: servingSize, message: 'Please enter serving size' },
      { value: servingUnit, message: 'Please enter serving unit' }
    ];
    
    for (const field of fields) {
      if (!field.value) {
        Alert.alert('Error', field.message);
        return false;
      }
    }
    
    return true;
  };

  async function handleSubmit() {
    if (validateForm() && id) {
      try {
        await updateProduct(id, {
          name: name,
          calories: parseFloat(calories) || 0,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
          fiber: parseFloat(fiber) || 0,
          serving_size: parseFloat(servingSize) || 100,
          serving_unit: servingUnit || 'g',
        });

        router.back();
      } catch (error) {
        console.log('Failed to update product. Please try again. ', error);
      }
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder='e.g., Chicken Breast, Oatmeal, Apple'
          />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder='e.g., 165'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            placeholder='e.g., 31'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            placeholder='e.g., 0'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            placeholder='e.g., 3.6'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Fiber (g)</Text>
          <TextInput
            style={styles.input}
            value={fiber}
            onChangeText={setFiber}
            placeholder='e.g., 3.6'
            keyboardType='decimal-pad'
          />

          <View style={styles.servingContainer}>
            <View style={styles.servingSizeContainer}>
              <Text style={styles.label}>Serving Size</Text>
              <TextInput
                style={styles.input}
                value={servingSize}
                onChangeText={setServingSize}
                placeholder='e.g., 100'
                keyboardType='decimal-pad'
              />
            </View>
            
            <View style={styles.servingUnitContainer}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                value={servingUnit}
                onChangeText={setServingUnit}
                placeholder='e.g., g, ml, oz'
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Product'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  servingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servingSizeContainer: {
    flex: 2,
    marginRight: 8,
  },
  servingUnitContainer: {
    flex: 1,
    marginLeft: 8,
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