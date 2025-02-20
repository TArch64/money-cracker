import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import type { IPropsWithStyle } from '@/types';
import { type ElementStatus, Icon, IconName } from '@/components/uiKitten';

export interface IIntroContainedIconProps extends IPropsWithStyle<ViewStyle> {
  size: number;
  name: IconName;
  status: ElementStatus;
}

export function IntroContainedIcon(props: IIntroContainedIconProps) {
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
