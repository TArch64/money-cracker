import { Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';

export interface IIntroTextProps {
  children: string;
}

export const IntroHeading = (props: IIntroTextProps) => (
  <Text category="h1" style={styles.heading}>
    {props.children}
  </Text>
);

export const IntroDescription = (props: IIntroTextProps) => (
  <Text style={styles.description}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    marginBottom: 8,
  } satisfies TextStyle,

  description: {
    textAlign: 'center',
  } satisfies TextStyle,
});
