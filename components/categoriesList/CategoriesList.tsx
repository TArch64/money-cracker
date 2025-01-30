import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { RecordType } from '@/enums';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { List, Text, useTheme } from '@ui-kitten/components';
import { useCategoriesListWithUsageQuery } from '@/hooks/queries';
import { CategoryListItem } from './CategoryListItem';

const recordTypeOptions: IButtonSelectOption<RecordType>[] = [
  {
    value: RecordType.EXPENSE,
    label: 'Expense',
  },
  {
    value: RecordType.INCOME,
    label: 'Income',
  },
];

const ListEmpty = (): ReactNode => (
  <View style={styles.listEmpty}>
    <Text>
      There is no categories of this type yet
    </Text>
  </View>
);

interface ICategoriesListProps {
  type: RecordType;
  onTypeChange: (type: RecordType) => void;
}

export function CategoriesList(props: ICategoriesListProps): ReactNode {
  const theme = useTheme();
  const categoriesQuery = useCategoriesListWithUsageQuery(props.type);

  return (
    <List
      removeClippedSubviews
      data={categoriesQuery.data}

      style={[
        { backgroundColor: theme['background-basic-color-1'] },
      ] satisfies StyleProp<ViewStyle>}

      renderItem={({ item }) => <CategoryListItem category={item} />}

      ListHeaderComponent={
        <ButtonSelect
          value={props.type}
          onChange={props.onTypeChange}
          options={recordTypeOptions}
          style={styles.typeSelector}
        />
      }

      ListEmptyComponent={ListEmpty}
    />
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    marginVertical: 16,
    marginHorizontal: 16,
  } satisfies ViewStyle,

  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
});
