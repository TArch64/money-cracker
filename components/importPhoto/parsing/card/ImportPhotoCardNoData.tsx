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

export function ImportPhotoCardNoData(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout
      photo={props.photo}

      indicator={
        <ImportPhotoCardIndicatorIcon name={IconName.ALERT_CIRCLE} status="info" />
      }
    >
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.noData.title')}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
