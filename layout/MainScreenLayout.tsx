import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { Divider, type TextProps, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { BackIcon } from './BackIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RenderProp } from '@ui-kitten/components/devsupport';

export interface IMainScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  title: string | RenderProp<TextProps>;
  headerRight?: () => ReactElement;
}

export function MainScreenLayout(props: IMainScreenLayoutProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme['background-basic-color-1'] },
      ]}
    >
      <TopNavigation
        title={props.title}
        alignment="center"

        accessoryLeft={router.canGoBack() ? (() => (
          <TopNavigationAction
            icon={BackIcon}
            onPress={router.back}
          />
        )) : undefined}

        accessoryRight={props.headerRight}
      />

      <Divider />

      <View
        style={[
          props.style,
          styles.content,
          { backgroundColor: theme['background-basic-color-2'] },
        ]}
      >
        {props.children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  } satisfies ViewStyle,

  content: {
    flexGrow: 1,
  } satisfies ViewStyle,
});
