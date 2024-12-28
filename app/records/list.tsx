import { type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/layout';
import { MonthIdx, MonthRecords, MonthSlider } from '@/recordsList';
import { Button, Divider, Text, useTheme } from '@ui-kitten/components';
import { RecordType } from '@/db';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface IAddRecordButton {
  type: RecordType;
  monthIdx: MonthIdx;
}

function AddRecordButton(props: IAddRecordButton): ReactNode {
  const router = useRouter();
  const status = props.type === RecordType.INCOME ? 'success' : 'danger';

  function openLink(): void {
    router.push({
      pathname: '/records/new',
      params: {
        type: props.type,
        initialYear: props.monthIdx.year,
        initialMonth: props.monthIdx.month,
      },
    });
  }

  return (
    <Button status={status} size="small" onPress={openLink}>
      {txtProps => <Text {...txtProps}>Add {props.type}</Text>}
    </Button>
  );
}

export default function List(): ReactNode {
  const theme = useTheme();
  const [selectedIdx, setSelectedIdx] = useState<MonthIdx>(() => MonthIdx.current());
  const title = useMemo(() => selectedIdx.title, [selectedIdx.id]);

  return (
    <MainScreenLayout title={title}>
      <View style={styles.column}>
        <View style={[styles.addRow, { backgroundColor: theme['background-basic-color-1'] }]}>
          <AddRecordButton monthIdx={selectedIdx} type={RecordType.INCOME} />
          <AddRecordButton monthIdx={selectedIdx} type={RecordType.EXPENSE} />
        </View>

        <Divider />

        <MonthSlider
          style={styles.slider}
          active={selectedIdx}
          onChange={setSelectedIdx}
        >
          {(idx) => <MonthRecords idx={idx} />}
        </MonthSlider>
      </View>
    </MainScreenLayout>
  )
}

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  } satisfies ViewStyle,

  addRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    gap: 8,
  } satisfies ViewStyle,

  slider: {
    flexGrow: 1,
  } satisfies ViewStyle,
});
