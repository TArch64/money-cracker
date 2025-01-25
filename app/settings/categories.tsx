import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { useCategoriesListQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { List, ListItem, Text, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

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

function CategoriesList(): ReactNode {
  const theme = useTheme();
  const [type, setType] = useState(RecordType.EXPENSE);
  const categoriesQuery = useCategoriesListQuery({ type });

  return (
    <List
      removeClippedSubviews
      data={categoriesQuery.data}

      style={[
        styles.list,
        { backgroundColor: theme['background-basic-color-1'] },
      ] satisfies StyleProp<ViewStyle>}

      renderItem={({ item }) => (
        <ListItem title={item.name} />
      )}

      ListHeaderComponent={
        <ButtonSelect
          value={type}
          onChange={setType}
          options={recordTypeOptions}
          style={styles.typeSelector}
        />
      }

      ListEmptyComponent={ListEmpty}
    />
  );
}

export default function Categories(): ReactNode {
  return (
    <FullScreenLayout title="Categories">
      <CategoriesList />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    marginBottom: 16,
  } satisfies ViewStyle,

  list: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  } satisfies ViewStyle,

  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
});
