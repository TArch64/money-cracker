import { type ReactNode, useEffect } from 'react';
import { type IImportingPhoto, ImportPhotoStatus, useImportPhotoStore } from '@/stores';
import type { PhotoParserResult } from '@/hooks/importPhoto';
import { AsyncQueue, type IAsyncQueueTask } from './AsyncQueue';

export interface IImportControllerProps {
  initialImages: string[];
  onRead: (uri: string) => Promise<string>;
  onOptimize: (source: string) => Promise<string>;
  onParse: (source: string) => Promise<PhotoParserResult>;
  onComplete: () => void;
}

export function ImportPhotoController(props: IImportControllerProps): ReactNode {
  const setPhotos = useImportPhotoStore((s) => s.setPhotos);
  const patchPhoto = useImportPhotoStore((s) => s.patchPhoto);

  async function processPhoto(task: IAsyncQueueTask<IImportingPhoto>): Promise<void> {
    try {
      let source: string | null = await props.onRead(task.item.uri);
      source = await props.onOptimize(source);
      patchPhoto(task.index, { status: ImportPhotoStatus.PROCESSING });

      await new Promise((resolve, reject) => {
        const done = task.index % 2 === 0 ? resolve : reject;
        setTimeout(done, 1000);
      });

      // const parsing = props.onParse(source);
      // source = null;
      // await parsing;
      patchPhoto(task.index, { status: ImportPhotoStatus.COMPLETED });
    } catch (e) {
      patchPhoto(task.index, { status: ImportPhotoStatus.FAILED });
      console.error(e);
    }
  }

  useEffect(() => {
    const photos = props.initialImages.map((uri): IImportingPhoto => ({
      uri,
      status: ImportPhotoStatus.OPTIMIZING,
    }));

    setPhotos(photos);

    setTimeout(async () => {
      await AsyncQueue.process({
        queue: photos,
        maxConcurrent: 3,
        process: processPhoto,
      });

      props.onComplete();
    }, 100);
  }, []);

  return null;
}
