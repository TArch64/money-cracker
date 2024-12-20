import type { PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

export interface IFullScreenLayoutProps extends PropsWithChildren {}

export function FullScreenLayout(props: IFullScreenLayoutProps): ReactNode {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        {props.children}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
    backgroundColor: 'white'
  }
});
