import { type PropsWithChildren, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { type TextProps, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  title?: string | RenderProp<TextProps>;
  canGoBack?: boolean;
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();
  const canGoBack = props.canGoBack ?? router.canGoBack();

  return (
    <SafeAreaView
      style={[
        styles.wrapper,
        { backgroundColor: theme['background-basic-color-1'] },
      ]}
    >
      {props.title && (
        <TopNavigation
          title={props.title}

          accessoryLeft={canGoBack ? (() => (
            <TopNavigationAction
              icon={iconRenderer(IconName.ARROW_BACK)}
              onPress={router.back}
            />
          )) : undefined}
        />
      )}

      <View style={[props.style, styles.wrapper]}>
        {props.children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
  }
});
