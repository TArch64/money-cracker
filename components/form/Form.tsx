import { type ReactNode, useEffect, useRef } from 'react';
import { type DeepKeys, type ReactFormExtendedApi, standardSchemaValidator, useForm } from '@tanstack/react-form';
import type { InferOutput, MaybePromise, ObjectSchema, ObjectSchemaAsync } from 'valibot';
import { FormProvider } from './FormProvider';
import type { IPropsWithChildrenFn } from '@/types';

export type FormSchema = ObjectSchema<any, any> | ObjectSchemaAsync<any, any>;
export type FormApi<S extends FormSchema = FormSchema> = ReactFormExtendedApi<InferOutput<S>, any>;
export type FormKey<S extends FormSchema> = DeepKeys<InferOutput<S>>;
export type FormPathGet<S extends FormSchema> = (path: FormKey<S>) => FormKey<S>;

export interface IFormContext<S extends FormSchema> {
  f: FormPathGet<S>;
  form: FormApi<S>;
}

export interface FormSubmitEvent<S extends FormSchema> {
  value: InferOutput<S>,
  formApi: FormApi<S>
}

export type FormSubmitHandler<S extends FormSchema> = (event: FormSubmitEvent<S>) => MaybePromise<void>;
export type FormInitialValuesHandler<S extends FormSchema> = (form: FormApi<S>, newValues: InferOutput<S>) => void;

export interface IFormProps<S extends FormSchema> extends IPropsWithChildrenFn<[formCtx: IFormContext<S>]> {
  schema: S;
  initialValues: InferOutput<S>;
  onInitialValuesChange?: FormInitialValuesHandler<S>;
  onSubmit?: FormSubmitHandler<S>;
}

export function Form<S extends FormSchema>(props: IFormProps<S>): ReactNode {
  // @ts-expect-error
  const form = useForm({
    defaultValues: props.initialValues,
    validatorAdapter: standardSchemaValidator(),
    validators: props.schema.async ? { onSubmitAsync: props.schema } : { onSubmit: props.schema },
    onSubmit: props.onSubmit,
  });

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    props.onInitialValuesChange?.(form, props.initialValues);
  }, [props.initialValues]);

  return (
    <FormProvider form={form}>
      {props.children({
        f: (path) => path,
        form,
      })}
    </FormProvider>
  );
}
