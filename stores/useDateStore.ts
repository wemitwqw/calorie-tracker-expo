import { getFormattedLocalDate } from '@/utils/date';
import { create } from 'zustand';

interface DateState {
  markedDates: string[];
  selectedDate: string;
  isLoading: boolean;

  setSelectedDate: (date: string) => void;
  setMarkedDates: (dates: string[]) => void;
  addMarkedDate: (date: string) => void;
  removeMarkedDate: (date: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useDateStore = create<DateState>((set, get) => ({
  markedDates: [],
  selectedDate: getFormattedLocalDate(new Date()),
  isLoading: false,
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },
  
  setMarkedDates: (dates) => {
    set({ markedDates: dates });
  },

  addMarkedDate: (date) => {
    const { markedDates } = get();
    if (!markedDates.includes(date)) {
      set({ markedDates: [...markedDates, date] });
    }
  },

  removeMarkedDate: (date) => {
    const { markedDates } = get();
    const updatedDates = markedDates.filter(d => d !== date);
    set({ markedDates: updatedDates });
  },
  
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
}));