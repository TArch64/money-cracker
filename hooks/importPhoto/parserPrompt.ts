export const createParserAnalyzerPrompt = () => `
Look at this image and extract the financial transaction information.

Please provide only:
1. Transaction date in YYYY-MM-DD format (if visible)
2. Group all items into general categories and calculate the total for each category

Format your response like this:
- Date: YYYY-MM-DD (if found)
- Categories: 
  * Category1: total amount
  * Category2: total amount
  * etc.

Use general categories like "food", "clothing", "transportation", etc. Don't worry about specific formatting requirements - just organize the information clearly.
`;

export interface IParserFormatterPromptOptions {
  locale: string;
  schema: string;
  categories: string[];
}

export interface IParserPrompt {
  system: string;
  user: string;
}

const withCategoriesSystemFormatterPrompt = (options: IParserFormatterPromptOptions) => `
Based on the transaction information you described earlier, organize the data according to these specifications:

CATEGORIES: Use ONLY these EXACT category names without translation: ${JSON.stringify(options.categories)}

Instructions:
1. Extract the transaction date in YYYY-MM-DD format (if present in the data)
2. Assign each item to one of the exact categories listed above
3. Only if an item clearly doesn't fit any existing category, create a new category in \${locale} language
4. Calculate total amount spent in each category

Return this JSON structure:
${options.schema}

Rules:
- Never modify the existing category names in any way
- Only include categories that have items in them
- Only add "new": true for newly created categories
- Create new categories only when absolutely necessary
- New categories should be general (e.g., "food" not "snacks")
- If no transaction data is found, return only: {"categoryExpenses": []}
- Omit "transactionDate" if no date information exists
- Response language should match "${options.locale}"

<IMPORTANT>Create BROAD, GENERAL budget categories (examples in English: food, clothes, housing, transport, entertainment, utilities) instead of specific ones (examples in English: dining out, beverages, drinks).</IMPORTANT>
`;

const withoutCategoriesSystemFormatterPrompt = (options: IParserFormatterPromptOptions) => `
Based on the transaction information you described earlier, organize the data according to these specifications:

Instructions:
1. Extract the transaction date in YYYY-MM-DD format (if present in the data)
2. Create general budget categories in "${options.locale}" language to group the items
3. Assign each item to the most appropriate category
4. Calculate total amount spent in each category

Return this JSON structure:
${options.schema}

Rules:
- Create broad, general budget categories (examples: food, clothing, housing, transportation, entertainment)
- Use simple, singular nouns for category names when possible
- Prefer fewer, more general categories over many specific ones
- Mark ALL categories with "new": true since all are newly created
- If no transaction data was found, return only: {"categoryExpenses": []}
- Omit "transactionDate" if no date information exists
- Response language should match "${options.locale}"

<IMPORTANT>Create BROAD, GENERAL budget categories (examples in English: food, clothes, housing, transport, entertainment, utilities) instead of specific ones (examples in English: dining out, beverages, drinks).</IMPORTANT>
`;

const withCategoriesUserFormatterPrompt = 'Extract transaction data and categorize products, creating new categories as needed.';
const withoutCategoriesUserFormatterPrompt = 'Extract transaction data and categorize products.';

export function createParserFormatterPrompt(options: IParserFormatterPromptOptions): IParserPrompt {
  return options.categories.length
    ? { system: withCategoriesSystemFormatterPrompt(options), user: withCategoriesUserFormatterPrompt }
    : { system: withoutCategoriesSystemFormatterPrompt(options), user: withoutCategoriesUserFormatterPrompt };
}
