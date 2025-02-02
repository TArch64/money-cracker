import type { ImageProps, ViewStyle } from 'react-native';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { Icon as Icon_, type IconProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import type { SvgProps } from 'react-native-svg';

export const enum IconName {
  ARROW_BACK = 'arrow-back',
  ARROW_UPWARD = 'arrow-upward',
  PLUS = 'plus',
  LIST = 'list',
  BRIEFCASE_OUTLINE = 'briefcase-outline',
  CALENDAR_OUTLINE = 'calendar-outline',
  PIE_CHART_OUTLINE = 'pie-chart-outline',
  CHEVRON_DOWN = 'chevron-down',
  CHEVRON_RIGHT = 'chevron-right',
  TRASH_OUTLINE = 'trash-outline',
  EDIT_OUTLINE = 'edit-outline',
  SETTINGS_OUTLINE = 'settings-2-outline',
  FOLDER_OUTLINE = 'folder-outline',
  ALERT_TRIANGLE_OUTLINE = 'alert-triangle-outline',
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
