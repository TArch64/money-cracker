import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { HomeRecentRecord } from './HomeRecentRecord';

export interface IHomeRecentRecordsListProps {
  records: RecordWithCategory[];
}

export function HomeRecentRecordsList(props: IHomeRecentRecordsListProps): ReactNode {
  return (
    <HomeCard padding={false} href="/records">
      <HomeCardTitle
        padding
        linked
        title="Recent Transactions"
        style={styles.title}
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
  title: {
    marginBottom: 12,
  } satisfies ViewStyle,

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingHorizontal: 4,
    paddingBottom: 8,
  } satisfies ViewStyle,
});
