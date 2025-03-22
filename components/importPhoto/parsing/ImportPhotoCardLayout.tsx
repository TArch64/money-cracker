import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Card } from '@ui-kitten/components';

export interface IImportPhotoCardLayoutProps extends PropsWithChildren {
  indicator: ReactNode;
}

export const ImportPhotoCardLayout = (props: IImportPhotoCardLayoutProps): ReactNode => (
  <Card style={styles.card}>
    <View style={styles.layout}>
      {props.indicator}

      <View style={styles.main}>
        {props.children}
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  } satisfies ViewStyle,

  layout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,

  main: {
    flexBasis: 0,
    flexGrow: 1,
    marginLeft: 16,
  } satisfies ViewStyle,
});
