import { create } from 'zustand';

interface LayoutState {
  selectedPrimaryItem: string;
  setSelectedPrimaryItem: (item: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  selectedPrimaryItem: 'Dashboard', // Default to Dashboard
  setSelectedPrimaryItem: (item) => set({ selectedPrimaryItem: item }),
}));
