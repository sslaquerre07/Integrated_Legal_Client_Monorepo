// packages/shared/types/eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Standard ESLint recommended rules
  js.configs.recommended,

  // TypeScript recommended rules (strict ruleset optimized for type packages)
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    rules: {
      // 1. Unused Variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 2. Consistent Type Imports (crucial for clean re-exports in shared packages)
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      // 3. Prevent export of 'any' types where possible
      "@typescript-eslint/no-explicit-any": "warn",

      // 4. Empty Interfaces (often used in type extension patterns, feel free to toggle)
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },

  {
    // Ignore build output and dependencies
    ignores: ["dist/**", "node_modules/**", "*.config.mjs"],
  }
];