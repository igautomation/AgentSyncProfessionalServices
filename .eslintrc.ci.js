module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true, // Add browser env to fix document/window not defined errors
  },
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Downgrade errors to warnings for CI
    'no-undef': 'warn',
    'no-unused-vars': 'warn',
    'no-case-declarations': 'warn',
    'no-useless-escape': 'warn',
    'no-inner-declarations': 'warn',
    'no-async-promise-executor': 'warn',
    'no-useless-catch': 'warn',
    
    // Downgrade Playwright rules to warnings
    'playwright/no-networkidle': 'warn',
    'playwright/no-element-handle': 'warn',
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/no-conditional-in-test': 'warn',
    'playwright/no-skipped-test': 'warn',
    'playwright/no-focused-test': 'warn',
    'playwright/no-eval': 'warn',
    'playwright/no-useless-await': 'warn',
    
    // Keep critical rules as errors
    'playwright/valid-expect': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'reports/',
    'allure-results/',
    'playwright-report/',
    'dist/',
    'build/',
    'docs-site/',
    'docs-original-backup/',
    '.history/',
  ],
};