import type { ReactNode } from 'react';
import { Divider, Menu, MenuItem, useTheme } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { IconName, iconRenderer, textRenderer } from '@/components/uiKitten';
import { FullScreenLayout } from '@/components/layout';

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

      title={textRenderer(props.title, {
        style: props.danger && { color: theme['color-danger-500'] },
      })}

      accessoryLeft={iconRenderer(
        props.icon,
        props.danger ? { fill: theme['color-danger-500'] } : undefined,
      )}

      onPress={() => router.push(props.href())}
    />
  );
}

export default function Index(): ReactNode {
  const { t } = useTranslation();

  return (
    <FullScreenLayout title={t('settings.index.heading')}>
      <Menu
        style={styles.menu}

        ItemSeparatorComponent={() => (
          <Divider style={styles.menuDivider} />
        )}
      >
        <SettingsItem
          title={t('settings.index.menu.categories')}
          icon={IconName.FOLDER}
          href={() => '/categories'}
        />

        <SettingsItem
          title={t('settings.index.menu.notifications')}
          icon={IconName.BELL}
          href={() => '/settings/notifications'}
        />

        <SettingsItem
          title={t('settings.index.menu.language')}
          icon={IconName.SETTINGS}
          href={() => '/settings/language'}
        />

        <SettingsItem
          danger
          title={t('settings.index.menu.clearData')}
          icon={IconName.ALERT_TRIANGLE}
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
    marginHorizontal: 6,
  } satisfies ViewStyle,

  menuItem: {
    borderRadius: 6,
  } satisfies ViewStyle,
});
