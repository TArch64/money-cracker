import type { ReactNode } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { useFormContext } from './FormProvider';

export interface IFormArrayProps<I> extends IPropsWithChildrenFn<[items: I[]]> {
  name: string;
}

export function FormArray<I>(props: IFormArrayProps<I>): ReactNode {
  const form = useFormContext();

  return (
    <form.Field name={props.name} mode="array">
      {(field) => props.children(field.state.value)}
    </form.Field>
  );
}
