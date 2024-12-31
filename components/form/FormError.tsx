import { Text, type TextProps } from '@ui-kitten/components';
import type { RenderProp } from '@ui-kitten/components/devsupport';

export function renderFormError(error?: string): RenderProp<TextProps> | undefined {
  if (!error) return undefined;

  return (txtProps) => (
    <Text
      {...txtProps}
      style={[txtProps?.style, { marginTop: 4 }]}
    >
      {error}
    </Text>
  );
}
