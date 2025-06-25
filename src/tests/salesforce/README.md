# Salesforce Tests

This directory contains tests for Salesforce integration.

## Test Files

- **fixed-sf-login.spec.js**: Improved login test with better error handling and timeouts
- **fixed-account-contact.spec.js**: Reliable account and contact creation test using direct navigation
- **minimal-navigation.spec.js**: Diagnostic test for Salesforce navigation
- **salesforce-api-mock.spec.js**: Mock API tests for Salesforce

## Setup Files

- **global-setup.js**: Global setup for Salesforce tests

## Running Tests

```bash
# Run all Salesforce tests
npm run test:salesforce

# Run fixed tests only
npm run test:sf:fixed

# Run individual fixed tests
npm run test:sf:fixed:login
npm run test:sf:fixed:account
```

## Notes

- Original test files have been moved to the `backup` directory
- See `salesforce-test-improvements.md` in the project root for detailed information about test improvements