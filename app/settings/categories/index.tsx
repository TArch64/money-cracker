import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { useCategoriesListQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { List, ListItem, Text, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import type { Category } from '@/db';
import { showActionSheet } from '@/helpers/showActionSheet';

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

  function showActions(category: Category) {
    showActionSheet([
      {
        text: 'Rename',
        onPress: () => 0,
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => 0,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  return (
    <List
      removeClippedSubviews
      data={categoriesQuery.data}

      style={[
        { backgroundColor: theme['background-basic-color-1'] },
      ] satisfies StyleProp<ViewStyle>}

      renderItem={({ item }) => (
        <ListItem
          title={item.name}
          style={styles.listItem}
          onPress={() => showActions(item)}
        />
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

export default function Index(): ReactNode {
  return (
    <FullScreenLayout title="Categories">
      <CategoriesList />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    marginVertical: 16,
    marginHorizontal: 24,
  } satisfies ViewStyle,

  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  listItem: {
    marginHorizontal: 12,
    borderRadius: 4,
  } satisfies ViewStyle,
});
