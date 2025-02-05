import type { FormBudgetCategory } from './schema';
import type { Category } from '@/db';
import { Card, Text } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { FormNumericInput, useFormCheckable } from '../form';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { AnimatedHeight } from '../AnimatedHeight';

export interface IBudgetFormCategoryProps {
  formCategory: FormBudgetCategory;
  formPath: string;
  category: Category;
}

export function BudgetFormCategory(props: IBudgetFormCategoryProps): ReactNode {
  const [isAdded, setAdded] = useFormCheckable(`${props.formPath}.added`);

  return (
    <Card
      status={isAdded ? 'primary' : 'basic'}
      onPress={() => setAdded(!isAdded)}
    >
      <AnimatedHeight style={styles.cardInner}>
        <Text category="s2">
          {props.category.name}
        </Text>

        {isAdded && (
          <FormNumericInput
            name={`${props.formPath}.goal`}
            style={styles.cardGoal}
            placeholder="Spending Goal"
          />
        )}
      </AnimatedHeight>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardInner: {
    marginTop: 10,
    marginBottom: 12,
    marginHorizontal: 12,
  } satisfies ViewStyle,

  cardGoal: {
    marginTop: 12,
  } satisfies TextStyle,
});
