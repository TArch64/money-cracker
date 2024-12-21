import type { PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';

export interface IFullScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

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
