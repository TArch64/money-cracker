import {
  ClaudeMediaType,
  ClaudeMessageRole,
  ClaudeModel,
  type IClaudeMessageCreateParams,
  parseClaudeJsonMessage,
  stringifyJsonSchema,
  useClaudeClient,
} from '@/hooks/claude';
import { useCategoriesListQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { useLocaleCodeQuery } from '@/locale';
import { withRetries } from '@/helpers/withRetries';
import { createParserPrompt } from './parserPrompt';
import { createParserSchema, type PhotoParserResult } from './parserSchema';

export interface IImportParser {
  parse: (image: string) => Promise<any>;
}

export function useImportParser(): IImportParser {
  const claudeClient = useClaudeClient();
  const localeQuery = useLocaleCodeQuery();

  const categoriesQuery = useCategoriesListQuery({
    subkey: ['import-photo', 'categories'],
    type: RecordType.EXPENSE,
    select: (data) => data.map((category) => category.name),
  });

  async function parse(image: string): Promise<PhotoParserResult> {
    const schema = createParserSchema({
      categories: categoriesQuery.data,
    });

    const prompt = createParserPrompt({
      locale: localeQuery.data!,
      schema: stringifyJsonSchema(schema),
      categories: categoriesQuery.data,
    });

    const messageParams: IClaudeMessageCreateParams = {
      maxTokens: 1000,
      model: ClaudeModel.V3_7_SONNET,
      system: prompt.system,

      messages: [
        {
          role: ClaudeMessageRole.USER,

          content: [
            {
              type: 'image',

              source: {
                type: 'base64',
                media_type: ClaudeMediaType.IMAGE_JPEG,
                data: image,
              },
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

  return { parse };
}
