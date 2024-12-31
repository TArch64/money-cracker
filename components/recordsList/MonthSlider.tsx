import type { IPropsWithChildrenFn, IPropsWithStyle } from '@/types';
import { type ReactElement, type ReactNode, Suspense, useMemo } from 'react';
import { MonthIdx } from './MonthIdx';
import { useRecordsBoundariesQuery } from '@/hooks/queries';
import { useWindowDimensions, View, type ViewStyle, VirtualizedList } from 'react-native';

export interface IMonthSliderProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement>,
  IPropsWithStyle<ViewStyle> {
  active: MonthIdx;
  onChange: (idx: MonthIdx) => void;
}

export function MonthSlider(props: IMonthSliderProps): ReactNode {
  const { width } = useWindowDimensions();
  const { min: minDate, max: maxDate } = useRecordsBoundariesQuery().data;

  const count = useMemo(() => {
    const fullMonthCount = (maxDate.getFullYear() - minDate.getFullYear()) * 12;
    return fullMonthCount + maxDate.getMonth() - minDate.getMonth() + 1;
  }, [+minDate, +maxDate]);

  const initialScrollIndex = useMemo(() => {
    return (props.active.year - minDate.getFullYear()) * 12 + props.active.month - minDate.getMonth();
  }, [props.active, +minDate]);

  return (
    <VirtualizedList<MonthIdx>
      horizontal
      pagingEnabled
      removeClippedSubviews
      style={props.style}
      initialScrollIndex={initialScrollIndex}
      initialNumToRender={3}
      maxToRenderPerBatch={2}
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

      onViewableItemsChanged={({ viewableItems, changed }) => {
        if (viewableItems.length > 1) {
          return;
        }

        props.onChange(viewableItems[0].item);
      }}

      viewabilityConfig={{
        waitForInteraction: true,
        itemVisiblePercentThreshold: 50,
      }}
    />
  );
}
