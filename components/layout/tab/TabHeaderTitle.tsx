import { Text, type TextProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { useMonthStore } from '@/stores';
import { useDateFormatter } from '@/hooks/formatters';
import { StyleSheet, type TextStyle, View } from 'react-native';
import { Icon, IconName } from '@/components/uiKitten';
import { Link } from 'expo-router';

export interface ITabHeaderTitleProps extends TextProps {
}

export function TabHeaderTitle(props: ITabHeaderTitleProps): ReactNode {
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  return (
    <Link href="/modals/switch-month">
      <View style={styles.titlePressable}>
        <Text style={props.style}>
          {monthTitle}
        </Text>

        <Icon name={IconName.CHEVRON_DOWN} />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  titlePressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies TextStyle,
});
