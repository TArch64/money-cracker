import type { ReactNode } from 'react';
import { IconName } from '@/components/uiKitten';
import type { IImportingPhotoCompleted } from '@/stores';
import {
  ImportPhotoCardFilename,
  ImportPhotoCardIndicatorIcon,
  ImportPhotoCardLayout,
  ImportPhotoCardTitle,
} from './base';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';

export function ImportPhotoCardCompleted(props: IImportPhotoCardProps): ReactNode {
  const photo = props.photo as IImportingPhotoCompleted;
  const title = photo.data.categoryExpenses.map((category) => category.category).join(', ');

  return (
    <ImportPhotoCardLayout
      photo={props.photo}

      indicator={
        <ImportPhotoCardIndicatorIcon name={IconName.CHECKMARK} status="success" />
      }
    >
      <ImportPhotoCardTitle>
        {title}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}
