import { create } from 'zustand';
import type { IImportingPhoto } from './IImportingPhoto';

interface IStore {
  photos: IImportingPhoto[];
  addPhotos: (photos: IImportingPhoto[]) => void;
  patchPhoto: (index: number, patch: Partial<IImportingPhoto>) => void;
}

export const useImportPhotoStore = create<IStore>((set, get) => ({
  photos: [],
  addPhotos: (photos) => set((state) => ({ photos: [...state.photos, ...photos] })),

  patchPhoto: (index, patch) => set((state) => {
    const photos = [...state.photos];
    photos[index] = { ...photos[index], ...patch };
    return { photos };
  }),
}));
