import type { ReactNode } from 'react';
import type { RenderProp } from '@ui-kitten/components/devsupport';
import { Button, type TextProps } from '@ui-kitten/components';
import { KeyboardAvoidingView, StyleSheet, View, type ViewStyle } from 'react-native';
import { textRenderer } from '@/components/uiKitten';
import { Form, type FormSchema, FormSubmit, type IFormProps, type IFormSubmitProps } from '../form';
import { FullScreenLayout } from './FullScreenLayout';

export interface IFormScreenLayoutProps<S extends FormSchema> extends IFormProps<S> {
  title: string | RenderProp<TextProps>;
  submit?: IFormSubmitProps['children'] | string;
}

export function FormScreenLayout<S extends FormSchema>(props: IFormScreenLayoutProps<S>): ReactNode {
  return (
    <FullScreenLayout title={props.title} style={styles.root}>
      <Form
        schema={props.schema}
        initialValues={props.initialValues}
        onInitialValuesChange={props.onInitialValuesChange}
        onSubmit={props.onSubmit}
      >
        {(formCtx) => (
          <KeyboardAvoidingView
            style={styles.formColumn}
            behavior="padding"
            keyboardVerticalOffset={140}
          >
            {props.children(formCtx)}

            {props.submit && (
              <View style={styles.formSubmit}>
                <FormSubmit>
                  {typeof props.submit !== 'string' ? props.submit : ({ submit, disabled }) => (
                    <Button disabled={disabled} onPress={submit}>
                      {textRenderer(props.submit as string)}
                    </Button>
                  )}
                </FormSubmit>
              </View>
            )}
          </KeyboardAvoidingView>
        )}
      </Form>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
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
