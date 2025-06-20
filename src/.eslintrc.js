module.exports = {
  rules: {
    // Relax rules for framework code
    'no-unused-vars': 'off',
    'no-undef': 'warn',
    'no-inner-declarations': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    'no-async-promise-executor': 'warn',
    'playwright/no-networkidle': 'off',
    'playwright/no-wait-for-timeout': 'off',
    'playwright/no-element-handle': 'off',
    'playwright/no-eval': 'off',
    'playwright/no-conditional-in-test': 'off',
    'playwright/no-skipped-test': 'off',
    'playwright/no-useless-await': 'off'
  }
};