import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { checkAsync, minLength, objectAsync, pipeAsync, string, trim } from 'valibot';
import { FormInput, type FormSubmitHandler } from '@/components/form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRecordTypeTitle, RecordType } from '@/enums';
import { useCategoryCheckUniqueness, useCategoryCreateMutation } from '@/hooks/queries';

export default function New(): ReactNode {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ type: RecordType }>();
  const typeTitle = getRecordTypeTitle(searchParams.type);
  const createMutation = useCategoryCreateMutation();
  const checkUniqueness = useCategoryCheckUniqueness();

  const schema = useMemo(() => objectAsync({
    name: pipeAsync(
      string(),
      trim(),
      minLength(3, 'Name must be at least 3 characters long'),

      checkAsync(async (name) => {
        const { isUnique } = await checkUniqueness.mutateAsync({ name });
        return isUnique;
      }, 'Category with this name already exists'),
    ),
  }), []);

  const onSubmit: FormSubmitHandler<typeof schema> = async (event) => {
    await createMutation.mutateAsync({
      type: searchParams.type,
      name: event.value.name,
    });

    router.back();
  };

  return (
    <FormScreenLayout
      fullScreen
      title={`New ${typeTitle} Category`}
      schema={schema}
      initialValues={{ name: '' }}
      submit="Add Category"
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
