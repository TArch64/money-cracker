import type { PropsWithChildren, ReactNode } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';
import type { IPropsWithStyle } from '@/types';
import { TopNavigationAction } from '@ui-kitten/components';
import { BackIcon } from './BackIcon';

export function registerMainScreenStack(name: string): ReactNode {
  return <Stack.Screen name={name} options={{ title: '' }} />;
}

export interface IMainScreenLayoutProps extends PropsWithChildren,
  IPropsWithStyle<ViewStyle> {
  name: string;
  title: string;
}

export function MainScreenLayout(props: IMainScreenLayoutProps): ReactNode {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        name={props.name}
        options={{
          title: props.title,
          headerLeft: (leftProps) => leftProps.canGoBack && (
            <TopNavigationAction
              icon={BackIcon}
              onPress={router.back}
            />
          ),
        }}
      />

      <SafeAreaView style={styles.wrapper}>
        <View style={[props.style, styles.wrapper]}>
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
  },
});
