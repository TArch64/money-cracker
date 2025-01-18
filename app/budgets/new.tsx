import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { array, boolean, check, type InferOutput, minValue, number, object, pipe } from 'valibot';
import { Button, Card, Text } from '@ui-kitten/components';
import { useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { FormArray, FormNumericInput, useFormCheckable } from '@/components/form';
import type { Category } from '@/db';

const schemaCategory = object({
  id: number(),
  added: boolean(),
  goal: pipe(number(), minValue(0, 'Goal cannot be negative')),
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
  formCategory: FormCategory;
  formPath: string;
  category: Category;
}

function BudgetCategory(props: IBudgetCategoryProps): ReactNode {
  const [isAdded, setAdded] = useFormCheckable(`${props.formPath}.added`);

  return (
    <Card
      status={isAdded ? 'primary' : 'basic'}
      onPress={() => setAdded(!isAdded)}
    >
      <View style={styles.cardInner}>
        <Text category="s2">
          {props.category.name}
        </Text>

        {isAdded && (
          <FormNumericInput
            style={styles.cardGoal}
            name={`${props.formPath}.goal`}
            placeholder="Spending Goal"
          />
        )}
      </View>
    </Card>
  );
}

export default function New(): ReactNode {
  const categoriesQuery = useCategoriesListSuspenseQuery({
    type: RecordType.EXPENSE,
  });

  const categoryIdMap = useMemo(() => Object.fromEntries(
    categoriesQuery.data.map((category) => [category.id, category]),
  ), [categoriesQuery.data]);

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

      onSubmit={(event) => {
        console.log(JSON.stringify(event.value, null, 2));
      }}
    >
      {({ f }) => (
        <ScrollView contentContainerStyle={styles.list}>
          <Text category="p1">
            Select Categories
          </Text>

          <FormArray<FormCategory> name={f('categories')}>
            {(categories) => categories.map((formCategory, index) => (
              <BudgetCategory
                key={formCategory.id}
                category={categoryIdMap[formCategory.id]}
                formPath={`categories[${index}]`}
                formCategory={formCategory}
              />
            ))}
          </FormArray>
        </ScrollView>
      )}
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  } satisfies ViewStyle,

  cardInner: {
    marginVertical: -6,
    marginHorizontal: -10,
  } satisfies ViewStyle,

  cardGoal: {
    marginTop: 12,
  } satisfies TextStyle,
});
