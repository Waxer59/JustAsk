module.exports = {
  globals: {
    NodeJS: true,
    NodeListOf: true
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
    "prettier"
  ],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"]
      },
      rules: {}
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {}
};
