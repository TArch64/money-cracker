import { type ReactNode, useEffect } from 'react';
import { type IImportingPhoto, ImportPhotoStatus, useImportPhotoStore } from '@/stores';
import type { PhotoParserResult } from '@/hooks/importPhoto';

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

  async function processPhoto(photo: IImportingPhoto, index: number): Promise<void> {
    try {
      let source: string | null = await props.onRead(photo.uri);
      source = await props.onOptimize(source);
      patchPhoto(index, { status: ImportPhotoStatus.PROCESSING });

      await new Promise((resolve, reject) => {
        const done = index % 2 === 0 ? resolve : reject;
        setTimeout(done, 1000);
      });

      // const parsing = props.onParse(source);
      // source = null;
      // await parsing;
      patchPhoto(index, { status: ImportPhotoStatus.COMPLETED });
    } catch (e) {
      patchPhoto(index, { status: ImportPhotoStatus.FAILED });
      console.error(e);
    }
  }

  useEffect(() => {
    const photos = props.initialImages.map((uri) => ({
      uri,
      status: ImportPhotoStatus.OPTIMIZING,
    }));

    setPhotos(photos);

    setTimeout(async () => {
      for (const [index, photo] of photos.entries()) {
        await processPhoto(photo, index);
      }

      props.onComplete();
    }, 100);
  }, []);

  return null;
}
