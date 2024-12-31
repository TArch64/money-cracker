import { FieldApi, useField } from '@tanstack/react-form';
import { useFormContext } from './FormProvider';

export type FormFieldApi = FieldApi<any, any>;

export function useFormField(name: string): FormFieldApi {
  const form = useFormContext();
  // @ts-expect-error
  return useField({ form, name });
}
