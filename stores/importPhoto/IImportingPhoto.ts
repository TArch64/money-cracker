import { ImportPhotoStatus } from './ImportPhotoStatus';

export interface IImportingPhoto {
  uri: string;
  status: ImportPhotoStatus;
}
