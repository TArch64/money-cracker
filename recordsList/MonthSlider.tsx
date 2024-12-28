import type { IPropsWithChildrenFn, IPropsWithStyle } from '@/types';
import { type ReactElement, type ReactNode, Suspense, useMemo } from 'react';
import { MonthIdx } from './MonthIdx';
import { useRecordsBoundariesQuery } from '@/queries';
import { useWindowDimensions, View, type ViewStyle, VirtualizedList } from 'react-native';

export interface IMonthSliderProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement>,
  IPropsWithStyle<ViewStyle> {
  active: MonthIdx;
  onChange: (idx: MonthIdx) => void;
}

export function MonthSlider(props: IMonthSliderProps): ReactNode {
  const { width } = useWindowDimensions();
  const boundariesQuery = useRecordsBoundariesQuery();
  const { min: minDate, max: maxDate } = boundariesQuery.data;

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
      style={props.style}
      initialNumToRender={3}
      initialScrollIndex={initialScrollIndex}
      maxToRenderPerBatch={2}
      getItemCount={() => count}
      keyExtractor={(idx) => idx.id}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews
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

      CellRendererComponent={({ style, children, onLayout, index }) => (
        <View style={[style, { width }]} onLayout={onLayout}>
          {/* use global suspense for initial slide but it by other screens */}
          {index === initialScrollIndex ? children : <Suspense>{children}</Suspense>}
        </View>
      )}

      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems.length > 1) {
          return;
        }

        props.onChange(viewableItems[0].item);
      }}
    />
  );
}
