import { Alert } from 'react-native';

export interface IConfirmProps {
  title: string;
  message: string;
  accept?: string;
  danger?: boolean;
}

export function confirm(props: IConfirmProps): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(props.title, props.message, [
      {
        style: 'cancel',
        text: 'Cancel',
        onPress: () => resolve(false)
      },
      {
        style: props.danger ? 'destructive' : 'default',
        text: props.accept || 'Confirm',
        isPreferred: true,
        onPress: () => resolve(true)
      }
    ]);
  });
}
