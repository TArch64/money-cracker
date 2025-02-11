import { BaseSheetAction, type IBaseSheetActionConfig } from './BaseSheetAction';

interface ICancelSheetAction extends IBaseSheetActionConfig {
  style: 'cancel';
}

export class CancelSheetAction extends BaseSheetAction<ICancelSheetAction> {
  static named(text: string): CancelSheetAction {
    return new CancelSheetAction({ text, style: 'cancel' });
  }

  static isCancel(action: object): action is CancelSheetAction {
    return (action as CancelSheetAction).config.style === 'cancel';
  }

  press() {
    // Press handles automatically by the action sheet
  }
}
