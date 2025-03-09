import {
  ClaudeMediaType,
  ClaudeMessageRole,
  type IClaudeMessageCreateParams,
  useClauseJsonMessage,
} from '@/hooks/claude';
import { useCategoriesListQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { useLocaleCodeQuery } from '@/locale';
import { createParserPrompt } from '@/hooks/importPhoto/parserPrompt';
import { createParserSchema } from './parserSchema';

export interface IImportParser {
  parse: (image: string) => Promise<any>;
}

export function useImportParser(): IImportParser {
  const claudeJsonMessage = useClauseJsonMessage();
  const localeQuery = useLocaleCodeQuery();

  const categoriesQuery = useCategoriesListQuery({
    subkey: ['import-photo', 'categories'],
    type: RecordType.EXPENSE,
    select: (data) => data.map((category) => category.name),
  });

  async function parse(image: string): Promise<any> {
    await claudeJsonMessage.createMessage({
      retryLimit: 0,

      schema: createParserSchema({
        categories: categoriesQuery.data,
      }),

      message: (answerSchema): IClaudeMessageCreateParams => {
        const prompt = createParserPrompt({
          locale: localeQuery.data!,
          schema: answerSchema,
          categories: categoriesQuery.data,
        });

        return {
          maxTokens: 1000,
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
      },
    });
  }

  return { parse };
}
