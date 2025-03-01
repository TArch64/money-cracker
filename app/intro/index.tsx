import type { ReactNode } from 'react';
import { Text, type TextProps } from '@ui-kitten/components';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { IntroButtonNext, IntroDescription, IntroHeading, IntroScreenLayout } from '@/components/layout';
import { IntroState } from '@/enums';
import { ContainedIcon, IconName } from '@/components/uiKitten';
import { useUserUpdateMutation } from '@/hooks/queries';

interface ITermsSectionProps {
  title: string;
  icon: IconName;
  children: TextProps['children'];
}

function TermsSection(props: ITermsSectionProps): ReactNode {
  return (
    <View style={styles.section}>
      <ContainedIcon
        size={40}
        name={props.icon}
        style={styles.sectionIcon}
        status="primary"
      />

      <View style={styles.sectionContent}>
        <Text category="s1" style={styles.sectionTitle}>
          {props.title}
        </Text>

        <Text>
          {props.children}
        </Text>
      </View>
    </View>
  );
}

export default function Index(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const updateUserMutation = useUserUpdateMutation();

  const nextMutation = useMutation({
    async mutationFn() {
      await updateUserMutation.mutateAsync({ intro: IntroState.ENABLE_AUTH });
      router.replace('/intro/enable-auth');
    },
  });

  return (
    <IntroScreenLayout>
      <IntroHeading>
        {t('intro.terms.heading')}
      </IntroHeading>

      <IntroDescription>
        {t('intro.terms.description')}
      </IntroDescription>

      <View style={styles.sectionList}>
        <TermsSection title={t('intro.terms.sections.free.title')} icon={IconName.HEART}>
          {t('intro.terms.sections.free.description')}
        </TermsSection>

        <TermsSection title={t('intro.terms.sections.privacy.title')} icon={IconName.LOCK}>
          {t('intro.terms.sections.privacy.description')}
        </TermsSection>

        <TermsSection title={t('intro.terms.sections.openSource.title')} icon={IconName.GITHUB}>
          {t('intro.terms.sections.openSource.description')}

          <Link asChild href="https://github.com/TArch64/money-cracker">
            <Text status="primary"> GitHub</Text>
          </Link>
        </TermsSection>
      </View>

      <IntroButtonNext
        onPress={() => nextMutation.mutate()}
        loading={nextMutation.isPending}
      >
        {t('intro.next')}
      </IntroButtonNext>
    </IntroScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginTop: 40,
  } satisfies ViewStyle,

  section: {
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,

  sectionIcon: {
    marginRight: 12,
  } satisfies ViewStyle,

  sectionContent: {
    flexShrink: 1,
  } satisfies TextStyle,

  sectionTitle: {
    marginBottom: 4,
  } satisfies TextStyle,
});
