import type { IPropsWithChildrenFn, IPropsWithStyle } from '@/types';
import { type ReactElement, type ReactNode, Suspense, useMemo } from 'react';
import { MonthIdx, useMonthStore } from '@/stores';
import { useRecordsBoundariesQuery } from '@/hooks/queries';
import { useWindowDimensions, View, type ViewStyle, VirtualizedList } from 'react-native';

export interface IMonthSliderProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement>,
  IPropsWithStyle<ViewStyle> {
  onChange: () => void;
}

export function MonthSlider(props: IMonthSliderProps): ReactNode {
  const { width } = useWindowDimensions();
  const { min: minDate, max: maxDate } = useRecordsBoundariesQuery().data;
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const activateIdx = useMonthStore((state) => state.activateIdx);

  const count = useMemo(() => {
    const fullMonthCount = (maxDate.getFullYear() - minDate.getFullYear()) * 12;
    return fullMonthCount + maxDate.getMonth() - minDate.getMonth() + 1;
  }, [+minDate, +maxDate]);

  const initialScrollIndex = useMemo(() => {
    if (+minDate === +maxDate) {
      return 0;
    }

    return (activeIdx.year - minDate.getFullYear()) * 12 + activeIdx.month - minDate.getMonth();
  }, [activeIdx.id, +minDate]);

  return (
    <VirtualizedList<MonthIdx>
      horizontal
      pagingEnabled
      removeClippedSubviews
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

      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems.length > 1) {
          return;
        }

        activateIdx(viewableItems[0].item);
        props.onChange();
      }}

      viewabilityConfig={{
        waitForInteraction: true,
        itemVisiblePercentThreshold: 50,
      }}
    />
  );
}
