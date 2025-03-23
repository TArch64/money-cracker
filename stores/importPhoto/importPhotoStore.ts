import { create } from 'zustand';
import type { AnyImportingPhoto } from './IImportingPhoto';

interface IStore {
  photos: AnyImportingPhoto[];
  setPhotos: (photos: AnyImportingPhoto[]) => void;
  patchPhoto: (index: number, patch: Partial<AnyImportingPhoto>) => void;
}

export const useImportPhotoStore = create<IStore>((set) => ({
  photos: [],
  setPhotos: (photos) => set({ photos }),

  patchPhoto: (index, patch) => set((state) => {
    const photos = [...state.photos];
    photos[index] = { ...photos[index], ...patch };
    return { photos };
  }),
}));
