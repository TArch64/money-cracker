import type { ReactNode } from 'react';
import { useTheme } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { type ElementStatus, Icon, IconName } from '@/components/uiKitten';

export interface IImportPhotoCardIndicatorIconProps {
  status: ElementStatus;
  name: IconName;
}

export function ImportPhotoCardIndicatorIcon(props: IImportPhotoCardIndicatorIconProps): ReactNode {
  const theme = useTheme();

  return (
    <Icon
      name={props.name}
      fill={theme[`color-${props.status}-600`]}
      style={styles.indicatorIcon}
    />
  );
}

const styles = StyleSheet.create({
  indicatorIcon: {
    width: 24,
    height: 24,
  } satisfies ViewStyle,
});
