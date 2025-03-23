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

export function ImportPhotoCardCompleted(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout
      indicator={
        <ImportPhotoCardIndicatorIcon name={IconName.CHECKMARK} status="success" />
      }
    >
      <ImportPhotoCardTitle>
        Completed
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
