import { create } from 'zustand';

interface UserState {
  isAdmin: boolean;
}

export const useUserStore = create<UserState>((set) => ({
    isAdmin: false,
    updateIsAdmin: (isAdmin: boolean) => set(() => ({ isAdmin: isAdmin })),
}));