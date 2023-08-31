module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    ecmaVersion: 2022,
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint",
    "node",
    "prettier",
    "sonarjs",
    "unicorn",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",

    "prettier/prettier": "error",

    "node/exports-style": ["error", "module.exports"],
    "node/file-extension-in-import": ["error", "always"],
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error",
    "node/no-unsupported-features/es-syntax": [
      "error",
      {
        ignores: ["modules"],
      },
    ],
    "node/no-missing-import": [
      "error",
      {
        allowModules: [],
        resolvePaths: ["src"],
        tryExtensions: [".js", ".ts", ".json"],
      },
    ],
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: ["@nestjs/testing", "supertest"],
      },
    ],
  },
};
