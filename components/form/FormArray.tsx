import type { ReactNode } from 'react';
import { useField } from '@tanstack/react-form';
import type { IPropsWithChildrenFn } from '@/types';
import { useFormContext } from './FormProvider';

export interface IFormArrayContext<I> {
  index: number;
  item: I;
  itemName: string;
}

export interface IFormArrayProps<I> extends IPropsWithChildrenFn<[itemCtx: IFormArrayContext<I>]> {
  name: string;
}

export function FormArray<I>(props: IFormArrayProps<I>): ReactNode {
  const form = useFormContext();

  const field = useField({
    name: props.name,
    form: form as any,
    mode: 'array',
  });

  return (field.state.value as I[]).map((item, index) => props.children({
    item,
    index,
    itemName: `${props.name}[${index}]`,
  }));
}
