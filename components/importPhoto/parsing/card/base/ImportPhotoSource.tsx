import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { IconName, iconRenderer, textRenderer } from '@/components/uiKitten';
import { getUriFilename } from '@/helpers/getUriFilename';

export interface IImportPhotoSourceRef {
  show: (image: string) => void;
}

export const ImportPhotoSource = forwardRef<IImportPhotoSourceRef>((_, ref) => {
  const theme = useTheme();
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
      <View style={styles.wrapper}>
        <TopNavigation
          alignment="center"
          appearance="control"

          style={[
            styles.header,
            { backgroundColor: theme['color-basic-control-transparent-100'] },
          ] satisfies StyleProp<ViewStyle>}

          title={textRenderer(filename, {
            numberOfLines: 1,
            ellipsizeMode: 'middle',
            style: [
              styles.title,
              { color: theme['color-control-default'] },
            ],
          })}

          accessoryLeft={() => (
            <TopNavigationAction
              appearance="control"
              icon={iconRenderer(IconName.ARROW_BACK)}
              onPress={() => setUri('')}
            />
          )}
        />

        <Image
          source={uri}
          contentFit="contain"
          contentPosition="center"
          style={styles.image}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#111',
  } satisfies ViewStyle,

  header: {
    position: 'absolute',
    width: '100%',
  } satisfies ViewStyle,

  title: {
    paddingLeft: 48,
    paddingRight: 12,
  } satisfies TextStyle,

  image: {
    flex: 1,
  } satisfies ImageStyle,
});
