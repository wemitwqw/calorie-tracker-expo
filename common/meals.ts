import { supabase } from '@/services/supabase';

export const fetchMealDates = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('meals')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    
    const datesWithMeals = data.reduce((acc: {[date: string]: {marked: boolean}}, item) => {
      acc[item.date] = {marked: true};
      return acc;
    }, {});
    
    return datesWithMeals;
  } catch (error) {
    console.error('Error fetching meal dates:', error);
  }

  return null;
}

export const fetchMeals = async (selectedDate: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', selectedDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
    
    // const totals = (data || []).reduce((acc, meal) => {
    //   acc.calories += meal.calories || 0;
    //   acc.protein += meal.protein || 0;
    //   acc.carbs += meal.carbs || 0;
    //   acc.fat += meal.fat || 0;
    //   return acc;
    // }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // setDailyTotals(totals);
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
}
