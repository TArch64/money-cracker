import { type ReactNode, useMemo } from 'react';
import { minLength, objectAsync, pipeAsync, string, trim } from 'valibot';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { type FormEventHandler, FormInput } from '@/components/form';
import { RecordType } from '@/enums';
import { useCategoryCreateMutation } from '@/hooks/queries';
import { useCategoryNameUniquenessCheck } from '@/hooks/categories';

export default function New(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ type: RecordType }>();
  const createMutation = useCategoryCreateMutation();
  const nameUniquenessCheck = useCategoryNameUniquenessCheck();

  const schema = useMemo(() => objectAsync({
    name: pipeAsync(
      string(),
      trim(),
      minLength(3),
      nameUniquenessCheck,
    ),
  }), []);

  const onSubmit: FormEventHandler<typeof schema> = async (event) => {
    await createMutation.mutateAsync({
      type: searchParams.type,
      name: event.value.name,
    });

    router.back();
  };

  return (
    <FormScreenLayout
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
