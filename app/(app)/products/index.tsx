import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useProductStore } from '@/stores/useProductStore';
import { fetchProducts, deleteProduct } from '@/services/product.service';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types/product';
import { ROUTES } from '@/constants';

export default function ProductsScreen() {
  const products = useProductStore(state => state.filteredProducts);
  const isLoading = useProductStore(state => state.isLoading);
  const searchQuery = useProductStore(state => state.searchQuery);
  const setSearchQuery = useProductStore(state => state.setSearchQuery);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    router.push(ROUTES.ADD_PRODUCT);
  };

  const handleEditProduct = (id: string) => {
    router.push({
      pathname: ROUTES.EDIT_PRODUCT,
      params: { id }
    });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productMacros}>
          {item.calories} cal | {item.protein}g prot | {item.carbs}g carbs | {item.fat}g fat | {item.fiber}g fiber
          - per {item.serving_size}{item.serving_unit}
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditProduct(item.id)}
        >
          <Ionicons name="pencil" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={20} color="#777" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Add your first product to get started</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
    marginLeft: 5,
  },
  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
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
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginTop: 50,
  },
});