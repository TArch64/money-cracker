import { type InferOutput, type ObjectSchema, parse } from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';
import type { Message } from '@anthropic-ai/sdk/resources/messages';

export type ClaudeMessageSchema = ObjectSchema<any, any>;

export function stringifyJsonSchema(schema: ClaudeMessageSchema): string {
  return JSON.stringify(toJsonSchema(schema, { errorMode: 'ignore' }), null, 2);
}

function parseResponseJson(message: Message): object {
  const text = message.content.find((block) => block.type === 'text')?.text ?? '';
  let jsonStr = text;

  if (text.includes('```json')) {
    jsonStr = text.split('```json')[1].split('```')[0].trim();
  } else if (text.includes('```')) {
    jsonStr = text.split('```')[1].split('```')[0].trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    const jsonPattern = /\{[\s\S]*}/;
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

export function parseClaudeJsonMessage<S extends ClaudeMessageSchema>(schema: S, message: Message): InferOutput<S> {
  return parse(schema, parseResponseJson(message), {
    abortEarly: true,
    abortPipeEarly: true,
  });
}
