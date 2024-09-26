module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    // "next",
  ],
  ignorePatterns: ["dist", "*.cjs"],
  parser: "@typescript-eslint/parser",

  // TODO change no-console property
  rules: {
    "no-var": "error",
    "@typescript-eslint/no-explicit-any": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { args: "after-used" }],
    "no-empty-function": "error",
    "@typescript-eslint/no-empty-function": ["error"],
    "@typescript-eslint/no-this-alias": ["error"],
    "prettier/prettier": ["error"],
    "max-len": [
      "error",
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};
