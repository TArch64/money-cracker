import { type ReactNode, useEffect } from 'react';
import { type IImportingPhoto, ImportPhotoStatus, useImportPhotoStore } from '@/stores';
import type { PhotoParserResult } from '@/hooks/importPhoto';
import { getUriFilename } from '@/helpers/getUriFilename';
import { type IAsyncQueueTask, ImportPhotoQueue } from './ImportPhotoQueue';

export interface IImportControllerProps {
  initialImages: string[];
  onRead: (uri: string) => Promise<string>;
  onOptimize: (source: string) => Promise<string>;
  onParse: (source: string) => Promise<PhotoParserResult>;
  onComplete: () => void;
}

function normalizeError(input: unknown): Error {
  return input instanceof Error
    ? input
    : typeof input === 'string'
      ? new Error(input)
      : new Error(JSON.stringify(input));
}

export function ImportPhotoController(props: IImportControllerProps): ReactNode {
  const setPhotos = useImportPhotoStore((s) => s.setPhotos);
  const patchPhoto = useImportPhotoStore((s) => s.patchPhoto);

  async function processPhoto(task: IAsyncQueueTask<IImportingPhoto>): Promise<void> {
    try {
      patchPhoto(task.index, { status: ImportPhotoStatus.OPTIMIZING });
      let source: string | null = await props.onRead(task.item.uri);
      source = await props.onOptimize(source);

      patchPhoto(task.index, { status: ImportPhotoStatus.PROCESSING });
      const parsing = props.onParse(source);
      source = null;

      const data = await parsing;

      if (!data.categoryExpenses.length) {
        patchPhoto(task.index, { status: ImportPhotoStatus.NO_DATA });
        return;
      }

      patchPhoto(task.index, {
        status: ImportPhotoStatus.COMPLETED,
        data,
      });
    } catch (error_) {
      const error = normalizeError(error_);

      patchPhoto(task.index, {
        status: ImportPhotoStatus.FAILED,
        error,
      });

      console.error(`Error while parsing photo ${getUriFilename(task.item.uri)}`, error);
    }
  }

  useEffect(() => {
    const photos = props.initialImages.map((uri): IImportingPhoto => ({
      uri,
      status: ImportPhotoStatus.QUEUED,
    }));

    setPhotos(photos);

    setTimeout(async () => {
      await ImportPhotoQueue.process({
        queue: photos,
        maxConcurrent: 3,
        process: processPhoto,
      });

      props.onComplete();
    }, 100);
  }, []);

  return null;
}
