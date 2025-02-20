import { Button } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';

export interface IIntroButtonProps {
  children: string;
  loading?: boolean;
  onPress: () => void;
}

export const IntroButtonNext = (props: IIntroButtonProps) => (
  <Button
    disabled={props.loading}
    style={styles.nextButton}
    onPress={props.onPress}
  >
    {props.children}
  </Button>
);

export const IntroButtonSkip = (props: IIntroButtonProps) => (
  <Button
    appearance="link"
    status="basic"
    style={styles.skipButton}
    onPress={props.onPress}
  >
    {props.children}
  </Button>
);

const styles = StyleSheet.create({
  nextButton: {
    alignSelf: 'stretch',
    marginTop: 40,
  } satisfies ViewStyle,

  skipButton: {
    marginTop: 4,
  } satisfies ViewStyle,
});
