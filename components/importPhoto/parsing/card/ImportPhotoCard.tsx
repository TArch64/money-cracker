import { type ReactNode } from 'react';
import { ImportPhotoStatus } from '@/stores';
import { getEnumValue } from '@/helpers/getEnumValue';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';
import { ImportPhotoCardQueued } from './ImportPhotoCardQueued';
import { ImportPhotoCardOptimizing } from './ImportPhotoCardOptimizing';
import { ImportPhotoCardProcessing } from './ImportPhotoCardProcessing';
import { ImportPhotoCardCompleted } from './ImportPhotoCardCompleted';
import { ImportPhotoCardFailed } from './ImportPhotoCardFailed';
import { ImportPhotoCardNoData } from './ImportPhotoCardNoData';

export function ImportPhotoCard(props: IImportPhotoCardProps): ReactNode {
  const Content = getEnumValue(props.photo.status, {
    [ImportPhotoStatus.QUEUED]: () => ImportPhotoCardQueued,
    [ImportPhotoStatus.OPTIMIZING]: () => ImportPhotoCardOptimizing,
    [ImportPhotoStatus.PROCESSING]: () => ImportPhotoCardProcessing,
    [ImportPhotoStatus.COMPLETED]: () => ImportPhotoCardCompleted,
    [ImportPhotoStatus.FAILED]: () => ImportPhotoCardFailed,
    [ImportPhotoStatus.NO_DATA]: () => ImportPhotoCardNoData,
  });

  return <Content {...props} />;
}
