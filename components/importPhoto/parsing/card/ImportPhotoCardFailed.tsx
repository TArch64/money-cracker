import { forwardRef, type ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { IconName, iconRenderer } from '@/components/uiKitten';
import type { IImportingPhotoFailed } from '@/stores';
import {
  ImportPhotoCardFilename,
  ImportPhotoCardIndicatorIcon,
  ImportPhotoCardLayout,
  ImportPhotoCardTitle,
} from './base';
import type { IImportPhotoCardProps } from './IImportPhotoCardProps';

interface IErrorDetailsRef {
  show: (error: Error) => void;
}

const ErrorDetails = forwardRef<IErrorDetailsRef>((_, ref) => {
  const { t } = useTranslation();
  const [error, setError] = useState<Error | null>(null);

  useImperativeHandle(ref, (): IErrorDetailsRef => ({
    show: (error) => setError(error),
  }));

  return (
    <Modal
      visible={!!error}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => setError(null)}
    >
      {error && (
        <SafeAreaView>
          <TopNavigation
            alignment="center"
            title={t('importPhoto.index.card.status.failed.details.title')}

            accessoryLeft={() => (
              <TopNavigationAction
                icon={iconRenderer(IconName.ARROW_BACK)}
                onPress={() => setError(null)}
              />
            )}
          />

          <Text style={styles.detailsText}>
            {error.message}
          </Text>
        </SafeAreaView>
      )}
    </Modal>
  );
});

export function ImportPhotoCardFailed(props: IImportPhotoCardProps): ReactNode {
  const { t } = useTranslation();
  const detailsRef = useRef<IErrorDetailsRef>(null);
  const photo = props.photo as IImportingPhotoFailed;

  return (
    <>
      <ImportPhotoCardLayout
        photo={props.photo}

        indicator={
          <ImportPhotoCardIndicatorIcon name={IconName.ALERT_CIRCLE} status="danger" />
        }

        actions={(ctx) => [
          ctx
            .action(t('importPhoto.index.card.status.failed.actions.showError'))
            .onPress(() => detailsRef.current?.show(photo.error)),
        ]}
      >
        <ImportPhotoCardTitle>
          {t('importPhoto.index.card.status.failed.title')}
        </ImportPhotoCardTitle>

        <ImportPhotoCardFilename uri={photo.uri} />
      </ImportPhotoCardLayout>

      <ErrorDetails ref={detailsRef} />
    </>
  );
}

const styles = StyleSheet.create({
  detailsText: {
    paddingHorizontal: 20,
  } satisfies TextStyle,
});
