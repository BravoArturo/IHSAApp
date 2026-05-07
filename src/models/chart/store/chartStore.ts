import { create } from 'zustand';
import { chartStoreType } from './types';

export const useChartStore = create<chartStoreType>(set => ({
  widthChart: 0,
  heightChart: 0,
  changeWidthChart: widthChart => set(() => ({ widthChart })),
  changeHeightChart: heightChart => set(() => ({ heightChart })),
}));
