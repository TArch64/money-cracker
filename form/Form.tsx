import type { ReactNode } from 'react';
import { type DeepKeys, type ReactFormExtendedApi, standardSchemaValidator, useForm } from '@tanstack/react-form';
import type { InferOutput, ObjectSchema } from 'valibot';
import { FormProvider } from './FormProvider';
import type { IPropsWithChildrenFn } from '@/types';

export type FormSchema = ObjectSchema<any, any>
export type FormApi<S extends FormSchema = FormSchema> = ReactFormExtendedApi<InferOutput<S>, any>;
export type FormKey<S extends FormSchema> = DeepKeys<InferOutput<S>>;

export interface IFormContext<S extends FormSchema> {
  f: (path: FormKey<S>) => FormKey<S>;
}

export interface FormSubmitEvent<S extends FormSchema> {
  value: InferOutput<S>,
  formApi: FormApi<S>
}

export type FormSubmitHandler<S extends FormSchema> = (event: FormSubmitEvent<S>) => void | Promise<void>

export interface IFormProps<S extends FormSchema> extends IPropsWithChildrenFn<[formCtx: IFormContext<S>]> {
  schema: S;
  initialValues: InferOutput<S>;
  onSubmit?: FormSubmitHandler<S>;
}

export function Form<S extends FormSchema>(props: IFormProps<S>): ReactNode {
  // @ts-expect-error
  const form = useForm({
    defaultValues: props.initialValues,
    validatorAdapter: standardSchemaValidator(),
    validators: { onSubmit: props.schema },
    onSubmit: props.onSubmit,
  });

  return (
    <FormProvider form={form}>
      {props.children({ f: (path: FormKey<S>) => path })}
    </FormProvider>
  );
}
