import { RecordType } from '@/enums';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { useCategoriesListWithUsageQuery } from '@/hooks/queries';
import { CategoryListItem } from './CategoryListItem';
import { useTranslation } from 'react-i18next';

function ListEmpty(): ReactNode {
  const { t } = useTranslation();

  return (
    <View style={styles.listEmpty}>
      <Text>
        {t('categories.index.empty')}
      </Text>
    </View>
  );
}

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
