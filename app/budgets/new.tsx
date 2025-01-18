import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { array, boolean, check, type InferOutput, minValue, number, object, pipe } from 'valibot';
import { Button, Card, List, Text, useTheme } from '@ui-kitten/components';
import { useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import type { Category } from '@/db';
import { type FormPathGet, useFormCheckable } from '@/components/form';

const schemaCategory = object({
  id: number(),
  added: boolean(),
  goal: pipe(number(), minValue(1, 'This field is required')),
});

const schema = object({
  categories: pipe(
    array(schemaCategory),
    check((categories) => categories.some(category => category.added), 'You must add at least one category'),
  ),
});

type FormSchema = typeof schema;
type FormCategorySchema = typeof schemaCategory;
type FormCategory = InferOutput<FormCategorySchema>;

interface IBudgetCategoryProps {
  f: FormPathGet<FormSchema>;
  index: number;
  category: Category;
}

function BudgetCategory(props: IBudgetCategoryProps): ReactNode {
  const [isAdded, setAdded] = useFormCheckable(props.f(`categories[${props.index}].added`));

  return (
    <Card
      status={isAdded ? 'primary' : 'basic'}
      onPress={() => setAdded(!isAdded)}
    >
      <View style={styles.cardInner}>
        <Text category="s2">
          {props.category.name}
        </Text>
      </View>
    </Card>
  );
}

export default function New(): ReactNode {
  const theme = useTheme();

  const categoriesQuery = useCategoriesListSuspenseQuery({
    type: RecordType.EXPENSE,
  });

  const initialCategories = useMemo(() => (
    categoriesQuery.data.map((category): FormCategory => ({
      id: category.id,
      added: false,
      goal: 0,
    }))
  ), [categoriesQuery.data]);

  return (
    <FormScreenLayout
      fullScreen
      schema={schema}
      title="New Budget"
      initialValues={{ categories: initialCategories }}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Add Budget</Text>}
        </Button>
      )}

      onSubmit={() => {
      }}
    >
      {({ f }) => (
        <>
          <Text category="p1">
            Select Categories
          </Text>

          <List
            data={categoriesQuery.data}
            contentContainerStyle={styles.list}

            style={{
              backgroundColor: theme['background-basic-color-1'],
            } satisfies StyleProp<ViewStyle>}

            renderItem={({ item, index }) => (
              <BudgetCategory
                category={item}
                index={index}
                f={f}
              />
            )}
          />
        </>
      )}
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  } satisfies ViewStyle,

  cardInner: {
    marginVertical: -8,
    marginHorizontal: -12,
  } satisfies ViewStyle,
});
