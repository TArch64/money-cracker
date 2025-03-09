import { useUserQuery } from '@/hooks/queries';
import { ClaudeModel } from './ClaudeModel';
import type { IClaudeMessageCreateParams } from './IClaudeMessageCreateParams';
import type { IClaudeMessage } from './IClaudeMessage';

export interface IClaudeClient {
  messages: {
    create: (message: IClaudeMessageCreateParams) => Promise<IClaudeMessage>;
  };
}

export function useClaudeClient(): IClaudeClient {
  const userQuery = useUserQuery();

  async function create(params: IClaudeMessageCreateParams): Promise<IClaudeMessage> {
    if (!userQuery.data.anthropicKey) {
      throw new Error('User has no Anthropic key');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': userQuery.data.anthropicKey!,
      },

      body: JSON.stringify({
        model: params.model ?? ClaudeModel.V3_7_SONNET,
        max_tokens: params.maxTokens,
        system: params.system,
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  }

  return { messages: { create } };
}
