import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import { ImportPhotoCardFilename, ImportPhotoCardLayout, ImportPhotoCardTitle } from './base';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';

export function ImportPhotoCardOptimizing(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout
      photo={props.photo}
      indicator={<Spinner status="warning" />}
    >
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.optimizing.title')}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
