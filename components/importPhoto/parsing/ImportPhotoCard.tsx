import type { ReactNode } from 'react';
import { Spinner } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { type IImportingPhoto, ImportPhotoStatus } from '@/stores';
import { IconName } from '@/components/uiKitten';
import { getEnumValue } from '@/helpers/getEnumValue';
import { ImportPhotoCardIndicatorIcon } from './ImportPhotoCardIndicatorIcon';
import { ImportPhotoCardLayout } from './ImportPhotoCardLayout';
import { ImportPhotoCardTitle } from './ImportPhotoCardTitle';

export interface IImportPhotoCardProps {
  photo: IImportingPhoto;
}

function PhotoOptimizing(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout indicator={<Spinner status="warning" />}>
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.optimizing.title')}
      </ImportPhotoCardTitle>
    </ImportPhotoCardLayout>
  );
}

function PhotoProcessing(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();
  return (
    <ImportPhotoCardLayout indicator={<Spinner />}>
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.processing.title')}
      </ImportPhotoCardTitle>
    </ImportPhotoCardLayout>
  );
}

function PhotoCompleted(props: IImportPhotoCardProps): ReactNode {
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
    </ImportPhotoCardLayout>
  );
}

function PhotoFailed(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout
      indicator={
        <ImportPhotoCardIndicatorIcon name={IconName.ALERT_CIRCLE} status="danger" />
      }
    >
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.failed.title')}
      </ImportPhotoCardTitle>
    </ImportPhotoCardLayout>
  );
}

export function ImportPhotoCard(props: IImportPhotoCardProps): ReactNode {
  const Content = getEnumValue(props.photo.status, {
    [ImportPhotoStatus.OPTIMIZING]: () => PhotoOptimizing,
    [ImportPhotoStatus.PROCESSING]: () => PhotoProcessing,
    [ImportPhotoStatus.COMPLETED]: () => PhotoCompleted,
    [ImportPhotoStatus.FAILED]: () => PhotoFailed,
  });

  return <Content {...props} />;
}
