import pluginJs from '@eslint/js';
import pluginTseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginStylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import pluginImport from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,ts,tsx}'],
    ignores: ['ios', 'android', '.expo'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginTseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginStylistic.configs.customize({
    flat: true,
    semi: true,
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    plugins: {
      ...pluginImport.flatConfigs.recommended.plugins,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
        },
      ],
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
