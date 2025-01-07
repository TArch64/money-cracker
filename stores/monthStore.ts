import { create } from 'zustand';
import { MonthIdx } from './MonthIdx';

interface IStore {
  activeIdx: MonthIdx;
  activateIdx: (idx: MonthIdx) => void;
}

export const useMonthStore = create<IStore>(set => ({
  activeIdx: MonthIdx.current(),
  activateIdx: (idx: MonthIdx) => set({ activeIdx: idx }),
}));
