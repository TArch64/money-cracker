import type { MessageCreateParamsNonStreaming } from '@anthropic-ai/sdk/resources/messages';
import { parseClaudeJsonMessage, stringifyJsonSchema, useClaudeClient } from '@/hooks/claude';
import { useCategoriesListQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { useLocaleCodeQuery } from '@/locale';
import { withRetries } from '@/helpers/withRetries';
import { createParserAnalyzerPrompt, createParserFormatterPrompt } from './parserPrompt';
import { createParserSchema, type PhotoParserResult } from './parserSchema';

export interface IImportParser {
  parse: (image: string) => Promise<PhotoParserResult>;
}

export function useImportParser(): IImportParser {
  const claudeClient = useClaudeClient();
  const localeQuery = useLocaleCodeQuery();

  const categoriesQuery = useCategoriesListQuery({
    subkey: ['import-photo', 'categories'],
    type: RecordType.EXPENSE,
    select: (data) => data.map((category) => category.name),
  });

  async function analyzeImage(image: string): Promise<string> {
    const messageParams: MessageCreateParamsNonStreaming = {
      stream: false,
      max_tokens: 1000,
      model: 'claude-3-7-sonnet-latest',
      system: createParserAnalyzerPrompt(),

      messages: [
        {
          role: 'user',

          content: [
            {
              type: 'image',

              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            },

            {
              type: 'text',
              text: 'Extract transaction data and categorize products.',
            },
          ],
        },
      ],
    };

    return withRetries({
      limit: 3,

      perform: async () => {
        const message = await claudeClient.messages.create(messageParams);
        return message.content.find((block) => block.type === 'text')!.text;
      },
    });
  }

  async function format(info: string): Promise<PhotoParserResult> {
    const schema = createParserSchema({
      categories: categoriesQuery.data,
    });

    const prompt = createParserFormatterPrompt({
      locale: localeQuery.data!,
      schema: stringifyJsonSchema(schema),
      categories: categoriesQuery.data,
    });

    const messageParams: MessageCreateParamsNonStreaming = {
      stream: false,
      max_tokens: 1000,
      model: 'claude-3-7-sonnet-latest',
      system: prompt.system,

      messages: [
        {
          role: 'user',

          content: [
            {
              type: 'text',
              text: info,
            },

            {
              type: 'text',
              text: prompt.user,
            },
          ],
        },
      ],
    };

    return withRetries({
      limit: 3,

      perform: async () => {
        const message = await claudeClient.messages.create(messageParams);
        return parseClaudeJsonMessage(schema, message);
      },
    });
  }

  async function parse(image: string): Promise<PhotoParserResult> {
    return format(await analyzeImage(image));
  }

  return { parse };
}
