/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  globals: {
    shopify: "readonly",
    BigInt: "readonly"
  },
  settings: {
    jest: {
      version: 29,
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/no-duplicates": "warn",
    "import/first": "warn",
    "@typescript-eslint/no-use-before-define": "warn"
  }
};
