import { type ReactNode, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/layout';
import { MonthIdx, MonthRecords, MonthSlider } from '@/recordsList';
import { Button, Text } from '@ui-kitten/components';
import { RecordType } from '@/db';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';

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

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function List(): ReactNode {
  const previousIdx = useRef<MonthIdx>();
  const [selectedIdx, setSelectedIdx] = useState<MonthIdx>(() => MonthIdx.current());
  const title = useMemo(() => selectedIdx.title, [selectedIdx.id]);

  const isSwipedToLeft = useMemo(() => {
    if (!previousIdx.current) return false;
    return previousIdx.current.position > selectedIdx.position;
  }, [selectedIdx.id]);

  function changeIdx(idx: MonthIdx) {
    previousIdx.current = selectedIdx;
    setSelectedIdx(idx);
  }

  return (
    <MainScreenLayout
      title={(txtProps) => (
        <AnimatedText
          {...txtProps}
          key={title}
          entering={(isSwipedToLeft ? FadeInRight : FadeInLeft).duration(200).delay(100)}
          exiting={(isSwipedToLeft ? FadeOutLeft : FadeOutRight).duration(200)}
        >
          {title}
        </AnimatedText>
      )}
    >
      <View style={styles.column}>
        <View style={[styles.addRow]}>
          <AddRecordButton monthIdx={selectedIdx} type={RecordType.INCOME} />
          <AddRecordButton monthIdx={selectedIdx} type={RecordType.EXPENSE} />
        </View>

        <MonthSlider
          style={styles.slider}
          active={selectedIdx}
          onChange={changeIdx}
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
