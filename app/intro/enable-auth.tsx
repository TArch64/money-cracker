import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import {
  IntroButtonNext,
  IntroButtonSkip,
  IntroDescription,
  IntroHeading,
  IntroScreenLayout,
} from '@/components/layout';
import { ContainedIcon, IconName } from '@/components/uiKitten';
import { useUserUpdateMutation } from '@/hooks/queries';
import { IntroState } from '@/enums';

export default function EnableAuth(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const updateUserMutation = useUserUpdateMutation();

  async function complete(): Promise<void> {
    await updateUserMutation.mutateAsync({ intro: IntroState.COMPLETED });
    router.replace('/home');
  }

  function enable(): void {
    router.replace('/intro/enter-password');
  }

  return (
    <IntroScreenLayout>
      <ContainedIcon
        size={56}
        status="primary"
        style={styles.icon}
        name={IconName.SHIELD}
      />

      <IntroHeading>
        {t('intro.enableAuth.heading')}
      </IntroHeading>

      <IntroDescription>
        {t('intro.enableAuth.description')}
      </IntroDescription>

      <IntroButtonNext onPress={enable}>
        {t('intro.enable')}
      </IntroButtonNext>

      <IntroButtonSkip onPress={complete}>
        {t('intro.skip')}
      </IntroButtonSkip>
    </IntroScreenLayout>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 32,
  } satisfies ViewStyle,
});
