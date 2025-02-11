export interface IBaseSheetActionConfig {
  text: string;
  style: string;
}

export abstract class BaseSheetAction<C extends IBaseSheetActionConfig> {
  protected constructor(
    readonly config: C,
  ) {
  }

  abstract press(): void;
}
