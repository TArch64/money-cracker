import { Alert, type AlertButton } from 'react-native';

export interface IConfirmButton extends Omit<AlertButton, 'onPress'> {
}

export interface IConfirmProps {
  title: string;
  message: string;
  decline?: string | IConfirmButton;
  accept?: string | IConfirmButton;
}

function normalizeButton(button: string | IConfirmButton, convert: (text?: string) => IConfirmButton): IConfirmButton {
  return typeof button === 'object' ? button : convert(button);
}

export function showConfirm(props: IConfirmProps): Promise<boolean> {
  const decline = normalizeButton(props.decline || 'Cancel', (text) => ({
    style: 'cancel',
    text: text || 'Cancel',
  }));

  const accept = normalizeButton(props.accept || 'Confirm', (text) => ({
    style: 'default',
    text: text || 'Confirm',
    isPreferred: true,
  }));

  return new Promise((resolve) => {
    Alert.alert(props.title, props.message, [
      { ...decline, onPress: () => resolve(false) },
      { ...accept, onPress: () => resolve(true) },
    ]);
  });
}
