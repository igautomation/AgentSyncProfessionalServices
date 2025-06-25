# AgentSync Professional Services Framework

## Overview

The AgentSync Professional Services Framework is a comprehensive test automation solution built on Playwright. It provides tools, utilities, and patterns for creating reliable, maintainable automated tests for web applications with special support for Salesforce.

## Quick Links

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Key Features](#key-features)
- [Framework Structure](#framework-structure)
- [Salesforce Testing](#salesforce-testing)
- [API Testing](#api-testing)
- [Documentation](#documentation)

## Installation

```bash
# Install from GitHub Packages
npm install @igautomation/agentsyncprofessionalservices

# Or clone and install locally
git clone https://github.com/igautomation/agentsyncprofessionalservices.git
cd agentsyncprofessionalservices
npm install
```

For detailed installation instructions, see the [Installation Guide](docs/user-guide/INSTALLATION.md).

## Getting Started

1. **Set up your environment**:
   ```bash
   # Initialize a new project
   npx agentsync init
   ```

2. **Create your first test**:
   ```javascript
   // tests/example.spec.js
   const { test, expect } = require('@playwright/test');
   
   test('Basic test', async ({ page }) => {
     await page.goto('https://example.com');
     await expect(page).toHaveTitle(/Example Domain/);
   });
   ```

3. **Run your tests**:
   ```bash
   npx playwright test
   ```

For a more detailed guide, see the [Quick Start Guide](docs/user-guide/QUICK_START.md).

## Key Features

- **Multi-browser Testing**: Chrome, Firefox, Safari
- **Page Object Model**: Structured approach to UI testing
- **Salesforce Integration**: Specialized tools for Salesforce testing
- **API Testing**: Built-in support for API testing
- **Reporting**: Comprehensive test reporting
- **Multi-project Support**: Use across multiple projects

## Framework Structure

```
agentsyncprofessionalservices/
├── bin/                  # CLI tools
├── src/
│   ├── config/           # Configuration files
│   ├── fixtures/         # Test fixtures
│   ├── pages/            # Page objects
│   ├── tests/            # Example tests
│   └── utils/            # Utility functions
├── templates/            # Project templates
└── docs/
    └── user-guide/       # User documentation
```

## Salesforce Testing

The framework includes specialized support for Salesforce testing:

```javascript
// Example Salesforce test
const { test } = require('@playwright/test');
const { loginToSalesforce } = require('@igautomation/agentsyncprofessionalservices/salesforce');

test('Create account in Salesforce', async ({ page }) => {
  await loginToSalesforce(page);
  // Test implementation
});
```

For more information, see the [Salesforce Testing Guide](docs/user-guide/README-SALESFORCE-TESTS.md).

## API Testing

```javascript
// Example API test
const { test, expect } = require('@playwright/test');
const { apiRequest } = require('@igautomation/agentsyncprofessionalservices/utils');

test('API test example', async () => {
  const response = await apiRequest.get('https://api.example.com/users');
  expect(response.status()).toBe(200);
});
```

## Documentation

- [User Guide](docs/user-guide/index.md) - Complete user documentation
- [Consolidated Guide](docs/CONSOLIDATED_USER_GUIDE.md) - All documentation in a single file
- [Salesforce Test Improvements](docs/user-guide/salesforce-test-improvements.md) - Salesforce testing best practices
- [Environment Variables](docs/user-guide/ENVIRONMENT_VARIABLES.md) - Configuration options

## Support

For support, please contact the AgentSync Professional Services team.

## License

MIT