import { FullScreenLayout } from '@/components/layout';
import type { ReactNode } from 'react';
import { Divider, Menu, MenuItem, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { IconName, iconRenderer, textRenderer } from '@/components/uiKitten';
import { type Href, useRouter } from 'expo-router';

interface ISettingsItemProps {
  title: string;
  icon: IconName;
  danger?: boolean;
  href: () => Href;
}

function SettingsItem(props: ISettingsItemProps): ReactNode {
  const theme = useTheme();
  const router = useRouter();

  return (
    <MenuItem
      style={styles.menuItem}
      title={textRenderer(props.title, { style: props.danger && { color: theme['color-danger-500'] } })}
      accessoryLeft={iconRenderer(props.icon, props.danger ? { fill: theme['color-danger-500'] } : undefined)}
      onPress={() => router.push(props.href())}
    />
  );
}

export default function Settings(): ReactNode {
  const theme = useTheme();

  return (
    <FullScreenLayout canGoBack={false} title="Settings">
      <Menu
        style={[
          styles.menu,
          { backgroundColor: theme['background-basic-color-1'] },
        ] satisfies StyleProp<ViewStyle>}

        ItemSeparatorComponent={() => (
          <Divider style={styles.menuDivider} />
        )}
      >
        <SettingsItem
          title="Categories"
          icon={IconName.FOLDER_OUTLINE}
          href={() => '/settings/categories'}
        />

        <SettingsItem
          danger
          title="Clear Data"
          icon={IconName.ALERT_TRIANGLE_OUTLINE}
          href={() => '/settings/clear-data'}
        />
      </Menu>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 12,
  } satisfies ViewStyle,

  menuDivider: {
    marginHorizontal: 4,
  } satisfies ViewStyle,

  menuItem: {
    borderRadius: 4,
  } satisfies ViewStyle,
});
