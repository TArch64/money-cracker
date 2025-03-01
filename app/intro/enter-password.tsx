import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { maxLength, minLength, object, pipe, string, trim } from 'valibot';
import {
  IntroButtonNext,
  IntroButtonSkip,
  IntroDescription,
  IntroHeading,
  IntroScreenLayout,
} from '@/components/layout';
import { ContainedIcon, IconName } from '@/components/uiKitten';
import { useAuthHardwareAvailableSuspenseQuery, useUserUpdateMutation } from '@/hooks/queries';
import { IntroState } from '@/enums';
import { Form, type FormEventHandler, FormInput, FormSubmit } from '@/components/form';
import { useAppAuth } from '@/hooks/useAppAuth';

const schema = object({
  password: pipe(
    string(),
    trim(),
    minLength(4),
    maxLength(32),
  ),
});

type Schema = typeof schema;

export default function EnterPassword(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const appAuth = useAppAuth();
  const updateUserMutation = useUserUpdateMutation();
  const hardwareAuthAvailableQuery = useAuthHardwareAvailableSuspenseQuery();

  async function complete(): Promise<void> {
    await updateUserMutation.mutateAsync({ intro: IntroState.COMPLETED });
    router.replace('/home');
  }

  const onSubmit: FormEventHandler<Schema> = async (event) => {
    await appAuth.enable({ password: event.value.password });
    await complete();
  };

  return (
    <IntroScreenLayout>
      <ContainedIcon
        size={56}
        status="primary"
        style={styles.icon}
        name={IconName.SHIELD}
      />

      <IntroHeading>
        {t('intro.enterPassword.heading')}
      </IntroHeading>

      {hardwareAuthAvailableQuery.data && (
        <IntroDescription>
          {t('intro.enterPassword.description')}
        </IntroDescription>
      )}

      <Form
        schema={schema}
        initialValues={{ password: '' }}
        onSubmit={onSubmit}
      >
        {({ f }) => (
          <>
            <FormInput
              name={f('password')}
              style={styles.field}
              label={t('form.labels.password')}
              placeholder={t('form.labels.password')}
            />

            <FormSubmit>
              {({ submit, disabled }) => (
                <IntroButtonNext loading={disabled} onPress={submit}>
                  {t('intro.enable')}
                </IntroButtonNext>
              )}
            </FormSubmit>

            <IntroButtonSkip onPress={complete}>
              {t('intro.skip')}
            </IntroButtonSkip>
          </>
        )}
      </Form>
    </IntroScreenLayout>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 32,
  } satisfies ViewStyle,

  field: {
    marginTop: 24,
  } satisfies ViewStyle,
});
