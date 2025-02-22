import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, type ViewStyle } from 'react-native';
import { FullScreenLayout } from '@/components/layout';
import { ReminderSettings } from '@/components/notifications/settings';

export default function Notifications(): ReactNode {
  const { t } = useTranslation();

  return (
    <FullScreenLayout
      title={t('settings.notifications.heading')}
      style={styles.layout}
    >
      <ReminderSettings />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 12,
  } satisfies ViewStyle,
});
