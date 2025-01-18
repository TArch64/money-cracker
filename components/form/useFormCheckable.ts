import { useFormField } from './useFormField';

type FormCheckable = [isChecked: boolean, setChecked: (value: boolean) => void];

export function useFormCheckable(name: string): FormCheckable {
  const field = useFormField(name);
  return [field.state.value, field.handleChange];
}
