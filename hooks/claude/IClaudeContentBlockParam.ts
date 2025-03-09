import { ClaudeMediaType } from './ClaudeMediaType';

export interface IClaudeTextBlockParam {
  type: 'text';
  text: string;
}

export interface Base64ImageSource {
  data: string;
  media_type: ClaudeMediaType;
  type: 'base64';
}

export interface IClaudeImageBlockParam {
  type: 'image';
  source: Base64ImageSource;
}

export type IClaudeContentBlockParam = IClaudeTextBlockParam | IClaudeImageBlockParam;
