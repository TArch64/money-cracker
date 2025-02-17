import { createContext, type PropsWithChildren, type ReactNode, useContext } from 'react';
import type { FormApi } from './Form';

export interface IFormProviderProps extends PropsWithChildren {
  form: FormApi;
}

const Context = createContext<FormApi>(null!);

export const useFormContext = () => useContext(Context);

export const FormProvider = (props: IFormProviderProps): ReactNode => (
  <Context.Provider value={props.form}>
    {props.children}
  </Context.Provider>
);
