import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';
import type { IPropsWithStyle } from '@/types';

export interface IHomeCardTitleProps extends IPropsWithStyle<ViewStyle> {
  title: string;
  linked?: boolean;
}

export const HomeCardTitle = (props: IHomeCardTitleProps) => (
  <View style={[styles.row, props.style]}>
    <Text category="h4">
      {props.title}
    </Text>

    {props.linked && (
      <Icon
        name={IconName.CHEVRON_RIGHT}
        style={styles.icon}
      />
    )}
  </View>
);

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
