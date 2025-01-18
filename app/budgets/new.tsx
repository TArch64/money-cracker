import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { array, boolean, type InferOutput, minValue, number, object, pipe } from 'valibot';
import { Button, Card, Text } from '@ui-kitten/components';
import { useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { FormArray, FormNumericInput, type FormSubmitHandler, useFormCheckable } from '@/components/form';
import type { Category } from '@/db';
import { showAlert } from '@/helpers/showAlert';

const schemaCategory = object({
  id: number(),
  added: boolean(),
  goal: pipe(number(), minValue(0, 'Goal cannot be negative')),
});

const schema = object({
  categories: array(schemaCategory),
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

  const onSubmit: FormSubmitHandler<FormSchema> = (event) => {
    const addedCategories = event.value.categories.filter((category) => category.added);

    if (!addedCategories.length) {
      return showAlert({
        title: 'Error',
        message: 'Please select at least one category',
      });
    }
  };

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

      onSubmit={onSubmit}
    >
      {({ f }) => (
        <ScrollView contentContainerStyle={styles.list}>
          <Text category="p1">
            Select Categories
          </Text>

          <FormArray<FormCategory> name={f('categories')}>
            {({ item, itemName }) => (
              <BudgetCategory
                key={item.id}
                category={categoryIdMap[item.id]}
                formPath={itemName}
                formCategory={item}
              />
            )}
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
