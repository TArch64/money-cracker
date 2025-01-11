import { Text, type TextProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { useMonthStore } from '@/stores';
import { useDateFormatter } from '@/hooks/formatters';
import { Pressable, StyleSheet, type TextStyle } from 'react-native';
import { Icon, IconName } from '@/components/uiKitten/Icon';

export interface ITabHeaderTitleProps extends TextProps {
  onPress: () => void;
}

export function TabHeaderTitle(props: ITabHeaderTitleProps): ReactNode {
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
  );
}

const styles = StyleSheet.create({
  titlePressable: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies TextStyle,
});
