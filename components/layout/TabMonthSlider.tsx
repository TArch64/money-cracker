import type { IPropsWithChildrenFn, IPropsWithStyle } from '@/types';
import { forwardRef, type ReactElement, Suspense, useImperativeHandle, useMemo, useRef } from 'react';
import { MonthIdx, useMonthStore } from '@/stores';
import { useRecordsBoundariesQuery } from '@/hooks/queries';
import { useWindowDimensions, View, type ViewStyle, VirtualizedList } from 'react-native';
import { useDebounced } from '@/hooks/useDebounced';

export interface ITabMonthSliderProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement>,
  IPropsWithStyle<ViewStyle> {
  onChange: () => void;
}

export interface ITabMonthSliderRef {
  scrollToIdx: (idx: MonthIdx) => void;
}

export const TabMonthSlider = forwardRef<ITabMonthSliderRef, ITabMonthSliderProps>((props, ref) => {
  const { width } = useWindowDimensions();
  const { min: minDate, max: maxDate } = useRecordsBoundariesQuery().data;
  const activateIdx = useMonthStore((state) => state.activateIdx);

  const count = useMemo(() => {
    const fullMonthCount = (maxDate.getFullYear() - minDate.getFullYear()) * 12;
    return fullMonthCount + maxDate.getMonth() - minDate.getMonth() + 1;
  }, [+minDate, +maxDate]);

  function dateToIndex(date: Date): number {
    const fullMonthCount = (date.getFullYear() - minDate.getFullYear()) * 12;
    return fullMonthCount + date.getMonth() - minDate.getMonth();
  }

  const initialScrollIndex = useMemo(() => {
    if (+minDate === +maxDate) {
      return 0;
    }

    return dateToIndex(new Date());
  }, []);

  const listRef = useRef<VirtualizedList<MonthIdx>>(null);

  useImperativeHandle(ref, () => ({
    scrollToIdx: (idx) => {
      listRef.current?.scrollToIndex({ index: dateToIndex(idx.date) });
    },
  }));

  const onViewableItemsChanged = useDebounced(({ viewableItems }) => {
    if (viewableItems.length > 1) {
      return;
    }

    activateIdx(viewableItems[0].item);
    props.onChange();
  }, 50, []);

  return (
    <VirtualizedList<MonthIdx>
      horizontal
      pagingEnabled
      removeClippedSubviews
      ref={listRef}
      style={props.style}
      initialScrollIndex={initialScrollIndex}
      initialNumToRender={3}
      maxToRenderPerBatch={1}
      getItemCount={() => count}
      keyExtractor={(idx) => idx.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => props.children(item)}

      getItem={(_, idx) => {
        const year = minDate.getFullYear() + Math.floor((minDate.getMonth() + idx) / 12);
        const month = (minDate.getMonth() + idx) % 12;
        return new MonthIdx(year, month);
      }}

      getItemLayout={(_, idx) => ({
        index: idx,
        length: width,
        offset: width * idx,
      })}

      CellRendererComponent={({ style, children, onLayout }) => (
        <View style={[style, { width }]} onLayout={onLayout}>
          <Suspense>{children}</Suspense>
        </View>
      )}

      onViewableItemsChanged={onViewableItemsChanged}

      viewabilityConfig={{
        waitForInteraction: true,
        itemVisiblePercentThreshold: 50,
      }}
    />
  );
});
