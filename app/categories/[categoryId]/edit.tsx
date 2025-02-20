import { type ReactNode, useMemo } from 'react';
import { minLength, objectAsync, pipeAsync, string, trim } from 'valibot';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { FormInput, type FormSubmitHandler } from '@/components/form';
import { useCategoryDetailsSuspenseQuery, useCategoryUpdateMutation } from '@/hooks/queries';
import { useCategoryNameUniquenessCheck } from '@/hooks/categories';

export default function Edit(): ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useLocalSearchParams<{ categoryId: string }>();
  const categoryQuery = useCategoryDetailsSuspenseQuery(+searchParams.categoryId);
  const updateMutation = useCategoryUpdateMutation(categoryQuery.data);
  const nameUniquenessCheck = useCategoryNameUniquenessCheck({ excludeId: categoryQuery.data.id });

  const schema = useMemo(() => objectAsync({
    name: pipeAsync(
      string(),
      trim(),
      minLength(3),
      nameUniquenessCheck,
    ),
  }), []);

  const onSubmit: FormSubmitHandler<typeof schema> = async (event) => {
    await updateMutation.mutateAsync({ name: event.value.name });
    router.back();
  };

  return (
    <FormScreenLayout
      title={t('categories.edit.title', { name: categoryQuery.data.name })}
      schema={schema}
      initialValues={{ name: categoryQuery.data.name }}
      submit={t('categories.edit.save')}
      onSubmit={onSubmit}
    >
      {({ f }) => (
        <FormInput
          name={f('name')}
          label={t('categories.form.labels.name')}
          placeholder={t('categories.form.labels.name')}
        />
      )}
    </FormScreenLayout>
  );
}
