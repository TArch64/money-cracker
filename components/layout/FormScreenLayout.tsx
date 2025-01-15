import type { ReactNode } from 'react';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import type { TextProps } from '@ui-kitten/components';
import { FullScreenLayout } from './FullScreenLayout';
import { MainScreenLayout } from './MainScreenLayout';
import { KeyboardAvoidingView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Form, type FormSchema, FormSubmit, type IFormProps, type IFormSubmitProps } from '../form';

export interface IFormScreenLayoutProps<S extends FormSchema> extends IFormProps<S> {
  fullScreen?: boolean;
  title?: string | RenderProp<TextProps>;
  submit: IFormSubmitProps['children']
}

export function FormScreenLayout<S extends FormSchema>(props: IFormScreenLayoutProps<S>): ReactNode {
  const Wrapper = props.fullScreen ? FullScreenLayout : MainScreenLayout;

  return (
    <Wrapper title={props.title!} style={styles.root}>
      <Form
        schema={props.schema}
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}
      >
        {(formCtx) => (
          <KeyboardAvoidingView
            style={styles.formColumn}
            behavior="padding"
            keyboardVerticalOffset={140}
          >
            {props.children(formCtx)}

            <View style={styles.formSubmit}>
              <FormSubmit>
                {props.submit}
              </FormSubmit>
            </View>
          </KeyboardAvoidingView>
        )}
      </Form>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 104,
  } satisfies ViewStyle,

  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flex: 1,
  } satisfies ViewStyle,

  formSubmit: {
    marginTop: 'auto',
  } satisfies ViewStyle,
});
