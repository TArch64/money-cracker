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
  PIE_CHART_OUTLINE = 'pie-chart-outline',
  CHEVRON_DOWN = 'chevron-down',
  TRASH_OUTLINE = 'trash-outline',
  EDIT_OUTLINE = 'edit-outline',
}

export const Icon = (props: Omit<IconProps, 'name'> & { name: IconName }): ReactNode => (
  <Icon_ {...props} />
);

export const iconRenderer = (name: IconName): RenderProp<Partial<ImageProps>> =>
  (iconProps) => <Icon {...iconProps} name={name} />;
