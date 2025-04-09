import { supabase } from '@/services/supabase';
import { useDateStore } from '@/stores/useDateStore';
import { useMealStore } from '../stores/useMealStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Meal } from '@/types/meal';

export const fetchMealDates = async () => {
  const { setMarkedDates, setIsLoading } = useDateStore.getState();

  try {
    setIsLoading(true);

    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('meals')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    
    setMarkedDates(data.map(item => item.date));
  } catch (error) {
    console.error('Error fetching meal dates:', error);
  } finally {
    setIsLoading(false);
  }
};

export const fetchMealsForDate = async (selectedDate: string) => {
  const { setMeals, setIsLoading } = useMealStore.getState();

  try {
    setIsLoading(true);

    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', selectedDate)
      .order('created_at', { ascending: false });

    if (error) throw error;

    setMeals(data || []);
  } catch (error) {
    console.error('Error fetching meals:', error);
  } finally {
    setIsLoading(false);
  }
};

export const addMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
  const { addMealToState, setIsLoading } = useMealStore.getState();
  const { addMarkedDate } = useDateStore.getState();
  
  try {
    setIsLoading(true);

    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('meals')
      .insert([
        {
          ...meal,
          user_id: userId,
        }
      ])
      .select();

    if (error) throw error;
    
    if (data && data.length > 0) {
      addMealToState(data[0]);
    }

    addMarkedDate(meal.date);
  } catch (error) {
    console.error('Error adding meal:', error);
  } finally {
    setIsLoading(false);
  }
};

export const deleteMeal = async (id: string) => {
  const { meals, deleteMealFromState, setIsLoading } = useMealStore.getState();
  const { removeMarkedDate } = useDateStore.getState();
  
  try {
    setIsLoading(true);

    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    if (meals.length === 1) {
      removeMarkedDate(meals[0].date);
    }

    deleteMealFromState(id);
  } catch (error) {
    console.error('Error deleting meal:', error);
  } finally {
    setIsLoading(false);
  }
};