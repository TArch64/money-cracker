import { useActionSheet as useActionSheet_ } from '@expo/react-native-action-sheet';

interface IPlainSheetAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'destructive';
  disabled?: boolean;
}

interface ICancelSheetAction {
  text: string;
  style: 'cancel';
}

export type SheetAction = IPlainSheetAction | ICancelSheetAction;

function getButtonIndexes(actions: SheetAction[], check: (action: IPlainSheetAction) => boolean): number[] {
  return actions.map((action, index) => check(action as IPlainSheetAction) ? index : -1).filter((index) => index >= 0);
}

export function useActionSheet(makeActions: () => SheetAction[]): () => void {
  const { showActionSheetWithOptions } = useActionSheet_();

  return () => {
    const actions = makeActions();

    showActionSheetWithOptions({
      options: actions.map((action) => action.text),
      destructiveButtonIndex: getButtonIndexes(actions, (action) => action.style === 'destructive'),
      disabledButtonIndices: getButtonIndexes(actions, (action) => !!action.disabled),
      cancelButtonIndex: actions.findIndex((action) => action.style === 'cancel'),
    }, (buttonIndex) => {
      const action = actions[buttonIndex!];

      if (!action || action.style === 'cancel') {
        return;
      }

      action.onPress();
    });
  };
}
