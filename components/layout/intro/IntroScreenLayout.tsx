import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { FullScreenLayout } from '../FullScreenLayout';

export const IntroScreenLayout = (props: PropsWithChildren): ReactNode => (
  <FullScreenLayout canGoBack={false} style={styles.layout}>
    <View style={styles.innerColumn}>
      {props.children}
    </View>
  </FullScreenLayout>
);

const styles = StyleSheet.create({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  } satisfies ViewStyle,

  innerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
  } satisfies ViewStyle,
});
