import type { ReactNode } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { useFormContext } from './FormProvider';
import { type ImageProps, StyleSheet, View, type ViewStyle } from 'react-native';
import { Spinner } from '@ui-kitten/components';
import type { RenderProp } from '@ui-kitten/components/devsupport';

export interface IFormSubmitContext {
  disabled: boolean;
  isSubmitting: boolean;
  submit: () => void;
}

export interface IFormSubmitProps extends IPropsWithChildrenFn<[ctx: IFormSubmitContext]> {
}

export function FormSubmit(props: IFormSubmitProps): ReactNode {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state: any) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => props.children({
        disabled: !canSubmit,
        isSubmitting,
        submit: form.handleSubmit,
      })}
    </form.Subscribe>
  );
}

export const formLoadingIndicator = (isSubmitting: boolean): RenderProp<Partial<ImageProps>> | undefined => isSubmitting ? (() => (
  <View style={styles.loadingIndicator}>
    <Spinner size="small" status="basic" />
  </View>
)) : undefined;

const styles = StyleSheet.create({
  loadingIndicator: {
    margin: -10,
    transform: [
      { translateX: -12 },
    ],
  } satisfies ViewStyle,
});
