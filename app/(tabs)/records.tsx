import { type ReactNode, useRef } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/components/layout';
import { MonthRecords, MonthSlider } from '@/components/recordsList';
import { Text, TopNavigationAction } from '@ui-kitten/components';
import { RecordType } from '@/enums';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';
import { useMonthStore } from '@/stores';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Records(): ReactNode {
  const router = useRouter();
  const isInitialIdx = useRef(true);
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const title = dateFormatter.format(activeIdx.date);

  function onActiveMonthChange() {
    isInitialIdx.current = false;
  }

  function openNewRecord(): void {
    router.push({
      pathname: '/records/new',
      params: { type: RecordType.EXPENSE },
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
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
        />
      )}
    >
      <MonthSlider style={styles.slider} onChange={onActiveMonthChange}>
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
