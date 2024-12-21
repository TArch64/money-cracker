import type { PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';

export function registerFullScreenStacks(...names: string[]): ReactNode {
  return names.map((name) => (
    <Stack.Screen
      key={name}
      name={name}
      options={{ headerShown: false }}
    />
  ));
}

export function waitInitialStackEnter(onEnter: () => void): void {
  setTimeout(onEnter, 500);
}

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  name: string;
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  return (
    <>
      <Stack.Screen name={props.name} />

      <SafeAreaView style={styles.safeArea}>
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
