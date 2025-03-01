import type { ImageProps, ViewStyle } from 'react-native';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { Icon as Icon_, type IconProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import type { SvgProps } from 'react-native-svg';

export const enum IconName {
  ARROW_BACK = 'arrow-back',
  ARROW_UPWARD = 'arrow-upward',
  ARROW_DOWNWARD = 'arrow-downward',
  PLUS = 'plus',
  LIST = 'list',
  BRIEFCASE = 'briefcase-outline',
  CALENDAR = 'calendar-outline',
  PIE_CHART = 'pie-chart-outline',
  CHEVRON_DOWN = 'chevron-down',
  CHEVRON_RIGHT = 'chevron-right',
  TRASH = 'trash-outline',
  EDIT = 'edit-outline',
  SETTINGS = 'settings-2-outline',
  FOLDER = 'folder-outline',
  ALERT_TRIANGLE = 'alert-triangle-outline',
  HEART = 'heart-outline',
  LOCK = 'lock-outline',
  GITHUB = 'github-outline',
  SHIELD = 'shield-outline',
  BELL = 'bell-outline',
  IMAGE = 'image-outline',
}

export const Icon = (props: Omit<IconProps<SvgProps>, 'name'> & { name: IconName }): ReactNode => (
  <Icon_ {...props} />
);

export const iconRenderer = (name: IconName, props?: Partial<IconProps<SvgProps>>): RenderProp<Partial<ImageProps>> =>
  (iconProps) => (
    <Icon
      {...iconProps}
      {...props}
      name={name}
      style={[iconProps?.style as ViewStyle, props?.style]}
    />
  );
