import { useActionSheet as useActionSheet_ } from '@expo/react-native-action-sheet';
import type { PlainSheetAction } from './PlainSheetAction';
import { CancelSheetAction } from './CancelSheetAction';

export type SheetAction = PlainSheetAction | CancelSheetAction;

function getButtonIndexes(actions: SheetAction[], check: (action: PlainSheetAction) => boolean): number[] {
  return actions.map((action, index) => check(action as PlainSheetAction) ? index : -1).filter((index) => index >= 0);
}

export interface IActionSheetOptions {
  title?: string;
  actions: SheetAction[];
}

export function useActionSheet(options: () => IActionSheetOptions): () => void {
  const { showActionSheetWithOptions } = useActionSheet_();

  return () => {
    const { title, actions } = options();

    showActionSheetWithOptions({
      title,
      options: actions.map((action) => action.config.text),
      destructiveButtonIndex: getButtonIndexes(actions, (action) => action.isDestructive),
      disabledButtonIndices: getButtonIndexes(actions, (action) => action.isDisabled),
      cancelButtonIndex: actions.findIndex(CancelSheetAction.isCancel),
    }, (index) => actions[index!]?.press());
  };
}
