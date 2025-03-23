import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';

export interface IImportPhotoCardFilenameProps {
  uri: string;
}

export function ImportPhotoCardFilename(props: IImportPhotoCardFilenameProps): ReactNode {
  const filename = props.uri.split('/').at(-1)!;

  return (
    <Text category="label" style={styles.text} numberOfLines={1} ellipsizeMode="middle">
      {filename}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    opacity: 0.8,
  } satisfies TextStyle,
});
