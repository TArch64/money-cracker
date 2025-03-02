import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useUserSuspenseQuery } from '@/hooks/queries';
import { useActionSheet } from '@/hooks/actionSheet';
import { useImagePicker, usePhoneCamera } from '@/hooks/useImagePicker';
import { HomeCard } from './HomeCard';
import { HomeCardTitle } from './HomeCardTitle';

export function HomeImportPhoto(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const userQuery = useUserSuspenseQuery();
  const camera = usePhoneCamera();
  const imagePicker = useImagePicker();

  function openImportScreen(images: ImagePickerAsset[] | null): void {
    if (!images) {
      return;
    }

    router.push({
      pathname: '/records/import-photo',
      params: { images: images.map((image) => image.uri) },
    });
  }

  const openImportOptions = useActionSheet((ctx) => [
    ctx
      .action(t('home.sections.importPhoto.options.photo'))
      .onPress(async () => openImportScreen(await camera.open())),

    ctx
      .action(t('home.sections.importPhoto.options.gallery'))
      .onPress(async () => openImportScreen(await imagePicker.open())),

    ctx.cancel(),
  ]);

  return (
    <HomeCard
      onPress={() => {
        userQuery.data.anthropicKey
          ? openImportOptions()
          : router.push('/settings/import-photo');
      }}
    >
      <HomeCardTitle
        linked
        title={t('home.sections.importPhoto.title')}
        style={styles.title}
      />

      <Text>
        {t('home.sections.importPhoto.description')}
      </Text>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  } satisfies ViewStyle,
});
