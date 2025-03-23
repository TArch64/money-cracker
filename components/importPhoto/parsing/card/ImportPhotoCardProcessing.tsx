import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import { ImportPhotoCardFilename, ImportPhotoCardLayout, ImportPhotoCardTitle } from './base';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';

export function ImportPhotoCardProcessing(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout indicator={<Spinner />}>
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.processing.title')}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
