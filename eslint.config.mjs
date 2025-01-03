import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import checkTestsExistPlugin from './eslint-rules/index.mjs';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  
  {ignores: ["core", "tests", "coverage", "dist", "types", "prod", "**/babel.config.js", "**/build.js","**/vite.config.js", "src/quasar/quasar-init.ts","**/vitest.config.ts","config/*"]},
  {
    files: ["**/*.{ts,vue}"],
    plugins: {
      'custom-rules': checkTestsExistPlugin, 
    },
    rules: {
      // 'custom-rules/check-tests-exist': 'warn', //temporary disabled
    },
    settings: {
      srcDir: './src',
      testDir: './tests'
    },
  },
];