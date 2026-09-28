import globals from 'globals';

export default [
  // Imported legacy code is kept verbatim until it is rewritten (CONTRIBUTING.md 1.3).
  { ignores: ['src/legacy/**'] },
  {
    files: ['src/**/*.js', 'shared/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser, __VERSION__: 'readonly' },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-restricted-globals': ['error', { name: '$', message: 'Use window.jQuery explicitly, only for Shoptet plugin interop.' }],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.node },
  },
];
