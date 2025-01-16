import type { ReactNode } from 'react';
import { useMonthStore } from '@/stores';
import { FormScreenLayout } from '@/components/layout';
import { object } from 'valibot';
import { Button, Text } from '@ui-kitten/components';

const schema = object({});

type Schema = typeof schema;

export default function New(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);

  return (
    <FormScreenLayout
      fullScreen
      schema={schema}
      title="New Budget"
      onSubmit={() => {
      }}

      initialValues={{}}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Add Budget</Text>}
        </Button>
      )}
    >
      {({ f }) => (
        <>
        </>
      )}
    </FormScreenLayout>
  );
}
