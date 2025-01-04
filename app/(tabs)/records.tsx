import { type ReactNode, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/components/layout';
import { MonthIdx, MonthRecords, MonthSlider } from '@/components/recordsList';
import { Text, TopNavigationAction } from '@ui-kitten/components';
import { RecordType } from '@/enums';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Records(): ReactNode {
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

  function openRecordStatistics(): void {
    router.push({
      pathname: '/records/statistics',
      params: {
        year: selectedIdx.year,
        month: selectedIdx.month,
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

      headerLeft={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PIE_CHART_OUTLINE)}
          onPress={openRecordStatistics}
        />
      )}

      headerRight={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
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
