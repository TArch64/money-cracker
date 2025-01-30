import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { checkAsync, minLength, objectAsync, pipeAsync, string, trim } from 'valibot';
import { Button, Text } from '@ui-kitten/components';
import { FormInput, type FormSubmitHandler } from '@/components/form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoryCheckUniqueness, useCategoryDetailsSuspenseQuery } from '@/hooks/queries';

export default function Edit(): ReactNode {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ categoryId: string }>();
  const categoryQuery = useCategoryDetailsSuspenseQuery(+searchParams.categoryId);
  const checkUniqueness = useCategoryCheckUniqueness();

  const schema = useMemo(() => objectAsync({
    name: pipeAsync(
      string(),
      trim(),
      minLength(3, 'Name must be at least 3 characters long'),

      checkAsync(async (name) => {
        const { isUnique } = await checkUniqueness.mutateAsync({
          name,
          excludeId: categoryQuery.data.id,
        });

        return isUnique;
      }, 'Category with this name already exists'),
    ),
  }), []);

  const onSubmit: FormSubmitHandler<typeof schema> = async (event) => {
    // await createMutation.mutateAsync({
    //   type: searchParams.type,
    //   name: event.value.name,
    // });

    router.back();
  };

  return (
    <FormScreenLayout
      fullScreen
      title={`Edit ${categoryQuery.data.name}`}
      schema={schema}
      initialValues={{ name: categoryQuery.data.name }}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Add Category</Text>}
        </Button>
      )}

      onSubmit={onSubmit}
    >
      {({ f }) => (
        <FormInput
          name={f('name')}
          label="Name"
          placeholder="Category Name"
        />
      )}
    </FormScreenLayout>
  );
}
