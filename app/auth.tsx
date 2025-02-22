import { type ReactNode, useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { object, pipe, string, trim } from 'valibot';
import { useRouter } from 'expo-router';
import { IntroButtonNext, IntroContainedIcon, IntroHeading, IntroScreenLayout } from '@/components/layout';
import { IconName } from '@/components/uiKitten';
import { Form, FormInput, FormSubmit, type FormSubmitHandler } from '@/components/form';
import { useAuthHardwareAvailableSuspenseQuery } from '@/hooks/queries';
import { useAppAuth } from '@/hooks/useAppAuth';

const schema = object({
  password: pipe(string(), trim()),
});

type Schema = typeof schema;

export default function Auth(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const appAuth = useAppAuth();
  const hardwareAuthAvailableQuery = useAuthHardwareAvailableSuspenseQuery();

  function complete() {
    router.replace('/home');
  }

  useEffect(() => {
    if (!hardwareAuthAvailableQuery.data) {
      return;
    }

    appAuth.authHardware().then((success) => {
      if (success) complete();
    });
  }, []);

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
  };

  return (
    <IntroScreenLayout>
      <IntroContainedIcon
        size={56}
        status="primary"
        style={styles.icon}
        name={IconName.SHIELD}
      />

      <IntroHeading>
        {t('auth.heading')}
      </IntroHeading>

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
                  {t('auth.unlock')}
                </IntroButtonNext>
              )}
            </FormSubmit>
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
