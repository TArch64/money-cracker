import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Divider, type TextProps, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';

export interface IMainScreenLayoutProps extends PropsWithChildren {
  title: string | RenderProp<TextProps>;
  subtitle?: string | RenderProp<TextProps>;
  canGoBack?: boolean;
  headerLeft?: () => ReactElement;
  headerRight?: () => ReactElement;
}

export function MainScreenLayout(props: IMainScreenLayoutProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();
  const canGoBack = props.canGoBack ?? router.canGoBack();

  const headerLeft = props.headerLeft ?? (canGoBack ? (() => (
    <TopNavigationAction
      icon={iconRenderer(IconName.ARROW_BACK)}
      onPress={router.back}
    />
  )) : undefined);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        { backgroundColor: theme['background-basic-color-1'] },
      ]}
    >
      <TopNavigation
        title={props.title}
        subtitle={props.subtitle}
        alignment="center"
        accessoryLeft={headerLeft}
        accessoryRight={props.headerRight}
      />

      <Divider />

      <View
        style={[
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  } satisfies ViewStyle,

  content: {
    flex: 1,
  } satisfies ViewStyle,
});
