import { type PropsWithChildren, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BackIcon } from './BackIcon';

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  name: string;
  title?: string;
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
  safeArea: {
    height: '100%',
    backgroundColor: 'white'
  },

  wrapper: {
    height: '100%',
  }
});
