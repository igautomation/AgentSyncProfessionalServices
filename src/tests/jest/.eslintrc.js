module.exports = {
  env: {
    jest: true
  },
  rules: {
    // Relax rules for Jest test files
    'no-undef': 'off',
    'playwright/no-conditional-in-test': 'off'
  }
};