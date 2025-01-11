import { type PropsWithChildren, type ReactNode } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from './MainScreenLayout';
import { Text, type TextProps } from '@ui-kitten/components';
import { Pressable, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useDateFormatter } from '@/hooks/formatters';
import { useMonthStore } from '@/stores';
import { Icon, IconName } from '@/components/uiKitten/Icon';

interface IHeaderTitleProps extends TextProps {
  onPress: () => void;
}

function HeaderTitle(props: IHeaderTitleProps): ReactNode {
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  return (
    <Pressable
      style={styles.titlePressable}
      onPress={props.onPress}
    >
      <Text {...props} style={props.style}>
        {monthTitle}
      </Text>

      <Icon name={IconName.CHEVRON_DOWN} />
    </Pressable>
  )
}

export interface ITabScreenLayoutProps extends PropsWithChildren {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}
      title={(txtProps) => <HeaderTitle {...txtProps} onPress={() => console.log('test')} />}
    >
      {props.children}
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: '100%',
  } satisfies ViewStyle,

  titlePressable: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies TextStyle,
});
