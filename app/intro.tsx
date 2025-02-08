import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { IntroState } from '@/enums';
import { Button, Text, type TextProps, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Icon, IconName } from '@/components/uiKitten';
import { useUserUpdateMutation } from '@/hooks/queries';

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

      <View>
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
          Welcome!
        </Text>

        <Text>
          Take control of your finances today
        </Text>

        <View style={styles.sectionList}>
          <TermsSection title="100% Free, Forever" icon={IconName.HEART_OUTLINE}>
            No ads, no premium, no data selling
          </TermsSection>

          <TermsSection title="Privacy First" icon={IconName.LOCK_OUTLINE}>
            All your data stays on your device
          </TermsSection>

          <TermsSection title="Open Source" icon={IconName.GITHUB_OUTLINE}>
            Report issues & contribute on

            <Link asChild href="https://github.com/TArch64/money-cracker">
              <Text status="primary"> GitHub</Text>
            </Link>
          </TermsSection>
        </View>

        <Button style={styles.nextButton} onPress={start}>
          Start
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

  sectionTitle: {
    marginBottom: 4,
  } satisfies TextStyle,

  sectionIconContainer: {
    padding: 8,
    borderRadius: '100%',
    marginRight: 12,
  } satisfies ViewStyle,

  sectionIcon: {
    width: 24,
    height: 24,
  } satisfies ViewStyle,

  nextButton: {
    alignSelf: 'stretch',
  },
});
