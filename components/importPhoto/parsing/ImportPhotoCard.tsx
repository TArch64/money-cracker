import type { ReactNode } from 'react';
import { Card } from '@ui-kitten/components';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { IImportingPhoto } from '@/stores';

export interface IImportPhotoCardProps {
  photo: IImportingPhoto;
}

export function ImportPhotoCard(props: IImportPhotoCardProps): ReactNode {
  return (
    <Card style={styles.card}>
      <View style={styles.cardInner}>

      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  } satisfies ViewStyle,

  cardInner: {
    display: 'flex',
    flexDirection: 'row',
  } satisfies ViewStyle,
});
