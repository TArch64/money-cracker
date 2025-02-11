import { BaseSheetAction, type IBaseSheetActionConfig } from './BaseSheetAction';

export interface IPlainSheetActionConfig extends IBaseSheetActionConfig {
  onPress: () => void;
  style: 'default' | 'destructive';
  disabled?: boolean;
}

export class PlainSheetAction extends BaseSheetAction<IPlainSheetActionConfig> {
  static named(text: string): PlainSheetAction {
    return new PlainSheetAction({
      text,
      style: 'default',
      onPress: () => {
      },
    });
  }

  onPress(action: () => void): PlainSheetAction {
    this.config.onPress = action;
    return this;
  }

  press(): void {
    this.config.onPress();
  }

  asDisabled(disabled: boolean): PlainSheetAction {
    this.config.disabled = disabled;
    return this;
  }

  get isDisabled(): boolean {
    return !!this.config.disabled;
  }

  withStyle(style: 'default' | 'destructive'): PlainSheetAction {
    this.config.style = style;
    return this;
  }

  asDestructive(): PlainSheetAction {
    return this.withStyle('destructive');
  }

  get isDestructive(): boolean {
    return this.config.style === 'destructive';
  }
}
