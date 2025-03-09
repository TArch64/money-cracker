import {
  array,
  boolean,
  description,
  forward,
  isoDate,
  minLength,
  minValue,
  number,
  object,
  optional,
  partialCheck,
  pipe,
  string,
  transform,
} from 'valibot';

export interface ISchemaOptions {
  categories: string[];
}

export const createParserSchema = (options: ISchemaOptions) => object({
  transactionDate: optional(pipe(
    string(),
    isoDate(),
    description('Date of the transaction in ISO format without time'),
  )),
  categoryExpenses: array(pipe(
    object({
      category: pipe(
        string(),
        minLength(1),
        description('Name of the category'),
      ),
      new: optional(pipe(
        boolean(),
        description('Whether the category is new. If true, the category will be created'),
      )),
      total: pipe(
        number(),
        minValue(0.01),
        description('Total amount of expenses in the category'),
      ),
    }),
    forward(
      partialCheck(
        [['category'], ['new']],
        (input) => input.new || options.categories.includes(input.category),
        'Category name is not listed in existing categories',
      ),
      ['category'],
    ),
    transform((input) => ({
      ...input,
      new: !options.categories.includes(input.category),
    })),
  )),
});
