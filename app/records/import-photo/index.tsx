import type { ReactNode } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { readAsStringAsync } from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useImportOptimization, useImportParser } from '@/hooks/importPhoto';
import { FullScreenLayout } from '@/components/layout';
import { ImportPhotoCard, ImportPhotoController } from '@/components/importPhoto';
import { useImportPhotoStore } from '@/stores';

function PhotoList(): ReactNode {
  const photos = useImportPhotoStore((s) => s.photos);

  return (
    <>
      {photos.map((photo) => (
        <ImportPhotoCard
          key={photo.uri}
          photo={photo}
        />
      ))}
    </>
  );
}

export default function ImportPhoto(): ReactNode {
  const { t } = useTranslation();
  const searchParams = useLocalSearchParams<{ images: string }>();
  const optimization = useImportOptimization();
  const parser = useImportParser();

  const initialImages = searchParams.images.split(',');

  return (
    <FullScreenLayout title={t('importPhoto.index.heading')}>
      <ImportPhotoController
        initialImages={initialImages}
        onRead={(uri) => readAsStringAsync(uri, { encoding: 'base64' })}
        onOptimize={optimization.optimize}
        onParse={parser.parse}
        onComplete={() => console.log('parsing completed')}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text>
          Processing {initialImages.length} photos
        </Text>

        <PhotoList />
      </ScrollView>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 12,
    gap: 16,
  },
});
