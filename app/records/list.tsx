import { type ReactNode, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/layout';
import { MonthIdx, MonthRecords, MonthSlider } from '@/recordsList';
import { Icon, Text, TopNavigationAction } from '@ui-kitten/components';
import { RecordType } from '@/db';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/formatters';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function List(): ReactNode {
  const router = useRouter();
  const isInitialIdx = useRef(true);
  const [selectedIdx, setSelectedIdx] = useState<MonthIdx>(() => MonthIdx.current());
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const title = dateFormatter.format(selectedIdx.date);

  function changeIdx(idx: MonthIdx) {
    isInitialIdx.current = false;
    setSelectedIdx(idx);
  }

  function openNewRecord(): void {
    router.push({
      pathname: '/records/new',
      params: {
        type: RecordType.EXPENSE,
        initialYear: selectedIdx.year,
        initialMonth: selectedIdx.month,
      },
    });
  }

  return (
    <MainScreenLayout
      title={(txtProps) => (
        <AnimatedText
          {...txtProps}
          key={title}
          entering={isInitialIdx.current ? undefined : FadeInLeft.duration(200).delay(100)}
          exiting={FadeOutRight.duration(200)}
        >
          {title}
        </AnimatedText>
      )}

      headerRight={() => (
        <TopNavigationAction
          onPress={openNewRecord}
          icon={(iconProps) => (
            <Icon
              {...iconProps}
              name="plus"
            />
          )}
        />
      )}
    >
      <MonthSlider
        style={styles.slider}
        active={selectedIdx}
        onChange={changeIdx}
      >
        {(idx) => <MonthRecords idx={idx} />}
      </MonthSlider>
    </MainScreenLayout>
  )
}

const styles = StyleSheet.create({
  slider: {
    height: '100%',
  } satisfies ViewStyle,
});
