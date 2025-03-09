import type { Message, MessageCreateParamsNonStreaming } from '@anthropic-ai/sdk/resources/messages';
import { useUserQuery } from '@/hooks/queries';

export interface IClaudeClient {
  messages: {
    create: (message: MessageCreateParamsNonStreaming) => Promise<Message>;
  };
}

export function useClaudeClient(): IClaudeClient {
  const userQuery = useUserQuery();

  async function create(params: MessageCreateParamsNonStreaming): Promise<Message> {
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

      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  }

  return { messages: { create } };
}
