import { type ReactNode, useEffect, useRef } from 'react';
import { type DeepKeys, type ReactFormExtendedApi, useForm } from '@tanstack/react-form';
import type { InferOutput, MaybePromise, ObjectSchema, ObjectSchemaAsync } from 'valibot';
import type { IPropsWithChildrenFn } from '@/types';
import { FormProvider } from './FormProvider';

export type FormSchema = ObjectSchema<any, any> | ObjectSchemaAsync<any, any>;
export type FormApi<S extends FormSchema = FormSchema> = ReactFormExtendedApi<InferOutput<S>, any, any, any, any, any, any, any, any, any>;
export type FormKey<S extends FormSchema> = DeepKeys<InferOutput<S>>;
export type FormPathGet<S extends FormSchema> = (path: FormKey<S>) => FormKey<S>;

export interface IFormContext<S extends FormSchema> {
  f: FormPathGet<S>;
}

export interface FormEvent<S extends FormSchema> {
  value: InferOutput<S>;
  formApi: FormApi<S>;
}

export type FormEventHandler<S extends FormSchema> = (event: FormEvent<S>) => MaybePromise<void>;
export type FormInitialValuesHandler<S extends FormSchema> = (form: FormApi<S>, newValues: InferOutput<S>) => void;

export interface IFormProps<S extends FormSchema> extends IPropsWithChildrenFn<[formCtx: IFormContext<S>]> {
  schema: S;
  initialValues: InferOutput<S>;
  onInitialValuesChange?: FormInitialValuesHandler<S>;
  onSubmit?: FormEventHandler<S>;
  onChange?: FormEventHandler<S>;
}

export function Form<S extends FormSchema>(props: IFormProps<S>): ReactNode {
  // @ts-expect-error ts cannot resolve type due recursion
  const form = useForm({
    defaultValues: props.initialValues,
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

  useEffect(() => {
    if (!props.onChange) {
      return;
    }

    return form.store.subscribe((event) => {
      props.onChange!({
        value: event.currentVal.values,
        formApi: form,
      });
    });
  }, []);

  return (
    <FormProvider form={form}>
      {props.children({ f: (path) => path })}
    </FormProvider>
  );
}
