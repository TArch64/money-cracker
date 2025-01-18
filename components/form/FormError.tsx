import { Text, type TextProps } from '@ui-kitten/components';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import type { ReactNode } from 'react';

export function FormError(props: TextProps): ReactNode {
  return (
    <Text
      {...props}
      status="danger"
      style={[props?.style, { marginTop: 4 }]}
    />
  )
}

export function formErrorRenderer(error?: string): RenderProp<TextProps> | undefined {
  return error ? (txtProps) => <FormError {...txtProps} children={error} /> : undefined;
}
