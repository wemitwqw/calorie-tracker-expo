import { supabase } from '@/config/supabase';
import { MealItem } from '@/types/meal-item';

export const fetchMealItems = async (mealId: string) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('meal_id', mealId);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching meal items:', error);
    return [];
  }
};

export const addMealItem = async (mealItem: Omit<MealItem, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .insert([mealItem])
      .select(`
        *,
        product:products(*)
      `);

    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding meal item:', error);
    return null;
  }
};

export const updateMealItem = async (id: string, updates: Partial<MealItem>) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        product:products(*)
      `);

    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating meal item:', error);
    return null;
  }
};

export const deleteMealItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('meal_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting meal item:', error);
    return false;
  }
};

export const calculateMacrosFromProduct = (product: any, amount: number) => {
  const ratio = amount / product.serving_size;
  
  return {
    calories: product.calories * ratio,
    protein: product.protein * ratio,
    carbs: product.carbs * ratio,
    fat: product.fat * ratio
  };
};