import type { ReactNode } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { useFormContext } from './FormProvider';

export interface IFormSubmitContext {
  disabled: boolean;
  submit: () => void;
}

export interface IFormSubmitProps extends
  IPropsWithChildrenFn<[ctx: IFormSubmitContext]>
{}

export function FormSubmit(props: IFormSubmitProps): ReactNode {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state: any) => [state.canSubmit]}>
      {([canSubmit]) => props.children({
        disabled: !canSubmit,
        submit: form.handleSubmit,
      })}
    </form.Subscribe>
  );
}
