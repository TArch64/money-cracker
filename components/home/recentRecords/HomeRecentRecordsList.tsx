import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { RecordWithCategory } from '@/db';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { HomeRecentRecord } from './HomeRecentRecord';

export interface IHomeRecentRecordsListProps {
  records: RecordWithCategory[];
}

export function HomeRecentRecordsList(props: IHomeRecentRecordsListProps): ReactNode {
  const { t } = useTranslation();

  return (
    <HomeCard padding={false} href="/records">
      <HomeCardTitle
        padding
        linked
        title={t('home.sections.recentRecords.title')}
      />

      <View style={styles.list}>
        {props.records.map((record) => (
          <HomeRecentRecord
            key={record.id}
            record={record}
          />
        ))}
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingHorizontal: 4,
    paddingBottom: 8,
  } satisfies ViewStyle,
});
