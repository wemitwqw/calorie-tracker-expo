import { DailyTotals, Meal } from '@/types/meal';
import { create } from 'zustand';

interface MealState {
    meals: Meal[];
    dailyTotals: DailyTotals;
    isLoading: boolean;

    setIsLoading: (loading: boolean) => void;
    setMeals: (meals: Meal[]) => void;
    calculateDailyTotals: () => void;
    addMealToState: (meal: Meal) => void;
    updateMealInState: (id: string, updates: Partial<Meal>) => void;
    deleteMealFromState: (id: string) => void;
}

export const useMealStore = create<MealState>((set, get) => ({
    meals: [],
    dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isLoading: false,

    setIsLoading: (loading) => {
        set({ isLoading: loading });
    },
    
    setMeals: (meals) => {
        set({ meals });
        get().calculateDailyTotals();
    },
    
    calculateDailyTotals: () => {
        const { meals } = get();
        
        const totals = meals.reduce((acc: DailyTotals, meal) => {
            acc.calories += meal.calories || 0;
            acc.protein += meal.protein || 0;
            acc.carbs += meal.carbs || 0;
            acc.fat += meal.fat || 0;
            acc.fiber += meal.fiber || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
        
        set({ dailyTotals: totals });
    },
    
    addMealToState: (meal) => {
        const { meals } = get();
        set({ meals: [meal, ...meals] });
        get().calculateDailyTotals();
    },
    
    updateMealInState: (id, updates) => {
        const { meals } = get();
        const updatedMeals = meals.map(meal => 
            meal.id === id ? { ...meal, ...updates } : meal
        );
        set({ meals: updatedMeals });
        get().calculateDailyTotals();
    },
    
    deleteMealFromState: (id) => {
        const { meals } = get();
        const filteredMeals = meals.filter(meal => meal.id !== id);
        set({ meals: filteredMeals });
        get().calculateDailyTotals();
    }
}));