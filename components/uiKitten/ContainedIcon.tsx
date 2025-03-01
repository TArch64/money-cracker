import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import type { IPropsWithStyle } from '@/types';
import { Icon, type IconName } from './Icon';
import type { ElementStatus } from './ElementStatus';

export interface IContainedIconProps extends IPropsWithStyle<ViewStyle> {
  size: number;
  name: IconName;
  status: ElementStatus;
}

export function ContainedIcon(props: IContainedIconProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.containedIcon,
        props.style,
        {
          height: props.size,
          width: props.size,
          backgroundColor: theme[`color-${props.status}-100`],
        },
      ] satisfies StyleProp<ViewStyle>}
    >
      <Icon
        name={props.name}
        fill={theme[`color-${props.status}-600`]}
        style={{
          width: props.size / 1.8,
          height: props.size / 1.8,
        } satisfies StyleProp<ViewStyle>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containedIcon: {
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
});
