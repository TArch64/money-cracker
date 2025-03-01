import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUserSuspenseQuery } from '@/hooks/queries';
import { HomeCard } from './HomeCard';
import { HomeCardTitle } from './HomeCardTitle';

export function HomeImportPhoto(): ReactNode {
  const { t } = useTranslation();
  const userQuery = useUserSuspenseQuery();

  return (
    <HomeCard
      href={() => userQuery.data.anthropicKey ? '/records/import-photo' : '/settings/import-photo'}
    >
      <HomeCardTitle
        linked
        title={t('home.sections.importPhoto.title')}
        style={styles.title}
      />

      <Text>
        {t('home.sections.importPhoto.description')}
      </Text>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  } satisfies ViewStyle,
});
