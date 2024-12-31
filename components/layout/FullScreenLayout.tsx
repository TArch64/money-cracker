import { type PropsWithChildren, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { BackIcon } from './BackIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  title?: string;
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.wrapper,
        { backgroundColor: theme['background-basic-color-1'] },
      ]}
    >
      {props.title && (
        <TopNavigation
          accessoryLeft={router.canGoBack() ? (() => (
            <TopNavigationAction
              icon={BackIcon}
              onPress={router.back}
            />
          )) : undefined}
          title={props.title}
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
