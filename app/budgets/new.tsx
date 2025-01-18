import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { array, boolean, type InferOutput, minValue, number, object, pipe } from 'valibot';
import { Button, Card, Text } from '@ui-kitten/components';
import { useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { FormArray, FormNumericInput, type FormSubmitHandler, useFormCheckable } from '@/components/form';
import type { Category } from '@/db';
import { showAlert } from '@/helpers/showAlert';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useRefLayout } from '@/hooks/useRefLayout';

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

const CARD_PADDING = 26;
const AnimatedCard = Animated.createAnimatedComponent(Card);

function BudgetCategory(props: IBudgetCategoryProps): ReactNode {
  const [isAdded, setAdded] = useFormCheckable(`${props.formPath}.added`);
  const [headerRef, headerLayout] = useRefLayout();
  const [goalRef, goalLayout] = useRefLayout();
  const cardHeight = useSharedValue(0);
  const isInitial = useRef(true);

  useEffect(() => {
    if (headerLayout) {
      cardHeight.value = headerLayout.height + CARD_PADDING;
    }
  }, [headerLayout]);

  useEffect(() => {
    if (!isInitial.current) {
      const baseHeight = headerLayout!.height + CARD_PADDING;
      const height = goalLayout ? baseHeight + goalLayout!.height : baseHeight;
      cardHeight.value = withSpring(height, { duration: 500, dampingRatio: 0.9 });
    }

    isInitial.current = false;
  }, [goalLayout]);

  const animatedCardStyle = useAnimatedStyle(() => !headerLayout ? {} : {
    height: cardHeight.value,
  });

  return (
    <AnimatedCard
      status={isAdded ? 'primary' : 'basic'}
      style={animatedCardStyle}
      onPress={() => setAdded(!isAdded)}
    >
      <Animated.View style={styles.cardInner}>
        <View ref={headerRef}>
          <Text category="s2">
            {props.category.name}
          </Text>
        </View>

        {isAdded && (
          <View ref={goalRef}>
            <FormNumericInput
              name={`${props.formPath}.goal`}
              style={styles.cardGoal}
              placeholder="Spending Goal"
            />
          </View>
        )}
      </Animated.View>
    </AnimatedCard>
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
