import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // Le préfixe _ marque un paramètre volontairement inutilisé (signature imposée par un contrat).
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off"
    }
  },
  // Scripts Node CommonJS (.cjs) : require() y est la norme, pas une erreur.
  {
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sortie compilée des scripts Node (test:brik / build:*-brik) — pas du source.
    ".brik-build/**",
    // Bundles générés par build:sdk / build:hf-space — du minifié, pas du source.
    "public/sdk.js",
    "public/sdk-*.js",
    "packages/sdk/dist/**",
    ".hf-space/**",
  ]),
]);

export default eslintConfig;
