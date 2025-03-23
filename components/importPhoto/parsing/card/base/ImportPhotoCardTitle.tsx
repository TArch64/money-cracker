import { Text, type TextProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';

export const ImportPhotoCardTitle = (props: TextProps): ReactNode => (
  <Text
    {...props}
    style={[props.style, styles.title]}
  />
);

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    marginBottom: 4,
  } satisfies TextStyle,
});
