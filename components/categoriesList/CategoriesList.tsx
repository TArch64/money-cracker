import { RecordType } from '@/enums';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { useCategoriesListWithUsageQuery } from '@/hooks/queries';
import { CategoryListItem } from './CategoryListItem';

const ListEmpty = (): ReactNode => (
  <View style={styles.listEmpty}>
    <Text>
      There is no categories of this type yet
    </Text>
  </View>
);

interface ICategoriesListProps {
  type: RecordType;
  header: ReactElement;
}

export function CategoriesList(props: ICategoriesListProps): ReactNode {
  const categoriesQuery = useCategoriesListWithUsageQuery(props.type);

  return (
    <List
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
      data={categoriesQuery.data}
      renderItem={({ item }) => <CategoryListItem category={item} />}
      ListHeaderComponent={props.header}
      ListEmptyComponent={categoriesQuery.isLoading ? undefined : ListEmpty}
    />
  );
}

const styles = StyleSheet.create({
  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
});
