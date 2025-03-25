import type { PhotoParserResult } from '@/hooks/importPhoto';
import { ImportPhotoStatus } from './ImportPhotoStatus';

export interface IImportingPhoto {
  uri: string;
  status: ImportPhotoStatus;
}

export interface IImportingPhotoQueued extends IImportingPhoto {
  status: ImportPhotoStatus.QUEUED;
}

export interface IImportingPhotoOptimizing extends IImportingPhoto {
  status: ImportPhotoStatus.OPTIMIZING;
}

export interface IImportingPhotoProcessing extends IImportingPhoto {
  status: ImportPhotoStatus.PROCESSING;
}

export interface IImportingPhotoCompleted extends IImportingPhoto {
  status: ImportPhotoStatus.COMPLETED;
  data: PhotoParserResult;
}

export interface IImportingPhotoFailed extends IImportingPhoto {
  status: ImportPhotoStatus.FAILED;
  error: Error;
}

export interface IImportingPhotoNoData extends IImportingPhoto {
  status: ImportPhotoStatus.NO_DATA;
}

export type AnyImportingPhoto = IImportingPhotoQueued
  | IImportingPhotoOptimizing
  | IImportingPhotoProcessing
  | IImportingPhotoCompleted
  | IImportingPhotoFailed
  | IImportingPhotoNoData;
