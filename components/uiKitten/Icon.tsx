import type { ImageProps } from 'react-native';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { Icon as Icon_, type IconProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';

export const enum IconName {
  ARROW_BACK = 'arrow-back',
  PLUS = 'plus',
  LIST = 'list',
  BRIEFCASE_OUTLINE = 'briefcase-outline',
  CALENDAR_OUTLINE = 'calendar-outline',
}

export function Icon(props: Omit<IconProps, 'name'> & { name: IconName }): ReactNode {
  return <Icon_ {...props} />;
}

export function iconRenderer(name: IconName): RenderProp<Partial<ImageProps>> {
  return (iconProps) => <Icon {...iconProps} name={name} />;
}
