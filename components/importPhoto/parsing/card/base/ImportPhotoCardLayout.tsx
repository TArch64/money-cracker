import { type PropsWithChildren, type ReactNode, useRef } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Card } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { type ActionSheetMenuBuilder, useActionSheet } from '@/hooks/actionSheet';
import type { IImportingPhoto } from '@/stores';
import { type IImportPhotoSourceRef, ImportPhotoSource } from './ImportPhotoSource';

export interface IImportPhotoCardLayoutProps extends PropsWithChildren {
  photo: IImportingPhoto;
  indicator: ReactNode;
  actions?: ActionSheetMenuBuilder;
}

export const ImportPhotoCardLayout = (props: IImportPhotoCardLayoutProps): ReactNode => {
  const { t } = useTranslation();
  const sourceModalRef = useRef<IImportPhotoSourceRef>(null);
  const showSource = () => sourceModalRef.current?.show(props.photo.uri);

  const showActionsSheet = useActionSheet((ctx) => [
    ctx
      .action(t('importPhoto.index.card.actions.showSource'))
      .onPress(showSource),

    ...(props.actions?.(ctx) ?? []),

    ctx.cancel(),
  ]);

  return (
    <>
      <Card
        style={styles.card}
        onPress={() => props.actions ? showActionsSheet() : showSource()}
      >
        <View style={styles.layout}>
          {props.indicator}

          <View style={styles.main}>
            {props.children}
          </View>
        </View>
      </Card>

      <ImportPhotoSource ref={sourceModalRef} />
    </>
  );
};

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
