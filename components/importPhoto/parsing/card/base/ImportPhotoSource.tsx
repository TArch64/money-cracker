import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, StyleSheet, type TextStyle } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { IconName, iconRenderer, textRenderer } from '@/components/uiKitten';
import { getUriFilename } from '@/helpers/getUriFilename';

export interface IImportPhotoSourceRef {
  show: (image: string) => void;
}

export const ImportPhotoSource = forwardRef<IImportPhotoSourceRef>((_, ref) => {
  const [uri, setUri] = useState<string>('');
  const filename = getUriFilename(uri);

  useImperativeHandle(ref, (): IImportPhotoSourceRef => ({
    show: (src) => setUri(src),
  }));

  return (
    <Modal
      visible={!!uri}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => setUri('')}
    >
      <SafeAreaView style={styles.wrapper}>
        <TopNavigation
          alignment="center"
          title={textRenderer(filename, {
            numberOfLines: 1,
            ellipsizeMode: 'middle',
            style: styles.title,
          })}

          accessoryLeft={() => (
            <TopNavigationAction
              icon={iconRenderer(IconName.ARROW_BACK)}
              onPress={() => setUri('')}
            />
          )}
        />

        <Image
          source={uri}
          contentFit="contain"
          contentPosition="top"
          style={styles.image}
        />
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  title: {
    maxWidth: '75%',
  } satisfies TextStyle,

  image: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: 8,
  } satisfies ImageStyle,
});
