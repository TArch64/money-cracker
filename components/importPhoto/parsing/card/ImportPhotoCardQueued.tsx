import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IconName } from '@/components/uiKitten';
import {
  ImportPhotoCardFilename,
  ImportPhotoCardIndicatorIcon,
  ImportPhotoCardLayout,
  ImportPhotoCardTitle,
} from './base';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';

export function ImportPhotoCardQueued(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout
      indicator={
        <ImportPhotoCardIndicatorIcon name={IconName.CLOCK} status="basic" />
      }
    >
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.queued.title')}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
