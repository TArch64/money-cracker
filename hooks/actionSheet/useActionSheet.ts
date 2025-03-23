import { useActionSheet as useActionSheet_ } from '@expo/react-native-action-sheet';
import { useTranslation } from 'react-i18next';
import { PlainSheetAction } from './PlainSheetAction';
import { CancelSheetAction } from './CancelSheetAction';

export type SheetAction = PlainSheetAction | CancelSheetAction;

function getButtonIndexes(actions: SheetAction[], check: (action: PlainSheetAction) => boolean): number[] {
  return actions.map((action, index) => check(action as PlainSheetAction) ? index : -1).filter((index) => index >= 0);
}

export interface IActionSheetOptions {
  title?: string;
  actions: SheetAction[];
}

export interface IActionSheetBuilderContext {
  action: (text: string) => PlainSheetAction;
  cancel: (text?: string) => CancelSheetAction;
}

export type ActionSheetBuilder = (ctx: IActionSheetBuilderContext) => IActionSheetOptions | SheetAction[];
export type ActionSheetMenuBuilder = (ctx: IActionSheetBuilderContext) => SheetAction[];

export function useActionSheet(options: ActionSheetBuilder): () => void {
  const { showActionSheetWithOptions } = useActionSheet_();
  const { t } = useTranslation();

  return () => {
    const _options = options({
      action: (text) => PlainSheetAction.named(text),
      cancel: (text) => CancelSheetAction.named(text ?? t('actionsSheet.cancel')),
    });

    const { title, actions } = Array.isArray(_options) ? { actions: _options } : _options;

    showActionSheetWithOptions({
      title,
      options: actions.map((action) => action.config.text),
      destructiveButtonIndex: getButtonIndexes(actions, (action) => action.isDestructive),
      disabledButtonIndices: getButtonIndexes(actions, (action) => action.isDisabled),
      cancelButtonIndex: actions.findIndex(CancelSheetAction.isCancel),
    }, (index) => actions[index!]?.press());
  };
}
