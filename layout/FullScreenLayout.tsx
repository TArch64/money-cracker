import type { PropsWithChildren, ReactNode } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BackIcon } from './BackIcon';

export function registerFullScreenStack(name: string): ReactNode {
  return <Stack.Screen name={name} options={{ headerShown: false }} />;
}

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  name: string;
  title?: string;
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  const router = useRouter();

  return (
    <>
      <Stack.Screen name={props.name} />

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
    </>
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
