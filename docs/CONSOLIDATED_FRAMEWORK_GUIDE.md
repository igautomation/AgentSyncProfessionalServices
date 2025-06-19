# Playwright Testing Framework - Consolidated Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Framework Architecture](#framework-architecture)
4. [Key Features](#key-features)
5. [Running Tests](#running-tests)
6. [Core Components](#core-components)
7. [Utility Modules](#utility-modules)
8. [Salesforce Integration](#salesforce-integration)
9. [CI/CD Integration](#cicd-integration)
10. [Docker Support](#docker-support)
11. [Customization](#customization)
12. [Troubleshooting](#troubleshooting)
13. [Reference](#reference)

## Introduction

This comprehensive Playwright testing framework provides a robust set of tools and utilities for end-to-end testing of web applications, APIs, and Salesforce. It's designed to be extensible, maintainable, and easy to use.

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd AgentSyncProfessionalServices

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy the example environment file
cp .env.example .env

# Edit .env with your specific credentials and URLs
```

### Required Environment Variables for Salesforce Testing

```
SF_USERNAME=your_username
SF_PASSWORD=your_password
SF_LOGIN_URL=https://login.salesforce.com
SF_INSTANCE_URL=https://your-instance.lightning.force.com
SF_SECURITY_TOKEN=your_security_token
```

## Framework Architecture

The framework follows a modular architecture with clear separation of concerns:

```
playwright-framework/
├── src/                    # Source code
│   ├── cli/                # Command-line interface tools
│   ├── config/             # Configuration files
│   ├── core/               # Core framework functionality
│   ├── pages/              # Page objects
│   │   └── salesforce/     # Salesforce page objects
│   ├── tests/              # Test files
│   │   ├── accessibility/  # Accessibility tests
│   │   ├── api/            # API tests
│   │   ├── e2e/            # End-to-end tests
│   │   └── salesforce/     # Salesforce tests
│   └── utils/              # Utility modules
│       ├── accessibility/  # Accessibility testing utilities
│       ├── api/            # API testing utilities
│       ├── common/         # Common utilities
│       ├── salesforce/     # Salesforce utilities
│       └── web/            # Web testing utilities
├── custom/                 # Client customizations
├── data/                   # Test data
├── docs/                   # Documentation
├── examples/               # Example tests
├── scripts/                # Helper scripts
└── templates/              # Project templates
```

## Key Features

### 1. Cross-browser Testing
- Chrome, Firefox, Safari, and Edge support
- Consistent behavior across browsers
- Parallel execution

### 2. API Testing
- REST and GraphQL API testing capabilities
- Response validation
- Authentication handling

### 3. Accessibility Testing
- Automated accessibility audits
- WCAG compliance checking
- Detailed violation reporting

### 4. Performance Testing
- Core Web Vitals measurement
- Performance regression detection
- Detailed timing analysis

### 5. Visual Testing
- Screenshot comparison
- Visual diff highlighting
- Baseline management

### 6. Salesforce Integration
- Specialized utilities for Salesforce testing
- Authentication and API integration
- UI automation

### 7. Data-Driven Testing
- Support for multiple data formats (CSV, JSON, YAML)
- Data generation utilities
- External data source integration

### 8. Self-Healing Locators
- Automatic recovery from broken selectors
- Alternative selector strategies
- DOM proximity analysis

### 9. Reporting
- HTML, Allure, and custom reports
- Test history tracking
- Failure analysis

### 10. Mobile Testing
- Mobile browser emulation
- Responsive testing
- Device-specific tests

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run specific test types
npm run test:e2e            # End-to-end tests
npm run test:api            # API tests
npm run test:accessibility  # Accessibility tests
npm run test:salesforce     # Salesforce tests

# Run tests with specific browser
npx playwright test --project=chromium
```

### Test Filtering

```bash
# Run tests with specific tag
npx playwright test --grep "@smoke"

# Run tests excluding specific tag
npx playwright test --grep-invert "@slow"
```

### Test Reporting

```bash
# View test reports
npm run report

# Generate and open HTML report
npx playwright show-report
```

## Core Components

### Page Objects

Page objects represent web pages with their elements and actions:

```javascript
// src/pages/LoginPage.js
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
```

### Test Files

Test files contain the actual test scenarios:

```javascript
// src/tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login functionality', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password');
    
    // Assertions
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

## Utility Modules

The framework provides various utility modules to simplify test development:

### Directory Structure

```
utils/
├── accessibility/    # Accessibility testing utilities
├── api/              # API testing utilities
├── common/           # Common utilities
├── web/              # Web testing utilities
└── [other]/          # Additional specialized utilities
```

### API Testing

```javascript
const { ApiClient } = require('../../utils/api');

// Create API client
const apiClient = new ApiClient('https://api.example.com');

// Make requests
const response = await apiClient.get('/users/1');
const user = await apiClient.post('/users', { name: 'John', job: 'Developer' });
```

### Web Utilities

```javascript
const { WebInteractions } = require('../../utils/web');
const { ScreenshotUtils } = require('../../utils/web');
const { SelfHealingLocator } = require('../../utils/web');

// Web interactions
const webInteractions = new WebInteractions(page);
await webInteractions.click('#submit-button');

// Screenshot utilities
const screenshotUtils = new ScreenshotUtils(page);
await screenshotUtils.takeScreenshot('homepage');

// Self-healing locator
const loginButton = new SelfHealingLocator(page, [
  '#login-button',
  '.login-btn',
  'button:has-text("Login")',
]);
await loginButton.click();
```

### Accessibility Testing

```javascript
const { checkAccessibility } = require('../../utils/accessibility');

// Check accessibility
const result = await checkAccessibility(page, {
  includedImpacts: ['critical', 'serious'],
});

// Handle results
if (!result.passes) {
  console.log(`Found ${result.violations.length} accessibility violations`);
}
```

### Common Utilities

```javascript
const { Logger } = require('../../utils/common');
const { TestDataFactory } = require('../../utils/common');

// Logging
Logger.info('Test started');

// Test data generation
const user = TestDataFactory.createUser({
  role: 'admin',
});
```

## Salesforce Integration

### Salesforce Page Objects

The framework includes specialized page objects for Salesforce:

```javascript
const AppLauncherPage = require('../../pages/salesforce/AppLauncherPage');
const ContactPage = require('../../pages/salesforce/ContactPage');

test('Create a new contact', async ({ page }) => {
  // Initialize page objects
  const appLauncherPage = new AppLauncherPage(page);
  const contactPage = new ContactPage(page);

  // Navigate to Accounts app
  await appLauncherPage.navigateToAccounts();

  // Create a new contact
  await contactPage.createContact(contactData);
  
  // Verify success
  const isSuccess = await contactPage.verifyContactCreated();
  await expect(isSuccess).toBeTruthy();
});
```

### Salesforce API Integration

```javascript
const { SalesforceClient } = require('../../utils/salesforce');

// Create Salesforce client
const sfClient = new SalesforceClient({
  username: process.env.SF_USERNAME,
  password: process.env.SF_PASSWORD,
  loginUrl: process.env.SF_LOGIN_URL,
});

// Use Salesforce API
await sfClient.login();
const accounts = await sfClient.query('SELECT Id, Name FROM Account LIMIT 10');
```

### Key Salesforce Page Objects

- **BaseSalesforcePage**: Base class with common Salesforce functionality
  - `waitForPageLoad()`: Wait for Salesforce page to load
  - `getToastMessage()`: Get toast message content
  - `isToastVisible(partialText)`: Check if toast message is visible

- **LoginPage**: Handles authentication
  - `navigate(loginUrl)`: Navigate to login page
  - `login(username, password)`: Login to Salesforce

- **AppLauncherPage**: Handles navigation through the App Launcher
  - `navigateToApp(appName)`: Navigate to an app using the App Launcher
  - `navigateToAccounts()`: Navigate specifically to the Accounts app
  - `navigateToContacts()`: Navigate specifically to the Contacts app

- **ContactPage**: Handles contact creation and management
  - `createContact(contactData)`: Create a new contact
  - `verifyContactCreated()`: Verify contact was created successfully

## CI/CD Integration

### GitHub Actions

The framework includes GitHub Actions workflows for automated testing:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: reports
          path: |
            playwright-report/
            test-results/
```

## Docker Support

### Docker Compose

```yaml
# docker-compose.yml
services:
  playwright:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - BASE_URL=${BASE_URL:-https://example.com}
      - HEADLESS=${HEADLESS:-true}
```

### Running with Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Run with specific environment variables
BASE_URL=https://example.com HEADLESS=true docker-compose up
```

## Customization

The framework can be extended through the `custom/` directory:

### Custom Plugins

```javascript
// custom/plugins/my-plugin.js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }
  
  initialize() {
    // Plugin initialization
  }
}

module.exports = MyPlugin;
```

### Custom Fixtures

```javascript
// custom/fixtures/my-fixture.js
const { test: baseTest } = require('@playwright/test');

const test = baseTest.extend({
  myFixture: async ({}, use) => {
    // Setup fixture
    const fixture = { /* ... */ };
    
    // Use fixture
    await use(fixture);
    
    // Teardown fixture
  }
});

module.exports = { test };
```

### Custom Reporters

```javascript
// custom/reporters/my-reporter.js
class MyReporter {
  onBegin(config, suite) {
    console.log('Starting the run with config:', config);
  }

  onTestBegin(test) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test, result) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result) {
    console.log(`Finished the run: ${result.status}`);
  }
}

module.exports = MyReporter;
```

### Custom Page Objects

```javascript
// custom/pages/my-page.js
const { BasePage } = require('../../src/pages/BasePage');

class MyPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors
    this.selectors = {
      // Add your selectors here
    };
  }
}

module.exports = MyPage;
```

## Troubleshooting

### Common Issues

1. **"Cannot find module 'dotenv'" error**
   ```bash
   npm install
   ```

2. **GitHub Actions failing**
   - Ensure all dependencies are in package.json
   - Check that workflow files reference correct directories
   - Verify environment variables are set correctly

3. **Missing Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Tests not finding elements**
   - Check if `.env` file exists and has correct URLs
   - Verify network connectivity to test sites

### Verification Test

```bash
# Run a simple test to verify setup
npx playwright test --list | head -5
```

## Reference

### Environment Variables

Key environment variables used by the framework:

| Variable | Description | Default |
|----------|-------------|---------|
| BASE_URL | Base URL for tests | https://example.com |
| HEADLESS | Run browsers in headless mode | true |
| API_BASE_URL | Base URL for API tests | https://api.example.com |
| SF_USERNAME | Salesforce username | - |
| SF_PASSWORD | Salesforce password | - |
| SF_LOGIN_URL | Salesforce login URL | https://login.salesforce.com |
| SF_INSTANCE_URL | Salesforce instance URL | - |
| SF_SECURITY_TOKEN | Salesforce security token | - |
| AXE_CORE_CDN | URL to axe-core library | https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js |

### Design Principles

1. **Configurability**: All external resources (URLs, credentials, etc.) are configurable through environment variables or configuration files.

2. **Modularity**: Each utility focuses on a specific concern and can be used independently.

3. **Reusability**: Utilities are designed to be reused across different tests and projects.

4. **Testability**: All utilities can be easily tested in isolation.

5. **Documentation**: All utilities are well-documented with JSDoc comments.

### Useful Commands

```bash
# Run all tests
npm test

# Run tests with UI mode
npx playwright test --ui

# Generate tests with Playwright Codegen
npx playwright codegen https://example.com

# Show HTML report
npx playwright show-report
```

### Best Practices

1. Use page objects for UI interactions
2. Use data-driven testing for multiple scenarios
3. Use self-healing locators for resilient tests
4. Add proper error handling and screenshots on failure
5. Use explicit waits for dynamic UI elements
6. Keep tests independent and isolated
7. Use environment variables for configuration
8. Add verification steps to confirm test actions
9. Use role-based selectors for better resilience
10. Keep page objects focused on UI interactions