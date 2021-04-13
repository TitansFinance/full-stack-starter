module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'quotes': [ 2, 'single', { allowTemplateLiterals: true } ],
    'comma-dangle': [
      'error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'ignore'
      },
    ],
    'no-extra-semi': 'error',
    'semi': ['error', 'never'],
    'jsx-quotes': ['error', 'prefer-double'],
    'indent': ['error', 2, { SwitchCase: 1 }],
  },

  overrides: [],
}
