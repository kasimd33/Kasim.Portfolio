import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
export default [
 { ignores: ['dist/**','node_modules/**','artifacts/**','.npm-cache/**'] },
 { files: ['**/*.{js,jsx,mjs,ts,tsx}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: {...globals.browser,...globals.node}, parserOptions: { ecmaFeatures: { jsx: true } } }, plugins: {'react-hooks':reactHooks,'react-refresh':reactRefresh}, rules: { ...js.configs.recommended.rules, ...reactHooks.configs.recommended.rules, 'no-unused-vars':['error',{varsIgnorePattern:'^[A-Z_]',argsIgnorePattern:'^_'}], 'react-hooks/set-state-in-effect':'off', 'react-refresh/only-export-components':['warn',{allowConstantExport:true}] } },
 { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tsParser }, rules: { 'no-unused-vars': 'off', 'no-undef': 'off' } }
];
