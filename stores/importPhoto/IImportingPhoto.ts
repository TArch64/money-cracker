import { ImportPhotoStatus } from './ImportPhotoStatus';

export interface IImportingPhoto {
  uri: string;
  status: ImportPhotoStatus;
}

export interface IImportingPhotoFailed extends IImportingPhoto {
  status: ImportPhotoStatus.FAILED;
  error: Error;
}

export type AnyImportingPhoto = IImportingPhoto | IImportingPhotoFailed;
