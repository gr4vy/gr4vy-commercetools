module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "no-duplicate-imports": "error",
    "prefer-const": "error",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external"],
        "newlines-between": "always",
      },
    ],
  },
}
