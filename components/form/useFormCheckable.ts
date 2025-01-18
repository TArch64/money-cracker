import { useFormField } from './useFormField';

export function useFormCheckable(name: string): [isChecked: boolean, setChecked: (value: boolean) => void] {
  const field = useFormField(name);
  return [field.state.value, field.setValue];
}
