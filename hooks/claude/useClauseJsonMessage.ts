import { type InferOutput, type ObjectSchema, parse } from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';
import { withRetries } from '@/helpers/withRetries';
import { useClaudeClient } from './useClaudeClient';
import type { IClaudeMessageCreateParams } from './IClaudeMessageCreateParams';

export type ClaudeAnswerSchema = ObjectSchema<any, any>;

export interface IClaudeJsonMessageCreateParams<S extends ClaudeAnswerSchema> {
  schema: S;
  retryLimit: number;
  message: (schema: string) => IClaudeMessageCreateParams;
}

export interface IClaudeJsonMessage {
  createMessage: <S extends ClaudeAnswerSchema>(params: IClaudeJsonMessageCreateParams<S>) => Promise<InferOutput<S> | null>;
}

function parseClaudeResponse(responseText: string): object {
  const text = responseText.trim();
  let jsonStr = text;

  if (text.includes('```json')) {
    jsonStr = text.split('```json')[1].split('```')[0].trim();
  } else if (text.includes('```')) {
    jsonStr = text.split('```')[1].split('```')[0].trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing JSON response:', error);

    const jsonPattern = /\{[\s\S]*\}/;
    const match = jsonPattern.exec(text);

    if (!match) {
      throw new Error('failed to parse claude json response');
    }

    try {
      return JSON.parse(match[0]);
    } catch (innerError) {
      throw new Error(`failed to parse claude json response. ${innerError}`);
    }
  }
}

export function useClauseJsonMessage(): IClaudeJsonMessage {
  const client = useClaudeClient();

  async function createMessage<S extends ClaudeAnswerSchema>(params: IClaudeJsonMessageCreateParams<S>): Promise<InferOutput<S> | null> {
    return withRetries({
      limit: params.retryLimit,

      perform: async () => {
        const schema = JSON.stringify(toJsonSchema(params.schema, { errorMode: 'ignore' }), null, 2);
        const response = await client.messages.create(params.message(schema));
        console.log(response);
        const responseObject = parseClaudeResponse(response.content[0].text);

        return parse(params.schema, responseObject, {
          abortEarly: true,
          abortPipeEarly: true,
        });
      },
    });
  }

  return { createMessage };
}
