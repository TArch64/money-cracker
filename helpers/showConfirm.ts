import { Alert, type AlertButton } from 'react-native';

export interface IConfirmButton extends Omit<AlertButton, 'onPress'> {
}

export interface IConfirmProps {
  title: string;
  message: string;
  decline?: string | IConfirmButton;
  accept?: string | IConfirmButton;
}

export function showConfirm(props: IConfirmProps): Promise<boolean> {
  const decline: IConfirmButton = typeof props.decline === 'object' ? props.decline : {
    style: 'cancel',
    text: props.decline || 'Cancel',
  };

  const accept: IConfirmButton = typeof props.accept === 'object' ? props.accept : {
    style: 'default',
    text: props.accept || 'Confirm',
    isPreferred: true,
  };

  return new Promise((resolve) => {
    Alert.alert(props.title, props.message, [
      { ...decline, onPress: () => resolve(false) },
      { ...accept, onPress: () => resolve(true) },
    ]);
  });
}
