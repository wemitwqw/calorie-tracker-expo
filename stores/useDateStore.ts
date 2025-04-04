import { create } from 'zustand';

interface MarkedDates {
  [date: string]: {
    marked: boolean; 
  };
}

interface DateState {
  markedDates: MarkedDates;
  selectedDate: Date;
  isLoading: boolean;

  setSelectedDate: (date: Date) => void;
  setMarkedDates: (dates: MarkedDates) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useDateStore = create<DateState>((set, get) => ({
    markedDates: {},
    selectedDate: new Date(),
    isLoading: false,
    
    setSelectedDate: (date) => {
      set({ selectedDate: date });
    },
    
    setMarkedDates: (dates) => {
      set({ markedDates: dates });
    },
    
    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },
}));