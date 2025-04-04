import { supabase } from '@/services/supabase';
import { useDateStore } from '@/stores/useDateStore';
import { useMealStore, Meal } from '../stores/useMealStore';
import { getFormattedLocalDate } from '@/common/date';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Fetches dates that have meals for the current user
 * and updates the store state
 */
export const fetchMealDates = async () => {
  const { setMarkedDates, setIsLoading } = useDateStore.getState();
  
  try {
    setIsLoading(true);
    
    // const { data: { user } } = await supabase.auth.getUser();
    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('meals')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    const datesWithMeals = data.reduce((acc: {[date: string]: {marked: boolean}}, item) => {
      acc[item.date] = {marked: true};
      return acc;
    }, {});
    
    setMarkedDates(datesWithMeals);
  } catch (error) {
    console.error('Error fetching meal dates:', error);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Fetches meals for a specific date and updates the store state
 */
export const fetchMealsForDate = async (selectedDate: Date) => {
  const { setMeals, setIsLoading } = useMealStore.getState();
  
  try {
    setIsLoading(true);
    
    const formattedDate = getFormattedLocalDate(selectedDate);
    
    // const { data: { user } } = await supabase.auth.getUser();
    const userId = useAuthStore.getState().session?.user.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', formattedDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setMeals(data || []);
  } catch (error) {
    console.error('Error fetching meals:', error);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Adds a new meal to the database and updates the store state
 */
// export const addMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
//   const { addMealToState, setIsLoading } = useMealStore.getState();
  
//   try {
//     setIsLoading(true);
    
//     const { data: { user } } = await supabase.auth.getUser();
    
//     if (!user) return;

//     const { data, error } = await supabase
//       .from('meals')
//       .insert([
//         {
//           ...meal,
//           user_id: user.id,
//         }
//       ])
//       .select();

//     if (error) throw error;
    
//     if (data && data.length > 0) {
//       addMealToState(data[0]);
//     }
    
//     // Refresh meal dates to update calendar markers
//     // await fetchMealDates();
//   } catch (error) {
//     console.error('Error adding meal:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

/**
 * Updates an existing meal in the database and updates the store state
 */
// export const updateMeal = async (id: string, updates: Partial<Meal>) => {
//   const { updateMealInState, setIsLoading } = useMealStore.getState();
  
//   try {
//     setIsLoading(true);
    
//     const { error } = await supabase
//       .from('meals')
//       .update(updates)
//       .eq('id', id);

//     if (error) throw error;
    
//     updateMealInState(id, updates);
//   } catch (error) {
//     console.error('Error updating meal:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

/**
 * Deletes a meal from the database and updates the store state
 */
// export const deleteMeal = async (id: string) => {
//   const { deleteMealFromState, setIsLoading } = useMealStore.getState();
  
//   try {
//     setIsLoading(true);
    
//     const { error } = await supabase
//       .from('meals')
//       .delete()
//       .eq('id', id);

//     if (error) throw error;
    
//     deleteMealFromState(id);
    
//     // Refresh meal dates to update calendar markers
//     await fetchMealDates();
//   } catch (error) {
//     console.error('Error deleting meal:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };