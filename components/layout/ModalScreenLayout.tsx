import { type PropsWithChildren, type ReactNode, Suspense } from 'react';
import { TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { IconName, iconRenderer } from '@/components/uiKitten';
import type { IPropsWithStyle } from '@/types';

export interface IModalScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  title: string;
}

export function ModalScreenLayout(props: IModalScreenLayoutProps): ReactNode {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <TopNavigation
        title={props.title}
        alignment="center"

        accessoryLeft={() => (
          <TopNavigationAction
            icon={iconRenderer(IconName.ARROW_BACK)}
            onPress={() => router.back()}
          />
        )}
      />

      <Suspense>
        <View
          style={[
            styles.content,
            { backgroundColor: theme['background-basic-color-1'] },
            props.style,
          ] satisfies StyleProp<ViewStyle>}
        >
          {props.children}
        </View>
      </Suspense>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  } satisfies ViewStyle,
});
