module.exports = {
  cliOptions: {
    format: require.resolve('eslint-formatter-pretty'),
    rules: {
      'import/no-unresolved': 2,
      'prettier/prettier': [
        'error',
        { trailingComma: 'es5', singleQuote: true },
      ],
    },
  },
};
