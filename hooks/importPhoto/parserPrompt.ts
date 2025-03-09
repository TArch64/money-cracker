export interface IParserPromptOptions {
  locale: string;
  schema: string;
  categories: string[];
}

export interface IParserPrompt {
  system: string;
  user: string;
}

const withCategoriesSystemPrompt = (options: IParserPromptOptions) => `
CRITICAL INSTRUCTION: Use ONLY these EXACT category names without translation: ${JSON.stringify(options.categories)}

Analyze the receipt image for personal budget tracking:
1. Extract transaction date (format: YYYY-MM-DD) if present
2. Categorize each item using ONLY the exact categories listed above
3. Create new categories in ${options.locale} language ONLY if an item doesn't fit any existing category

Return this JSON structure:
${options.schema}

Context: This analysis is for a personal budget management app where users track their spending by categories.

Rules:
- Return ONLY parsed data in the JSON format according to provided schema
- Never translate or modify the provided category names
- Only include categories that have items in them
- When creating new categories, check if a similar category already exists in the list above
- Only add "new": true for newly created categories
- If no transaction data is found, return only: {"categoryExpenses": []}
- Omit "transactionDate" if no date information exists

<IMPORTANT>Create BROAD, GENERAL budget categories (examples in English: food, clothes, housing, transport, entertainment, utilities) instead of specific ones (examples in English: dining out, beverages, drinks).</IMPORTANT>
`;

const withoutCategoriesSystemPrompt = (options: IParserPromptOptions) => `
Analyze the receipt image for personal budget tracking.

Instructions:
1. Extract transaction date (format: YYYY-MM-DD) if present
2. Identify all products/items and their costs
3. Create appropriate categories for all items in "${options.locale}" language
4. All category names should be in "${options.locale}" language

Return this JSON structure:
${options.schema}

Context: This analysis is for a personal budget management app where users track their spending. You are creating initial categories for a new user.

Rules:
- Return ONLY parsed data in the JSON format according to provided schema
- Use simple, singular nouns for category names when possible
- Avoid overly specific categories (e.g. use "food" instead of "dining out", "beverages", or "drinks")
- Mark ALL categories with "new": true since all are newly created
- If no transaction data is found, return only: {"categoryExpenses": []}
- Omit "transactionDate" if no date information exists
- Only include categories with non-zero totals
- Response language should match "${options.locale}"

<IMPORTANT>Create BROAD, GENERAL budget categories (examples in English: food, clothes, housing, transport, entertainment, utilities) instead of specific ones (examples in English: dining out, beverages, drinks).</IMPORTANT>
`;

const withCategoriesUserPrompt = 'Extract transaction data and categorize products, creating new categories as needed.';
const withoutCategoriesUserPrompt = 'Extract transaction data and categorize products.';

export function createParserPrompt(options: IParserPromptOptions): IParserPrompt {
  return options.categories.length
    ? { system: withCategoriesSystemPrompt(options), user: withCategoriesUserPrompt }
    : { system: withoutCategoriesSystemPrompt(options), user: withoutCategoriesUserPrompt };
}
