import { create } from "zustand";

interface DesignState {
  selectedClothing: string | null;
  selectedFabric: string | null;
  selectedAccessories: string[];
  color: string;
  setSelectedClothing: (id: string | null) => void;
  setSelectedFabric: (id: string | null) => void;
  toggleAccessory: (id: string) => void;
  setColor: (color: string) => void;
  resetDesign: () => void;
}

export const useDesignStore = create<DesignState>()((set) => ({
  selectedClothing: null,
  selectedFabric: null,
  selectedAccessories: [],
  color: "#ffffff",
  setSelectedClothing: (id) => set({ selectedClothing: id }),
  setSelectedFabric: (id) => set({ selectedFabric: id }),
  toggleAccessory: (id) =>
    set((state) => ({
      selectedAccessories: state.selectedAccessories.includes(id)
        ? state.selectedAccessories.filter((a) => a !== id)
        : [...state.selectedAccessories, id],
    })),
  setColor: (color) => set({ color }),
  resetDesign: () =>
    set({
      selectedClothing: null,
      selectedFabric: null,
      selectedAccessories: [],
      color: "#ffffff",
    }),
}));
