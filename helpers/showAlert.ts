import { Alert } from 'react-native';

export interface IAlertProps {
  title: string;
  message?: string;
}

export function showAlert(props: IAlertProps): void {
  Alert.alert(props.title, props.message, [
    {
      text: 'Ok',
      isPreferred: true,
      style: 'default',
    },
  ]);
}
