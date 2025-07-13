module.exports = {
  env: {
    browser: true
  },
  rules: {
    'no-undef': 'off',
    'playwright/no-networkidle': 'off',
    'playwright/no-wait-for-timeout': 'off',
    'playwright/no-element-handle': 'off',
    'playwright/no-eval': 'off'
  }
};