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
12. [Multi-Project Usage](#multi-project-usage)
13. [Troubleshooting](#troubleshooting)
14. [Reference](#reference)

## Introduction

This comprehensive Playwright testing framework provides a robust set of tools and utilities for end-to-end testing of web applications, APIs, and Salesforce. It's designed to be extensible, maintainable, and easy to use across multiple projects.

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Quick Setup

```bash
# Install the framework globally
npm install -g @agentsync/test-framework

# Create a new project
mkdir my-project
cd my-project
agentsync-framework init --name "My Project"

# Or install in an existing project
npm install @agentsync/test-framework
```

### Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your specific credentials and URLs
```

## Framework Architecture

The framework follows a modular architecture with clear separation of concerns:

```
framework/
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── pages/              # Page objects
│   ├── utils/              # Utility modules
│   │   ├── api/            # API testing utilities
│   │   ├── web/            # Web testing utilities
│   │   └── ...             # Other utilities
│   └── index.js            # Main exports
├── templates/              # Project templates
├── bin/                    # CLI tools
├── docs/                   # Documentation
└── scripts/                # Helper scripts
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
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = new SelfHealingLocator(page, '#username', {
      fallbackStrategies: [
        { selector: 'input[name="username"]' },
        { selector: 'input[type="email"]' }
      ]
    });
    this.passwordInput = new SelfHealingLocator(page, '#password');
    this.loginButton = new SelfHealingLocator(page, '#login-button');
  }

  async login(username, password) {
    const usernameElement = await this.usernameInput.locate();
    const passwordElement = await this.passwordInput.locate();
    const loginButtonElement = await this.loginButton.locate();
    
    await usernameElement.fill(username);
    await passwordElement.fill(password);
    await loginButtonElement.click();
  }
}

module.exports = LoginPage;
```

### Test Files

Test files contain the actual test scenarios:

```javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login functionality', () => {
  test('should login with valid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/login');
    await loginPage.login('user@example.com', 'password');
    
    // Assertions
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

## Utility Modules

The framework provides various utility modules to simplify test development:

### API Testing

```javascript
const { ApiClient } = require('@agentsync/test-framework').utils.api;

// Create API client
const apiClient = new ApiClient('https://api.example.com');

// Make requests
const response = await apiClient.get('/users/1');
const user = await apiClient.post('/users', { name: 'John', job: 'Developer' });
```

### Self-Healing Locators

```javascript
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

// Create a self-healing locator
const loginButton = new SelfHealingLocator(page, '#login-button', {
  fallbackStrategies: [
    { selector: '.login-btn' },
    { selector: 'button:has-text("Login")' },
    { selector: 'button.btn-primary' }
  ]
});

// Use the locator
const element = await loginButton.locate();
await element.click();
```

### Accessibility Testing

```javascript
const { checkAccessibility } = require('@agentsync/test-framework').utils.accessibility;

// Check accessibility
const result = await checkAccessibility(page, {
  includedImpacts: ['critical', 'serious'],
});

// Handle results
if (!result.passes) {
  console.log(`Found ${result.violations.length} accessibility violations`);
}
```

## Salesforce Integration

### Salesforce Page Objects

The framework includes specialized page objects for Salesforce:

```javascript
const { SalesforceLoginPage } = require('@agentsync/test-framework').pages.salesforce;

test('should login to Salesforce', async ({ page }) => {
  const loginPage = new SalesforceLoginPage(page);
  await loginPage.navigate();
  await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD);
  
  // Verify login was successful
  await expect(page).toHaveURL(/lightning/);
});
```

### Salesforce API Integration

```javascript
const { SalesforceClient } = require('@agentsync/test-framework').utils.salesforce;

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

## CI/CD Integration

### GitHub Actions

The framework includes GitHub Actions workflows for automated testing:

```yaml
# .github/workflows/framework-ci.yml
name: Framework CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
jobs:
  test-framework:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@agentsync'
      - name: Install dependencies
        run: npm ci
      - name: Create .env file
        run: cp .env.example .env
      - name: Run linting with CI config
        run: npx eslint --config .eslintrc.ci.js . --max-warnings 1000
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Run core tests
        run: npx playwright test src/tests/core/framework-validation.spec.js
      - name: Run API tests
        run: npx playwright test --project=api
        continue-on-error: true
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/
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

The framework can be extended through custom components:

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

### Custom Page Objects

```javascript
// custom/pages/my-page.js
const { BasePage } = require('@agentsync/test-framework').pages;
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

class MyPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define locators
    this.submitButton = new SelfHealingLocator(page, '#submit-button');
  }
  
  async submitForm() {
    const button = await this.submitButton.locate();
    await button.click();
  }
}

module.exports = MyPage;
```

## Multi-Project Usage

The framework is designed to be used across multiple projects:

### Project Structure

```
project-repo/
├── tests/
│   ├── e2e/
│   ├── api/
│   ├── pages/
│   └── components/
├── auth/
├── reports/
├── .env
├── package.json (includes framework as dependency)
└── playwright.config.js (extends framework config)
```

### Project Configuration

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');
const { baseConfig } = require('@agentsync/test-framework').config;
require('dotenv').config();

module.exports = defineConfig({
  ...baseConfig,
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL || 'https://your-app.com',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
```

### Project Dependencies

```json
// package.json
{
  "dependencies": {
    "@agentsync/test-framework": "^1.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

For more details on multi-project usage, see the [Multi-Project Guide](MULTI_PROJECT_GUIDE.md).

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
   - Use self-healing locators with fallback strategies
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
| ACCESSIBILITY_ENABLED | Enable accessibility testing | true |
| PERFORMANCE_ENABLED | Enable performance testing | false |

### CLI Commands

```bash
# Initialize a new project
agentsync-framework init --name "My Project"

# Generate a page object
agentsync-framework generate --page Login

# Generate a test file
agentsync-framework generate --test "User Authentication"

# Update framework
agentsync-framework update

# Open documentation
agentsync-framework docs
```

### Design Principles

1. **Configurability**: All external resources are configurable through environment variables or configuration files.
2. **Modularity**: Each utility focuses on a specific concern and can be used independently.
3. **Reusability**: Utilities are designed to be reused across different tests and projects.
4. **Testability**: All utilities can be easily tested in isolation.
5. **Documentation**: All utilities are well-documented with JSDoc comments.

For more detailed information on specific components, refer to the individual documentation files in the `docs/` directory.