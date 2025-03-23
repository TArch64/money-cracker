import type { ReactNode } from 'react';
import { Spinner } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { type IImportingPhoto, ImportPhotoStatus } from '@/stores';
import { IconName } from '@/components/uiKitten';
import { getEnumValue } from '@/helpers/getEnumValue';
import { ImportPhotoCardIndicatorIcon } from './ImportPhotoCardIndicatorIcon';
import { ImportPhotoCardLayout } from './ImportPhotoCardLayout';
import { ImportPhotoCardTitle } from './ImportPhotoCardTitle';
import { ImportPhotoCardFilename } from './ImportPhotoCardFilename';

export interface IImportPhotoCardProps {
  photo: IImportingPhoto;
}

function PhotoQueued(props: IImportPhotoCardProps): ReactNode {
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

function PhotoOptimizing(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();

  return (
    <ImportPhotoCardLayout indicator={<Spinner status="warning" />}>
      <ImportPhotoCardTitle>
        {t('importPhoto.index.card.status.optimizing.title')}
      </ImportPhotoCardTitle>

      <ImportPhotoCardFilename uri={props.photo.uri} />
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

      <ImportPhotoCardFilename uri={props.photo.uri} />
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

      <ImportPhotoCardFilename uri={props.photo.uri} />
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

      <ImportPhotoCardFilename uri={props.photo.uri} />
    </ImportPhotoCardLayout>
  );
}

export function ImportPhotoCard(props: IImportPhotoCardProps): ReactNode {
  const Content = getEnumValue(props.photo.status, {
    [ImportPhotoStatus.QUEUED]: () => PhotoQueued,
    [ImportPhotoStatus.OPTIMIZING]: () => PhotoOptimizing,
    [ImportPhotoStatus.PROCESSING]: () => PhotoProcessing,
    [ImportPhotoStatus.COMPLETED]: () => PhotoCompleted,
    [ImportPhotoStatus.FAILED]: () => PhotoFailed,
  });

  return <Content {...props} />;
}
