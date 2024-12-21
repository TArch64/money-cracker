import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/layout';
import { Text } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { RecordType } from '@/db';
import { Form, FormNumericInput } from '@/form';
import { minValue, number, object, pipe, string } from 'valibot';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';

const schema = object({
  category: string(),
  value: pipe(number(), minValue(1)),
});

export default function New(): ReactNode {
  const { type } = useLocalSearchParams<{ type: RecordType }>();
  const isIncome = type === RecordType.INCOME;

  return (
    <FullScreenLayout style={styles.root}>
      <Text category="h1" style={styles.heading}>
        New {isIncome ? 'Income' : 'Expense'}
      </Text>

      <Form
        schema={schema}
        initialValues={{
          category: '',
          value: 0,
        }}
      >
        {({ f }) => (
          <View>
            <FormNumericInput
              name={f('value')}
              label={isIncome ? 'Money received' : 'Money spent'}
              placeholder={isIncome ? 'Money received' : 'Money spent'}
            />
          </View>
        )}
      </Form>
    </FullScreenLayout>
  )
}

const styles = StyleSheet.create({
  root: {
    // display: 'flex',
    // flexDirection: 'column',
    // gap: 16,
    padding: 24,
  } satisfies ViewStyle,

  heading: {
    marginBottom: 20,
  } satisfies TextStyle,
});
