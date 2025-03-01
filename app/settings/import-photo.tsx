import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'valibot';
import { Button } from '@ui-kitten/components';
import { FormScreenLayout } from '@/components/layout';
import { useUserSuspenseQuery, useUserUpdateMutation } from '@/hooks/queries';
import { type FormEventHandler, FormInput } from '@/components/form';
import { textRenderer } from '@/components/uiKitten';

const schema = object({
  anthropicKey: string(),
});

type Schema = typeof schema;

interface ISaveButtonProps {
  disabled: boolean;
  onPress: () => void;
}

function SaveButton(props: ISaveButtonProps): ReactNode {
  const { t } = useTranslation();
  const [isSubmitted, setSubmitted] = useState(false);

  function onPress() {
    props.onPress();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
  }

  const text = isSubmitted
    ? t('settings.importPhoto.saved')
    : t('settings.importPhoto.save');

  return (
    <Button disabled={props.disabled} onPress={onPress}>
      {textRenderer(text)}
    </Button>
  );
}

export default function Language(): ReactNode {
  const { t } = useTranslation();
  const userQuery = useUserSuspenseQuery();
  const updateMutation = useUserUpdateMutation();

  const onSubmit: FormEventHandler<Schema> = async (event) => {
    await updateMutation.mutateAsync({
      anthropicKey: event.value.anthropicKey,
    });
  };

  return (
    <FormScreenLayout
      title={t('settings.importPhoto.heading')}
      schema={schema}

      submit={({ submit, disabled }) => (
        <SaveButton disabled={disabled} onPress={submit} />
      )}

      initialValues={{
        anthropicKey: userQuery.data.anthropicKey ?? '',
      }}

      onSubmit={onSubmit}
    >
      {({ f }) => (
        <FormInput
          name={f('anthropicKey')}
          label={t('settings.importPhoto.form.labels.anthropicKey')}
          placeholder={t('settings.importPhoto.form.labels.anthropicKey')}
          secureTextEntry={true}
        />
      )}
    </FormScreenLayout>
  );
}
