# AgentSync Professional Services Framework - Comprehensive User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Framework Architecture](#framework-architecture)
5. [Writing Tests](#writing-tests)
6. [Page Object Model](#page-object-model)
7. [Utilities](#utilities)
8. [Configuration](#configuration)
9. [Environment Variables](#environment-variables)
10. [Templates](#templates)
11. [Salesforce Testing](#salesforce-testing)
12. [API Testing](#api-testing)
13. [Multi-Project Usage](#multi-project-usage)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Support](#support)

## Introduction

The AgentSync Professional Services Framework is a comprehensive test automation solution built on Playwright. It provides tools, utilities, and patterns for creating reliable, maintainable automated tests for web applications with special support for Salesforce.

### Key Features

- **Multi-browser Testing**: Run tests across Chrome, Firefox, and Safari
- **Page Object Model**: Structured approach to UI testing
- **Salesforce Integration**: Specialized tools for Salesforce testing
- **API Testing**: Built-in support for API testing
- **Reporting**: Comprehensive test reporting
- **Multi-project Support**: Use the framework across multiple projects

## Installation

### Prerequisites

- Node.js 16 or higher
- npm 7 or higher

### Installation Options

#### Option 1: Install from GitHub Packages

1. Create a GitHub Personal Access Token with `read:packages` permission
2. Create a `.npmrc` file in your project root:
   ```
   @igautomation:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
3. Set your GitHub token:
   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   ```
4. Install the framework:
   ```bash
   npm install @igautomation/agentsyncprofessionalservices
   ```

#### Option 2: Clone and Install Locally

```bash
git clone https://github.com/igautomation/agentsyncprofessionalservices.git
cd agentsyncprofessionalservices
npm install
```

### System Dependencies

The framework uses the `canvas` package which requires certain system dependencies. Run:

```bash
npm run setup:dependencies
```

Or check if your system has the required dependencies:

```bash
npm run check:dependencies
```

## Quick Start

### Create a New Project

```bash
# Install the framework
npm install @igautomation/agentsyncprofessionalservices

# Create a new project using a template
npx agentsync init -t basic -d my-project

# Navigate to the project
cd my-project

# Install dependencies
npm install
```

### Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
```

### Create Your First Test

```javascript
// tests/example.spec.js
const { test, expect } = require('@playwright/test');

test('Basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run report
```

## Framework Architecture

The framework follows a modular architecture designed for flexibility and maintainability:

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

### Key Components

- **CLI Tools**: Command-line utilities for project setup and management
- **Configuration**: Base configurations for Playwright
- **Page Objects**: Base classes for implementing the Page Object Model
- **Utilities**: Helper functions for common test operations
- **Templates**: Project templates for quick setup

## Writing Tests

### Basic Test Structure

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test.describe('Feature name', () => {
  test('Test case description', async ({ page }) => {
    // Test steps
    await page.goto('https://example.com');
    
    // Assertions
    await expect(page).toHaveTitle(/Example Domain/);
  });
});
```

### Test Organization

Organize tests by feature or user journey:

```
tests/
├── authentication/
│   ├── login.spec.js
│   └── logout.spec.js
├── user-management/
│   ├── create-user.spec.js
│   └── edit-user.spec.js
└── reporting/
    └── generate-report.spec.js
```

### Test Hooks

Use test hooks for setup and teardown:

```javascript
test.describe('User management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginUser(page);
  });
  
  test.afterEach(async ({ page }) => {
    // Cleanup after each test
    await logoutUser(page);
  });
  
  test('Create user', async ({ page }) => {
    // Test implementation
  });
});
```

## Page Object Model

The Page Object Model (POM) is a design pattern that creates an object repository for web UI elements. It helps improve test maintenance and reduces code duplication.

### Creating Page Objects

```javascript
const { BasePage } = require('@igautomation/agentsyncprofessionalservices');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define page elements
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#login-button');
    this.errorMessage = this.page.locator('.error-message');
  }

  // Define page actions
  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}

module.exports = LoginPage;
```

### Using Page Objects in Tests

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('./pages/LoginPage');

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('testuser', 'password123');
  
  // Verify successful login
  await expect(page).toHaveURL('/dashboard');
});
```

## Utilities

The framework provides various utility functions to simplify common test operations.

### Common Utilities

```javascript
const { utils } = require('@igautomation/agentsyncprofessionalservices');
const { common } = utils;

// Wait for page to load completely
await common.waitForPageLoad(page);

// Take a screenshot
await common.takeScreenshot(page, 'login-page');

// Generate random data
const randomEmail = common.generateRandomEmail();
```

### Web Utilities

```javascript
const { utils } = require('@igautomation/agentsyncprofessionalservices');
const { web } = utils;

// Self-healing locators
const loginButton = new web.SelfHealingLocator(page, {
  primary: '#login-button',
  alternates: [
    'button:has-text("Login")',
    '.login-btn',
    '[data-testid="login-button"]'
  ]
});

await loginButton.click();
```

### Database Utilities

```javascript
const { utils } = require('@igautomation/agentsyncprofessionalservices');
const { database } = utils;

// Connect to database
const db = await database.connect({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'testdb',
  username: 'user',
  password: 'password'
});

// Execute a query
const results = await db.query('SELECT * FROM users WHERE username = $1', ['testuser']);

// Close connection
await db.disconnect();
```

## Configuration

### Base Configuration

The framework provides a base configuration for Playwright that you can extend:

```javascript
// playwright.config.js
const { config } = require('@igautomation/agentsyncprofessionalservices');

module.exports = {
  ...config.baseConfig,
  testDir: './tests',
  use: {
    baseURL: 'https://your-app-url.com',
  },
};
```

### Custom Configuration

You can customize the configuration for your specific needs:

```javascript
// playwright.config.js
const { config } = require('@igautomation/agentsyncprofessionalservices');

module.exports = {
  ...config.baseConfig,
  testDir: './tests',
  timeout: 60000,
  retries: 2,
  use: {
    baseURL: 'https://your-app-url.com',
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
};
```

## Environment Variables

Using environment variables instead of hard-coded values provides better security and flexibility.

### Setting Up Environment Variables

1. Create environment-specific files:
   ```bash
   cp .env.example .env.dev
   cp .env.example .env.qa
   cp .env.example .env.prod
   ```

2. Configure each environment with appropriate values.

3. Load environment variables in tests:
   ```javascript
   // Load environment variables from .env.dev
   require('dotenv').config({ path: '.env.dev' });
   ```

### Important Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BASE_URL` | Base URL for UI tests | `https://example.com` |
| `API_BASE_URL` | Base URL for API tests | `https://api.example.com` |
| `API_KEY` | API key for authentication | `your-api-key` |
| `USERNAME` | Username for login tests | `testuser` |
| `PASSWORD` | Password for login tests | `testpass` |
| `SF_USERNAME` | Salesforce username | `user@example.com` |
| `SF_PASSWORD` | Salesforce password | `password` |
| `SF_LOGIN_URL` | Salesforce login URL | `https://login.salesforce.com` |
| `SF_INSTANCE_URL` | Salesforce instance URL | `https://instance.salesforce.com` |

### Security Best Practices

1. Never commit environment files (add `.env.*` to `.gitignore`)
2. Use secrets management in CI/CD
3. Regularly rotate credentials
4. Use different values for different environments

## Templates

The framework includes project templates to quickly set up new test projects.

### Available Templates

1. **Basic Template**: For general web testing
   - Basic project structure
   - Example test
   - Configuration files

2. **Salesforce Template**: For Salesforce testing
   - Salesforce-specific project structure
   - Authentication setup
   - Page objects for common Salesforce elements

### Using Templates

```bash
# Using npx
npx agentsync init -t basic -d my-project

# Or if installed globally
agentsync init -t salesforce -d salesforce-tests
```

Options:
- `-t, --template`: Template to use (basic, salesforce)
- `-d, --directory`: Target directory

## Salesforce Testing

The framework includes specialized support for Salesforce testing.

### Salesforce Authentication

```javascript
const { test } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('Salesforce test', async ({ page }) => {
  // Login to Salesforce
  await utils.salesforce.login(page, {
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  
  // Test implementation
});
```

### Salesforce Navigation

```javascript
const { test } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('Navigate in Salesforce', async ({ page }) => {
  await utils.salesforce.login(page);
  
  // Navigate to a specific tab
  await utils.salesforce.navigateToTab(page, 'Accounts');
  
  // Navigate to a specific record
  await utils.salesforce.navigateToRecord(page, 'Account', '001XXXXXXXXXXXXXXX');
});
```

### Salesforce Test Improvements

Based on our experience, we've made several improvements to Salesforce testing:

1. **Direct URL Navigation**: Use direct URLs instead of UI navigation
   ```javascript
   // Instead of clicking through the UI
   await page.goto(process.env.SF_INSTANCE_URL + '/lightning/o/Account/list');
   ```

2. **Increased Timeouts**: Set longer timeouts for Salesforce operations
   ```javascript
   page.setDefaultTimeout(120000);
   ```

3. **Specific Selectors**: Use specific selectors for form fields
   ```javascript
   // Instead of:
   await page.getByRole('textbox', { name: 'Phone' }).fill('555-123-4567');
   
   // Use:
   await page.locator('input[name="Phone"]').fill('555-123-4567');
   ```

4. **Robust Waiting**: Implement better waiting strategies
   ```javascript
   async function waitForPageLoad(page) {
     await page.waitForLoadState('domcontentloaded');
     const spinner = page.locator('.slds-spinner');
     if (await spinner.isVisible().catch(() => false)) {
       await spinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
     }
     await page.waitForTimeout(2000);
   }
   ```

## API Testing

The framework provides utilities for API testing.

### Basic API Test

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('API test', async ({ request }) => {
  // Make a GET request
  const response = await request.get(`${process.env.API_BASE_URL}/users/1`);
  
  // Verify response status
  expect(response.status()).toBe(200);
  
  // Verify response body
  const body = await response.json();
  expect(body.id).toBe(1);
});
```

### API Authentication

```javascript
const { test, expect } = require('@playwright/test');

test('Authenticated API test', async ({ request }) => {
  // Make an authenticated request
  const response = await request.get(`${process.env.API_BASE_URL}/protected-resource`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`
    }
  });
  
  expect(response.status()).toBe(200);
});
```

### API Schema Validation

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');
const { validateSchema } = utils.api;

test('API schema validation', async ({ request }) => {
  const response = await request.get(`${process.env.API_BASE_URL}/users/1`);
  
  // Define schema
  const schema = {
    type: 'object',
    required: ['id', 'name', 'email'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  };
  
  // Validate response against schema
  const body = await response.json();
  const valid = validateSchema(body, schema);
  expect(valid).toBe(true);
});
```

## Multi-Project Usage

The framework is designed to be used across multiple projects and teams.

### Framework Distribution Strategy

The AgentSync Test Framework is distributed as a private GitHub NPM package, allowing multiple teams to use the same framework while maintaining consistency.

### Project Setup for Teams

Each team should follow these steps:

1. Set up GitHub Packages authentication
2. Create a new project using templates
3. Customize the project for their specific needs
4. Set up CI/CD integration

### Shared Configuration

Create shared configuration files that teams can extend:

```javascript
// team-config.js
const { baseConfig } = require('@igautomation/agentsyncprofessionalservices/config');

module.exports = {
  ...baseConfig,
  // Team-specific configuration
  timeout: 60000,
  retries: 2,
};
```

### Version Management

Teams should specify the framework version in their package.json:

```json
"dependencies": {
  "@igautomation/agentsyncprofessionalservices": "^1.0.2"
}
```

## Best Practices

### General Best Practices

1. **Organize by Feature**: Structure tests by feature or user journey
2. **Keep Page Objects Simple**: Focus on encapsulating page interactions
3. **Use Data-Driven Testing**: Parameterize tests for better coverage
4. **Handle Waits Properly**: Use explicit waits instead of timeouts
5. **Implement Reporting**: Use the built-in reporting utilities

### Salesforce-Specific Best Practices

1. **Use Direct Navigation**: Navigate directly to Salesforce URLs when possible
2. **Increase Timeouts**: Set longer timeouts for Salesforce operations
3. **Use Specific Selectors**: Be as specific as possible with selectors
4. **Add Error Handling**: Implement comprehensive error handling
5. **Consider API Setup**: Use API calls for test data setup when possible

### Code Quality

1. **Follow Naming Conventions**: Use descriptive names for tests and variables
2. **Keep Tests Independent**: Tests should not depend on each other
3. **Avoid Hard-Coded Values**: Use environment variables or constants
4. **Add Comments**: Document complex logic or business rules
5. **Use Assertions Effectively**: Make assertions specific and meaningful

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check credentials in environment variables
   - Verify token expiration
   - Check network connectivity

2. **Element Not Found**
   - Increase timeouts
   - Check selector specificity
   - Verify element visibility
   - Use self-healing locators

3. **Test Flakiness**
   - Add explicit waits
   - Improve selector robustness
   - Increase timeouts
   - Add retry logic

### Debugging Techniques

1. **Visual Debugging**
   ```bash
   npx playwright test --headed --debug
   ```

2. **Screenshots and Videos**
   ```javascript
   // Take screenshot
   await page.screenshot({ path: 'debug.png' });
   ```

3. **Logging**
   ```javascript
   console.log('Current URL:', page.url());
   ```

4. **Trace Viewer**
   ```bash
   npx playwright show-trace trace.zip
   ```

## Support

For support, please contact the AgentSync Professional Services team.

---

This comprehensive guide provides all the information needed to effectively use the AgentSync Professional Services Framework. For more detailed information on specific topics, refer to the individual documentation files in the `docs` directory.