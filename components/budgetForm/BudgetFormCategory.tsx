import { Card, Text } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/db';
import { AnimatedHeight } from '../AnimatedHeight';
import { FormNumericInput, useFormCheckable } from '../form';
import type { FormBudgetCategory } from './schema';

export interface IBudgetFormCategoryProps {
  formCategory: FormBudgetCategory;
  formPath: string;
  category: Category;
}

export function BudgetFormCategory(props: IBudgetFormCategoryProps): ReactNode {
  const { t } = useTranslation();
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
            autoFocus
            name={`${props.formPath}.goal`}
            style={styles.cardGoal}
            placeholder={t('budgets.form.labels.spendingGoal')}
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
