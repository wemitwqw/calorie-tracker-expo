import { supabase } from '@/services/supabase';
import { useProductStore } from '@/stores/useProductStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Product } from '@/types/product';

export const fetchProducts = async () => {
  const { setProducts, setIsLoading } = useProductStore.getState();

  try {
    setIsLoading(true);

    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;
    
    setProducts(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setIsLoading(false);
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'created_at'>) => {
  const { addProductToState, setIsLoading } = useProductStore.getState();
  
  try {
    setIsLoading(true);

    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          ...product,
          user_id: userId,
        }
      ])
      .select();

    if (error) throw error;
    
    if (data && data.length > 0) {
      addProductToState(data[0]);
      return data[0];
    }
  } catch (error) {
    console.error('Error adding product:', error);
  } finally {
    setIsLoading(false);
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { updateProductInState, setIsLoading } = useProductStore.getState();
  
  try {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data && data.length > 0) {
      updateProductInState(id, data[0]);
    }
  } catch (error) {
    console.error('Error updating product:', error);
  } finally {
    setIsLoading(false);
  }
};

export const deleteProduct = async (id: string) => {
  const { deleteProductFromState, setIsLoading } = useProductStore.getState();
  
  try {
    setIsLoading(true);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    deleteProductFromState(id);
  } catch (error) {
    console.error('Error deleting product:', error);
  } finally {
    setIsLoading(false);
  }
};