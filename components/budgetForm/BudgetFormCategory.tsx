import { Card, type Input, Text } from '@ui-kitten/components';
import { type ReactNode, useEffect, useRef } from 'react';
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
  const isInitial = useRef(true);
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (!isAdded || isInitial.current) {
      isInitial.current = false;
      return;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, [isAdded]);

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
            ref={inputRef}
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
