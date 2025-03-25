import type { PhotoParserResult } from '@/hooks/importPhoto';
import { ImportPhotoStatus } from './ImportPhotoStatus';

export interface IImportingPhoto {
  uri: string;
  status: ImportPhotoStatus;
}

export interface IImportingPhotoCompleted extends IImportingPhoto {
  status: ImportPhotoStatus.COMPLETED;
  data: PhotoParserResult;
}

export interface IImportingPhotoFailed extends IImportingPhoto {
  status: ImportPhotoStatus.FAILED;
  error: Error;
}

export type AnyImportingPhoto = IImportingPhoto | IImportingPhotoCompleted | IImportingPhotoFailed;
