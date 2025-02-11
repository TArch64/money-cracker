import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { checkAsync, minLength, objectAsync, pipeAsync, string, trim } from 'valibot';
import { FormInput, type FormSubmitHandler } from '@/components/form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecordType } from '@/enums';
import { useCategoryCheckUniqueness, useCategoryCreateMutation } from '@/hooks/queries';
import { useTranslation } from 'react-i18next';

export default function New(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ type: RecordType }>();
  const createMutation = useCategoryCreateMutation();
  const checkUniqueness = useCategoryCheckUniqueness();

  const schema = useMemo(() => objectAsync({
    name: pipeAsync(
      string(),
      trim(),
      minLength(3, t('form.errors.minLength', { length: 3 })),

      checkAsync(async (name) => {
        const { isUnique } = await checkUniqueness.mutateAsync({ name });
        return isUnique;
      }, t('categories.form.errors.uniqueName')),
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
      title={t(`categories.new.title.${searchParams.type}`)}
      schema={schema}
      initialValues={{ name: '' }}
      submit={t('categories.new.add')}
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
