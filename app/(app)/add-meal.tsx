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
  FlatList,
  Modal
} from 'react-native';
import { addMeal } from '@/services/meal.service';
import { useDateStore } from '@/stores/useDateStore';
import { useMealStore } from '@/stores/useMealStore';
import { useProductStore } from '@/stores/useProductStore';
import { router } from 'expo-router';
import { ROUTES } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { fetchProducts } from '@/services/product.service';
import { Product } from '@/types/product';
import { calculateMacrosFromProduct } from '@/services/meal-item.service';

interface SelectedProduct {
  product: Product;
  amount: number;
}

export default function AddMealScreen() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('0');
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fat, setFat] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productAmount, setProductAmount] = useState('');

  const selectedDate = useDateStore(state => state.selectedDate);
  const loading = useMealStore(state => state.isLoading);
  const products = useProductStore(state => state.products);
  const productsLoading = useProductStore(state => state.isLoading);
  const setProductSearchQuery = useProductStore(state => state.setSearchQuery);
  const filteredProducts = useProductStore(state => state.filteredProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      selectedProducts.forEach(item => {
        const macros = calculateMacrosFromProduct(item.product, item.amount);
        totalCalories += macros.calories;
        totalProtein += macros.protein;
        totalCarbs += macros.carbs;
        totalFat += macros.fat;
      });

      setCalories(totalCalories.toFixed(1));
      setProtein(totalProtein.toFixed(1));
      setCarbs(totalCarbs.toFixed(1));
      setFat(totalFat.toFixed(1));
    }
  }, [selectedProducts]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setProductSearchQuery(text);
  };

  const openProductSelector = () => {
    setIsModalVisible(true);
  };

  const closeProductSelector = () => {
    setIsModalVisible(false);
    setSearchQuery('');
    setProductSearchQuery('');
    setCurrentProduct(null);
  };

  const selectProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductAmount(product.serving_size.toString());
  };

  const addProductToMeal = () => {
    if (!currentProduct || !productAmount) return;
    
    const amount = parseFloat(productAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setSelectedProducts(prev => [
      ...prev,
      { product: currentProduct, amount }
    ]);

    setCurrentProduct(null);
    setProductAmount('');
    setSearchQuery('');
    setProductSearchQuery('');
  };

  const removeSelectedProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!name) {
      Alert.alert('Error', 'Please provide a meal name');
      return false;
    }
    
    return true;
  };

  async function handleSubmit() {
    if (validateForm()) {
      try {
        await addMeal({
          name: name,
          calories: parseFloat(calories) || 0,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
          date: selectedDate,
        });
        
        router.replace(ROUTES.HOME);
      } catch (error) {
        console.log('Failed to add meal. Please try again. ', error);
      }
    }
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => selectProduct(item)}
    >
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productMacros}>
          {item.calories} cal | {item.protein}p | {item.carbs}c | {item.fat}f
          per {item.serving_size}{item.serving_unit}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSelectedProduct = ({ item, index }: { item: SelectedProduct, index: number }) => {
    const { product, amount } = item;
    const macros = calculateMacrosFromProduct(product, amount);
    
    return (
      <View style={styles.selectedProductItem}>
        <View style={styles.selectedProductInfo}>
          <Text style={styles.selectedProductName}>
            {product.name} ({amount}{product.serving_unit})
          </Text>
          <Text style={styles.selectedProductMacros}>
            {macros.calories.toFixed(1)} cal | {macros.protein.toFixed(1)}p | 
            {macros.carbs.toFixed(1)}c | {macros.fat.toFixed(1)}f
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeSelectedProduct(index)}
        >
          <Ionicons name="close-circle" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    );
  };

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
            placeholder='e.g., Breakfast, Lunch, Snack'
          />

          <View style={styles.productsContainer}>
            <View style={styles.productsHeader}>
              <Text style={styles.label}>Products</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={openProductSelector}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
            
            {selectedProducts.length > 0 ? (
              <FlatList
                data={selectedProducts}
                renderItem={renderSelectedProduct}
                keyExtractor={(item, index) => `${item.product.id}-${index}`}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noProductsText}>
                No products added yet. Tap "Add Product" to select from your product list.
              </Text>
            )}
          </View>

          <Text style={styles.sectionHeader}>Meal Nutrition</Text>
          
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder='e.g., 500'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            placeholder='e.g., 30'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            placeholder='e.g., 50'
            keyboardType='decimal-pad'
          />

          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            placeholder='e.g., 15'
            keyboardType='decimal-pad'
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Adding...' : 'Add Meal'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Product Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeProductSelector}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select a Product</Text>
            <TouchableOpacity onPress={closeProductSelector}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => handleSearchChange('')}
              >
                <Ionicons name="close-circle" size={20} color="#777" />
              </TouchableOpacity>
            ) : null}
          </View>

          {productsLoading ? (
            <View style={styles.centerContainer}>
              <Text>Loading products...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text>No products found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              style={styles.productsList}
            />
          )}

          {currentProduct && (
            <View style={styles.productAmountContainer}>
              <View style={styles.selectedProductHeader}>
                <Text style={styles.selectedProductTitle}>Selected: {currentProduct.name}</Text>
              </View>
              
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>Amount ({currentProduct.serving_unit}):</Text>
                <TextInput
                  style={styles.amountInput}
                  value={productAmount}
                  onChangeText={setProductAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <TouchableOpacity
                style={styles.addToMealButton}
                onPress={addProductToMeal}
              >
                <Text style={styles.addToMealButtonText}>Add to Meal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
  productsContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  noProductsText: {
    color: '#666',
    textAlign: 'center',
    padding: 10,
    fontStyle: 'italic',
  },
  selectedProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedProductInfo: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedProductMacros: {
    fontSize: 13,
    color: '#666',
  },
  removeButton: {
    padding: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  submitButton: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  productsList: {
    flex: 1,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productMacros: {
    fontSize: 14,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productAmountContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  selectedProductHeader: {
    marginBottom: 10,
  },
  selectedProductTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  amountLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    width: 100,
    fontSize: 16,
  },
  addToMealButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToMealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});