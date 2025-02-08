import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';
import type { IPropsWithStyle } from '@/types';

export interface IHomeCardTitleProps extends IPropsWithStyle<ViewStyle> {
  title: string;
  status?: 'basic' | 'danger';
  linked?: boolean;
}

export function HomeCardTitle(props: IHomeCardTitleProps) {
  const theme = useTheme();
  const color = props.status === 'danger' ? theme['color-danger-600'] : undefined;

  return (
    <View style={[styles.row, props.style]}>
      <Text
        category="h4"
        style={{ color } satisfies StyleProp<TextStyle>}
      >
        {props.title}
      </Text>

      {props.linked && (
        <Icon
          name={IconName.CHEVRON_RIGHT}
          fill={color}
          style={styles.icon}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  } satisfies TextStyle,

  icon: {
    width: 24,
    height: 24,
    marginBottom: -1,
  } satisfies ViewStyle,
});
