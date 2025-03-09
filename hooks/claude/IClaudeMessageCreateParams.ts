import { ClaudeModel } from './ClaudeModel';
import type { IClaudeMessageParam } from './IClaudeMessageParam';

export interface IClaudeMessageCreateParams {
  model?: ClaudeModel;
  maxTokens: number;
  system: string;
  messages: IClaudeMessageParam[];
}
