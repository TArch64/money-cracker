import type { ClaudeMessageRole } from './ClaudeMessageRole';
import type { IClaudeContentBlockParam } from './IClaudeContentBlockParam';

export interface IClaudeMessageParam {
  content: string | IClaudeContentBlockParam[];
  role: ClaudeMessageRole;
}
