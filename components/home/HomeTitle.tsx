import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, type TextStyle, View } from 'react-native';
import { useMonthStore } from '@/stores';
import { useDateFormatter } from '@/hooks/formatters';
import { Text, useTheme } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';

export function HomeTitle(): ReactNode {
  const theme = useTheme();
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  return (
    <Link href="/modals/switch-month">
      <View style={styles.row}>
        <Text category="h1">
          {monthTitle}
        </Text>

        <Icon
          name={IconName.CHEVRON_DOWN}
          style={{ width: 28, height: 28 }}
        />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  } satisfies TextStyle,
});
