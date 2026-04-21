import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PetState {
  petName: string;
  species: "cat" | "dog";
  modelUrl: string | null;
  originalImageUrl: string | null;
  setPetName: (name: string) => void;
  setSpecies: (species: "cat" | "dog") => void;
  setModelUrl: (url: string) => void;
  setOriginalImageUrl: (url: string) => void;
  reset: () => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      petName: "",
      species: "dog",
      modelUrl: null,
      originalImageUrl: null,
      setPetName: (name) => set({ petName: name }),
      setSpecies: (species) => set({ species }),
      setModelUrl: (url) => set({ modelUrl: url }),
      setOriginalImageUrl: (url) => set({ originalImageUrl: url }),
      reset: () => set({ petName: "", species: "dog", modelUrl: null, originalImageUrl: null }),
    }),
    { name: "pet-storage" }
  )
);
