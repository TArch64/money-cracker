import { Text, type TextElement, type TextProps, useTheme } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

export interface IHighlightTextProps extends Omit<TextProps, 'children'> {
  text: string;
  highlight: string;
}

const NO_WIDTH_SPACE = '​';

export function HighlightText(props: IHighlightTextProps): ReactNode {
  const theme = useTheme();
  const { text: content, highlight, ...txtProps } = props;

  if (!highlight) {
    return <Text {...txtProps}>{content}</Text>;
  }

  const startIndex = content.toLowerCase().indexOf(props.highlight.toLowerCase());

  if (startIndex === -1) {
    return <Text {...txtProps}>{content}</Text>;
  }

  const prefix = content.slice(0, startIndex);

  const highlightStyle: TextStyle = {
    backgroundColor: theme['color-warning-300'],
  };

  const highlightedText = content
    .slice(startIndex, startIndex + props.highlight.length)
    .split(' ')
    .map((word, index): TextElement => (
      <Text {...txtProps} key={index}>
        <Text {...txtProps} style={[txtProps.style, highlightStyle]}>{word}</Text>
        {NO_WIDTH_SPACE}
      </Text>
    ));

  const suffix = content.slice(startIndex + props.highlight.length);
  const children = [prefix, ...highlightedText, suffix];
  return <Text {...txtProps} children={children} />;
}
