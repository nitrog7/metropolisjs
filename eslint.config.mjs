import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  importPlugin.flatConfigs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'comma-dangle': ['error', 'never'],
      'import/default': 'off',
      'import/export': 'error',
      'import/exports-last': 'off',
      'import/extensions': ['error', 'never', {
        'css': 'always',
        'json': 'always',
        'svg': 'always',
        'types': 'always'
      }],
      'import/first': 'error',
      'import/named': 'off',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-deprecated': 'warn',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          'devDependencies': [
            '**/__tests__/*',
            '**/__tests__/**/*',
            '**/tests/*',
            '**/tests/**/*',
            '**/*.test.js*',
            '**/*.spec.js*',
            '**/*.test.ts*',
            '**/*.spec.ts*',
            'jest.setup.js',
            '**/*.config.*'
          ],
          'peerDependencies': true
        }
      ],
      'import/no-internal-modules': 'off',
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'warn',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'off',
      'import/no-useless-path-segments': 'error',
      'import/no-webpack-loader-syntax': 'off',
      'import/order': [
        'error',
        {
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          },
          'groups': [
            ['builtin', 'external', 'internal'],
            ['parent', 'sibling', 'index'],
            'type'
          ],
          'newlines-between': 'always'
        }
      ],
      'import/prefer-default-export': 'off',
      'indent': ['error', 2, {
        'SwitchCase': 1
      }],
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-trailing-spaces': 'error',
      'prefer-const': 'error',
      'quotes': ['error', 'single'],
      'semi': 'error',
      'sort-imports': 'off'
    }
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }]
    }
  }
]);