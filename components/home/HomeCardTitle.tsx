import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';
import type { IPropsWithStyle } from '@/types';

export interface IHomeCardTitleProps extends IPropsWithStyle<ViewStyle> {
  title: string;
  status?: 'basic' | 'danger';
  linked?: boolean;
  padding?: boolean;
}

export function HomeCardTitle(props: IHomeCardTitleProps) {
  const theme = useTheme();
  const color = props.status === 'danger' ? theme['color-danger-600'] : theme['text-basic-color'];

  return (
    <View
      style={[
        styles.row,
        props.padding && styles.rowPadding,
        props.style,
      ]}
    >
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

  rowPadding: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  icon: {
    width: 24,
    height: 24,
    marginBottom: -1,
  } satisfies ViewStyle,
});
