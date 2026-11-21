import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import react from "@eslint-react/eslint-plugin";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y-x";
import globals from "globals";
import { domainBoundary } from "./tools/eslint/domain-boundary.mjs";

export default defineConfig([
  globalIgnores([".local/**", ".next/**", ".next-admin-test/**", ".next-preview/**", "out/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
      "@eslint-react": react,
      "react-hooks": hooks,
      "jsx-a11y-x": a11y,
    },
    // Keep rootDir unset: this single-package app uses cwd, not root globs.
    settings: { "jsx-a11y-x": { components: { Image: "img", Link: "a" } } },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      // Correctness checks; avoid duplicating Hooks rules or imposing API migrations.
      "@eslint-react/no-missing-key": "error",
      "@eslint-react/no-missing-component-display-name": "error",
      "@eslint-react/no-direct-mutation-state": "error",
      "@eslint-react/no-nested-component-definitions": "error",
      "@eslint-react/jsx-no-children-prop-with-children": "error",
      "@eslint-react/jsx-no-comment-textnodes": "error",
      "@eslint-react/jsx-no-namespace": "error",
      "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
      "@eslint-react/dom-no-void-elements-with-children": "error",
      "@eslint-react/dom-no-unknown-property": "error",
    },
  },
  {
    files: ["src/domain/**/*.{ts,tsx,js,mjs,cjs}"],
    plugins: { architecture: { rules: { "domain-boundary": domainBoundary } } },
    rules: {
      "architecture/domain-boundary": "error",
      "no-restricted-globals": ["error", "fetch", "window", "document", "process", "globalThis", "global", "console", "Date", "performance", "crypto", "setTimeout", "setInterval", "WebSocket", "XMLHttpRequest", "eval", "Function"],
      "no-restricted-properties": ["error", { object: "Math", property: "random", message: "Pass explicit deterministic inputs into the domain." }],
    },
  },
]);
