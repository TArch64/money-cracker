import type { IPropsWithChildrenFn } from '@/types';
import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import type { MonthIndex } from './MonthIndex';
import { useRecordsBoundariesQuery } from '@/queries';
import { StyleSheet, View, type ViewStyle } from 'react-native';

function MonthSliderItem(props: PropsWithChildren): ReactNode {
  return (
    <View style={styles.slide}>
      {props.children}
    </View>
  );
}

export interface IMonthSliderProps extends IPropsWithChildrenFn<[idx: MonthIndex]> {
  active: MonthIndex;
  onChange: (idx: MonthIndex) => void;
}

export function MonthSlider(props: IMonthSliderProps): ReactNode {
  const boundariesQuery = useRecordsBoundariesQuery();

  const previousIdx = useMemo(() => {
    const idx = props.active.previous;
    return idx;
    // return idx.isBeforeDate(boundariesQuery.data!.min) ? null : idx;
  }, props.active.reactDeps);

  const nextIdx = useMemo(() => {
    const idx = props.active.next;
    return idx;
    // return idx.isAfterDate(boundariesQuery.data!.max) ? null : idx;
  }, props.active.reactDeps);

  return (
    <View style={styles.row}>
      {previousIdx && (
        <MonthSliderItem>
          {props.children(previousIdx)}
        </MonthSliderItem>
      )}

      <MonthSliderItem>
        {props.children(props.active)}
      </MonthSliderItem>

      {nextIdx && (
        <MonthSliderItem>
          {props.children(nextIdx)}
        </MonthSliderItem>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    overflowX: 'hidden',
    height: '100%',
  } satisfies ViewStyle,

  slide: {
    width: '100%',
  } satisfies ViewStyle,
});
