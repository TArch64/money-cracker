import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { IntroState } from '@/enums';
import { Button, Text, type TextProps, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Icon, IconName } from '@/components/uiKitten';
import { useUserUpdateMutation } from '@/hooks/queries';
import { useTranslation } from 'react-i18next';

interface ITermsSectionProps {
  title: string;
  icon: IconName;
  children: TextProps['children'];
}

function TermsSection(props: ITermsSectionProps): ReactNode {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.sectionIconContainer,
          { backgroundColor: theme['color-primary-100'] },
        ] satisfies StyleProp<ViewStyle>}
      >
        <Icon
          name={props.icon}
          fill={theme['color-primary-600']}
          style={styles.sectionIcon}
        />
      </View>

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

export default function Intro(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const updateUserMutation = useUserUpdateMutation();

  async function start() {
    await updateUserMutation.mutateAsync({ intro: IntroState.COMPLETED });
    router.replace('/home');
  }

  return (
    <FullScreenLayout canGoBack={false} style={styles.layout}>
      <View style={styles.innerColumn}>
        <Text category="h1" style={styles.heading}>
          {t('intro.heading')}
        </Text>

        <Text>
          {t('intro.description')}
        </Text>

        <View style={styles.sectionList}>
          <TermsSection title={t('intro.sections.free.title')} icon={IconName.HEART_OUTLINE}>
            {t('intro.sections.free.description')}
          </TermsSection>

          <TermsSection title={t('intro.sections.privacy.title')} icon={IconName.LOCK_OUTLINE}>
            {t('intro.sections.privacy.description')}
          </TermsSection>

          <TermsSection title={t('intro.sections.openSource.title')} icon={IconName.GITHUB_OUTLINE}>
            {t('intro.sections.openSource.description')}

            <Link asChild href="https://github.com/TArch64/money-cracker">
              <Text status="primary"> GitHub</Text>
            </Link>
          </TermsSection>
        </View>

        <Button style={styles.nextButton} onPress={start}>
          {t('intro.start')}
        </Button>
      </View>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  } satisfies ViewStyle,

  innerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
  },

  heading: {
    marginBottom: 8,
  } satisfies TextStyle,

  sectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginTop: 40,
    marginBottom: 64,
  } satisfies ViewStyle,

  section: {
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,

  sectionIconContainer: {
    padding: 8,
    borderRadius: '100%',
    marginRight: 12,
  } satisfies ViewStyle,

  sectionIcon: {
    width: 24,
    height: 24,
  } satisfies ViewStyle,

  sectionContent: {
    flexShrink: 1,
  } satisfies TextStyle,

  sectionTitle: {
    marginBottom: 4,
  } satisfies TextStyle,

  nextButton: {
    alignSelf: 'stretch',
  },
});
