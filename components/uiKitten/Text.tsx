import { Text, type TextProps } from '@ui-kitten/components';
import type { StyleProp, TextStyle } from 'react-native';
import type { RenderProp } from '@ui-kitten/components/devsupport';

export function textRenderer(text: string, props?: TextProps): RenderProp<TextProps> {
  return (txtProps) => (
    <Text
      {...txtProps}
      {...props}

      style={[
        txtProps?.style,
        props?.style,
      ] satisfies StyleProp<TextStyle>}
    >
      {text}
    </Text>
  );
}
