import { type ReactNode, useEffect } from 'react';
import { ImportPhotoStatus, useImportPhotoStore } from '@/stores';
import type { PhotoParserResult } from '@/hooks/importPhoto';

export interface IImportControllerProps {
  initialImages: string[];
  onRead: (uri: string) => Promise<string>;
  onOptimize: (source: string) => Promise<string>;
  onParse: (source: string) => Promise<PhotoParserResult>;
  onComplete: () => void;
}

export function ImportPhotoController(props: IImportControllerProps): ReactNode {
  const addPhotos = useImportPhotoStore((s) => s.addPhotos);
  const patchPhoto = useImportPhotoStore((s) => s.patchPhoto);

  useEffect(() => {
    const photos = props.initialImages.map((uri) => ({
      uri,
      status: ImportPhotoStatus.OPTIMIZING,
    }));

    addPhotos(photos);

    setTimeout(() => {
      const promises = photos.map(async (photo, index) => {
        try {
          let source: string | null = await props.onRead(photo.uri);
          source = await props.onOptimize(source);
          patchPhoto(index, { status: ImportPhotoStatus.PROCESSING });

          const parsing = props.onParse(source);
          source = null;
          await parsing;
          patchPhoto(index, { status: ImportPhotoStatus.COMPLETED });
        } catch (e) {
          patchPhoto(index, { status: ImportPhotoStatus.FAILED });
          console.error(e);
        }
      });

      Promise.allSettled(promises).then(props.onComplete);
    }, 100);
  }, []);

  return null;
}
