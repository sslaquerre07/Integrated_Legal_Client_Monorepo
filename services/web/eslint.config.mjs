import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // 1. Next.js Core Web Vitals and TS configs
  ...nextVitals,
  ...nextTs,

  // 2. Base & TypeScript Recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Custom rules and parser options for Next.js app files
  {
    files: ["**/src/**/*.ts", "**/src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
    },
  },

  // 4. Global ignores (overriding / extending Next.js defaults)
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
];