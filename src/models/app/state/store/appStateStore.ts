import { create } from 'zustand';
import { appStateStoreType } from './types';

export const useAppStateStore = create<appStateStoreType>(set => ({
  isOnline: true,
  changeIsOnline: isOnline => set(() => ({ isOnline })),
  isOnForeground: true,
  changeIsOnForeground: isOnForeground => set(() => ({ isOnForeground })),
}));
