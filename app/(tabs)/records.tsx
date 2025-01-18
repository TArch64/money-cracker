import { type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { TabScreenLayout } from '@/components/layout';
import { Divider, List, Text, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { RecordType } from '@/enums';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useMonthStore } from '@/stores';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { MonthRecord } from '@/components/recordsList';

function MonthRecords(): ReactNode {
  const theme = useTheme();
  const monthIdx = useMonthStore((state) => state.activeIdx);

  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: monthIdx.year,
    month: monthIdx.month,
  });

  if (!recordsQuery.data.length) {
    return (
      <View style={[styles.empty]}>
        <Text>
          No records for this month
        </Text>
      </View>
    );
  }

  return (
    <List
      data={recordsQuery.data}

      ItemSeparatorComponent={() =>
        <Divider
          style={[
            styles.divider,
            { backgroundColor: theme['color-basic-400'] },
          ]}
        />
      }

      renderItem={({ item }) => <MonthRecord record={item} />}
    />
  );
}

export default function Records(): ReactNode {
  const router = useRouter();

  function openNewRecord(): void {
    router.push({
      pathname: '/records/new',
      params: { type: RecordType.EXPENSE },
    });
  }

  return (
    <TabScreenLayout
      title="Records"

      headerRight={() =>
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
        />
      }
    >
      <MonthRecords />
    </TabScreenLayout>
  )
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,

  divider: {
    marginLeft: 8,
    marginRight: 12,
  } satisfies ViewStyle,
});

