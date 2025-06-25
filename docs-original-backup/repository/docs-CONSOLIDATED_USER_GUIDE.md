# AgentSync Professional Services Framework - Consolidated User Guide

This document is a consolidated version of all user guide documents.

## Table of Contents

- [Introduction](#introduction)
- [QUICK_START](#quick_start)
- [INSTALLATION](#installation)
- [USAGE](#usage)
- [ENVIRONMENT_VARIABLES](#environment_variables)
- [TEMPLATES_GUIDE](#templates_guide)
- [MULTI_PROJECT_GUIDE](#multi_project_guide)
- [SALESFORCE-TESTS](#salesforce-tests)
- [salesforce-test-improvements](#salesforce-test-improvements)


<!-- index.md -->

# AgentSync Professional Services Framework User Guide

Welcome to the AgentSync Professional Services Framework User Guide. This guide contains all the documentation you need to get started with and use the framework effectively.

> **Note**: For a quick overview of the framework, see the [Master README](./MASTER_README.md).

## Table of Contents

1. [Introduction](./README.md) - Overview of the framework
2. [Quick Start Guide](./QUICK_START.md) - Get up and running quickly
3. [Installation](./INSTALLATION.md) - Detailed installation instructions
4. [Usage Guide](./USAGE.md) - How to use the framework
5. [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Configuration through environment variables
6. [Templates Guide](./TEMPLATES_GUIDE.md) - Using the built-in templates
7. [Multi-Project Guide](./MULTI_PROJECT_GUIDE.md) - Working with multiple projects
8. [Salesforce Testing](./README-SALESFORCE-TESTS.md) - Guide to Salesforce testing
9. [Salesforce Test Improvements](./salesforce-test-improvements.md) - Improvements to Salesforce tests

## Getting Started

If you're new to the framework, we recommend starting with the [Quick Start Guide](./QUICK_START.md) and then moving on to the more detailed documentation as needed.

## Additional Resources

For more advanced topics and reference materials, please see the full documentation in the `docs` directory.

<!-- README.md -->

# AgentSync Professional Services Framework

## Overview

The AgentSync Professional Services Framework is a comprehensive testing framework built on top of Playwright. It provides a structured approach to creating, managing, and executing automated tests for web applications, with special support for Salesforce testing.

## Key Features

- **Multi-browser Testing**: Run tests across Chrome, Firefox, and Safari
- **API Testing**: Built-in support for API testing
- **Salesforce Integration**: Specialized tools for Salesforce testing
- **Page Object Model**: Structured approach to UI testing
- **Reporting**: Comprehensive test reporting
- **Multi-project Support**: Use the framework across multiple projects

## Getting Started

To get started with the framework, please refer to the [Quick Start Guide](./QUICK_START.md).

## Documentation

This user guide contains the following documentation:

- [Installation Guide](./INSTALLATION.md)
- [Usage Guide](./USAGE.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Templates Guide](./TEMPLATES_GUIDE.md)
- [Multi-Project Guide](./MULTI_PROJECT_GUIDE.md)
- [Salesforce Testing Guide](./README-SALESFORCE-TESTS.md)
- [Salesforce Test Improvements](./salesforce-test-improvements.md)

## Consolidated Guide

A consolidated version of all documentation is available at `docs/CONSOLIDATED_USER_GUIDE.md`.

## Support

For support, please contact the AgentSync Professional Services team.

<!-- QUICK_START.md -->

# Quick Start Guide

This guide provides step-by-step instructions for getting started with the AgentSync Test Framework.

## Step 1: Set Up GitHub Packages Authentication

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

## Step 2: Create a New Project

```bash
# Install the framework
npm install @igautomation/agentsyncprofessionalservices

# Create a new project using a template
npx @igautomation/agentsyncprofessionalservices init -t basic -d my-project

# Navigate to the project
cd my-project
```

## Step 3: Set Up the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

For Salesforce projects:
```bash
npm run setup
```

## Step 4: Run Tests

```bash
npm test
```

## Step 5: Create Your Own Tests

Create a new test file:

```javascript
// tests/my-test.spec.js
const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('my first test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
});
```

## Common Commands

```bash
# Run tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run report
```

## Next Steps

- Explore the framework's utilities in `node_modules/@igautomation/agentsyncprofessionalservices/src/utils`
- Create page objects for your application
- Set up CI/CD integration
- Check out the documentation for more advanced features

<!-- INSTALLATION.md -->

# Installation Guide

This guide explains how to install and set up the AgentSync Test Framework in your project.

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Playwright Test

## Installation Options

### Option 1: Install from npm

```bash
npm install agentsync-test-framework
```

### Option 2: Install from local tarball

```bash
# Download the tarball
# Then install it
npm install ./agentsync-test-framework-1.0.0.tgz
```

### Option 3: Install from GitHub Packages

1. Create or edit your `.npmrc` file:

```
@agentsync:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

2. Install the package:

```bash
npm install @agentsync/test-framework
```

## Project Setup

### Manual Setup

1. Create a new project directory:

```bash
mkdir my-test-project
cd my-test-project
```

2. Initialize a new npm project:

```bash
npm init -y
```

3. Install the framework:

```bash
npm install agentsync-test-framework
```

4. Create a basic project structure:

```
my-test-project/
├── tests/
│   ├── e2e/
│   ├── api/
│   └── pages/
├── playwright.config.js
└── package.json
```

5. Create a basic Playwright configuration:

```javascript
// playwright.config.js
const { baseConfig } = require('agentsync-test-framework').config;

module.exports = {
  ...baseConfig,
  testDir: './tests',
  use: {
    baseURL: 'https://your-app-url.com',
  },
};
```

### Using the CLI Tool

1. Install the framework globally:

```bash
npm install -g agentsync-test-framework
```

2. Create a new project:

```bash
agentsync-framework init --name "My Test Project"
```

This will create a new project with the recommended structure and configuration.

## Verification

To verify that the framework is installed correctly:

1. Create a simple test file:

```javascript
// tests/example.spec.js
const { test, expect } = require('@playwright/test');
const { utils } = require('agentsync-test-framework');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
  await utils.common.takeScreenshot(page, 'example');
});
```

2. Run the test:

```bash
npx playwright test
```

If everything is set up correctly, the test should run successfully.

## Next Steps

- Read the [Framework Documentation](./README.md) for more details
- Check out the [Examples](./examples/) directory for usage examples
- Configure your CI/CD pipeline to run tests automatically

<!-- USAGE.md -->

# Usage Guide

This guide explains how to use the AgentSync Test Framework in your test automation projects.

## Basic Usage

### Importing the Framework

```javascript
// Import specific components
const { BasePage, utils, config } = require('agentsync-test-framework');

// Or import everything
const agentsyncFramework = require('agentsync-test-framework');
```

### Creating Page Objects

Page objects help organize your test code by encapsulating page-specific logic:

```javascript
const { BasePage } = require('agentsync-test-framework');

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

### Writing Tests

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('./pages/LoginPage');

test.describe('Login functionality', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser', 'password123');
    
    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser', 'wrongpassword');
    
    // Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });
});
```

## Using Utilities

### Common Utilities

```javascript
const { utils } = require('agentsync-test-framework');
const { common } = utils;

// Wait for page to load completely
await common.waitForPageLoad(page);

// Take a screenshot
await common.takeScreenshot(page, 'login-page');

// Generate random data
const randomEmail = common.generateRandomEmail();
```

### Database Utilities

```javascript
const { utils } = require('agentsync-test-framework');
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

### Using Base Configuration

```javascript
// playwright.config.js
const { config } = require('agentsync-test-framework');

module.exports = {
  ...config.baseConfig,
  testDir: './tests',
  use: {
    baseURL: 'https://your-app-url.com',
  },
};
```

### Environment Variables

The framework supports environment variables through `.env` files:

```
# .env file
BASE_URL=https://your-app-url.com
API_KEY=your-api-key
```

```javascript
// Access environment variables
const { utils } = require('agentsync-test-framework');
const apiKey = process.env.API_KEY;
```

## Advanced Features

### Self-Healing Locators

```javascript
const { SelfHealingLocator } = require('agentsync-test-framework');

// Create a self-healing locator
const loginButton = new SelfHealingLocator(page, {
  primary: '#login-button',
  alternates: [
    'button:has-text("Login")',
    '.login-btn',
    '[data-testid="login-button"]'
  ]
});

// Use it like a regular locator
await loginButton.click();
```

### Plugin System

```javascript
// Load a plugin
const { plugins } = require('agentsync-test-framework').utils;
plugins.load('my-custom-plugin');

// Use plugin functionality
plugins.get('my-custom-plugin').doSomething();
```

## Best Practices

1. **Organize by Feature**: Structure tests by feature or user journey
2. **Keep Page Objects Simple**: Focus on encapsulating page interactions
3. **Use Data-Driven Testing**: Parameterize tests for better coverage
4. **Handle Waits Properly**: Use explicit waits instead of timeouts
5. **Implement Reporting**: Use the built-in reporting utilities

## Examples

See the [examples](./examples/) directory for complete examples of using the framework.

<!-- ENVIRONMENT_VARIABLES.md -->

# Environment Variables and Configuration

This document explains how to properly configure the framework using environment variables to avoid hard-coded values in your tests.

## Why Use Environment Variables?

Using environment variables instead of hard-coded values provides several benefits:

1. **Security**: Sensitive information like credentials and API keys are not stored in code
2. **Flexibility**: Different environments (dev, QA, prod) can use different configurations
3. **Portability**: The same code can run in different environments without modification
4. **Compliance**: Meets security requirements for client deployments
5. **Multi-project support**: Enables the framework to be used across multiple projects

## Setting Up Environment Variables

### Step 1: Create Environment-Specific Files

Copy the `.env.example` file to create environment-specific files:

```bash
cp .env.example .env.dev
cp .env.example .env.qa
cp .env.example .env.prod
```

### Step 2: Configure Each Environment

Edit each file to include the appropriate values for that environment. For example, in `.env.dev`:

```
# Base URLs
API_BASE_URL=https://dev-api.example.com
BASE_URL=https://dev.example.com

# API Keys
API_KEY=dev-api-key-123

# Test Credentials
USERNAME=testuser
PASSWORD=testpass
```

### Step 3: Load Environment Variables in Tests

In your test files, load the appropriate environment variables:

```javascript
// Load environment variables from .env.dev
require('dotenv').config({ path: '.env.dev' });

// Or dynamically based on a NODE_ENV variable
const env = process.env.NODE_ENV || 'dev';
require('dotenv').config({ path: `.env.${env}` });
```

### Step 4: Use Environment Variables in Tests

Access environment variables in your tests:

```javascript
const { test, expect } = require('@playwright/test');

test('API test', async ({ request }) => {
  // Use environment variables instead of hard-coded values
  const response = await request.get(`${process.env.API_BASE_URL}/users/1`);
  expect(response.status()).toBe(200);
});
```

## Important Environment Variables

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

## Environment Variables in CI/CD

For CI/CD pipelines, set environment variables in your CI/CD platform:

### GitHub Actions

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ secrets.BASE_URL }}
      API_BASE_URL: ${{ secrets.API_BASE_URL }}
      API_KEY: ${{ secrets.API_KEY }}
      USERNAME: ${{ secrets.USERNAME }}
      PASSWORD: ${{ secrets.PASSWORD }}
    steps:
      # Your steps here
```

### Jenkins

```groovy
pipeline {
  environment {
    BASE_URL = credentials('base-url')
    API_BASE_URL = credentials('api-base-url')
    API_KEY = credentials('api-key')
    USERNAME = credentials('username')
    PASSWORD = credentials('password')
  }
  
  stages {
    // Your stages here
  }
}
```

## Security Best Practices

1. **Never commit environment files**: Add `.env.*` to your `.gitignore` file
2. **Use secrets management**: Store sensitive values in your CI/CD platform's secrets manager
3. **Rotate credentials**: Regularly rotate API keys and passwords
4. **Limit access**: Restrict access to environment variables to only those who need them
5. **Use different values**: Use different credentials for different environments

## Troubleshooting

If your tests can't access environment variables:

1. Verify the `.env` file exists in the correct location
2. Check that `dotenv` is properly configured
3. Ensure the variable is defined in your environment file
4. Try logging `process.env` to debug (but never in production code)
5. Check for typos in variable names

<!-- TEMPLATES_GUIDE.md -->

# Project Templates Guide

This guide explains how to use the built-in project templates to quickly set up new test projects.

## Available Templates

The framework includes two project templates:

### Basic Template

A simple template for general web testing, including:

- Basic project structure
- Example test
- Configuration files
- Environment setup

### Salesforce Template

A specialized template for Salesforce testing, including:

- Salesforce-specific project structure
- Authentication setup
- Page objects for common Salesforce elements
- Example tests for Salesforce functionality

## Using Templates

### Command Line

You can initialize a new project using these templates with:

```bash
# Using npx
npx agentsync init -t basic -d my-project

# Or if installed globally
agentsync init -t basic -d my-project
```

Options:
- `-t, --template`: Template to use (basic, salesforce). Default: basic
- `-d, --directory`: Target directory. Default: current directory

### NPM Script

If you have the framework installed in your project:

```bash
npm exec -- agentsync init -t salesforce -d salesforce-tests
```

## Template Structure

### Basic Template

```
basic/
├── tests/
│   └── example.spec.js  # Example test using the framework
├── .env.example         # Environment variables template
├── package.json         # Project configuration with framework dependency
└── playwright.config.js # Playwright configuration extending framework defaults
```

### Salesforce Template

```
salesforce/
├── tests/
│   └── contacts.spec.js # Example Salesforce contacts test
├── pages/
│   └── ContactPage.js   # Page object for Salesforce contacts
├── .env.example         # Salesforce-specific environment variables
├── global-setup.js      # Authentication setup for Salesforce
├── package.json         # Project configuration with framework dependency
└── playwright.config.js # Playwright configuration for Salesforce
```

## Customizing Templates

You can customize these templates for your specific needs:

1. Create a new project using a template
2. Modify the files as needed
3. Use it as a starting point for your tests

## Next Steps After Initialization

1. Navigate to the project directory:
   ```bash
   cd my-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. For Salesforce template, run the authentication setup:
   ```bash
   npm run setup
   ```

5. Run tests:
   ```bash
   npm test
   ```

<!-- MULTI_PROJECT_GUIDE.md -->

# Multi-Project Guide

This guide explains how to use the framework across multiple projects and teams.

## Framework Distribution Strategy

The AgentSync Test Framework is distributed as a private GitHub NPM package, allowing multiple teams to use the same framework while maintaining consistency and enabling centralized updates.

## Setting Up Teams

### 1. Grant Repository Access

Ensure all team members have access to the repository:

1. Go to https://github.com/igautomation/AgentSyncProfessionalServices/settings/access
2. Add teams or individual users who need access

### 2. Create Team Setup Guide

Create a team-specific setup guide with:

1. Instructions for creating GitHub Personal Access Tokens
2. `.npmrc` configuration
3. Project initialization steps
4. Team-specific conventions and standards

### 3. Schedule Training Session

Organize a brief training session covering:
- Framework features
- Authentication setup
- Common usage patterns
- Best practices

## Project Setup for Teams

Each team should follow these steps:

1. Set up GitHub Packages authentication
2. Create a new project using templates
3. Customize the project for their specific needs
4. Set up CI/CD integration

## Maintaining Consistency

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

### Shared Page Objects

Create shared page objects for common components:

```javascript
// shared-components.js
const { BasePage } = require('@igautomation/agentsyncprofessionalservices/pages');

class Header extends BasePage {
  constructor(page) {
    super(page);
    this.logo = page.locator('.header-logo');
    this.menuButton = page.locator('.menu-button');
  }
  
  async openMenu() {
    await this.menuButton.click();
  }
}

module.exports = { Header };
```

## Version Management

### Framework Versioning

When updating the framework:

1. Increment the version number in package.json
2. Publish the new version
3. Notify teams of the update

### Project Versioning

Teams should specify the framework version in their package.json:

```json
"dependencies": {
  "@igautomation/agentsyncprofessionalservices": "^1.0.2"
}
```

## Support and Collaboration

### Support Channel

Create a Slack channel or Teams chat for framework support questions.

### Knowledge Sharing

Encourage teams to:
- Share custom utilities they've created
- Report bugs and issues
- Suggest improvements to the framework

## Monitoring and Metrics

Track framework usage across teams:

- Number of tests created
- Test execution metrics
- Framework version adoption

This helps identify areas for improvement and ensures all teams are benefiting from the framework.

<!-- README-SALESFORCE-TESTS.md -->

# Salesforce Test Improvements

## Overview

This document explains the improvements made to the Salesforce tests to address reliability issues.

## New Files Created

1. **Fixed Login Test**: `src/tests/salesforce/fixed-sf-login.spec.js`
   - Improved login process with better error handling and logging
   - Increased timeouts for better reliability

2. **Minimal Navigation Test**: `src/tests/salesforce/minimal-navigation.spec.js`
   - Diagnostic test to identify navigation issues
   - Tests multiple methods of accessing the App Launcher
   - Implements direct URL navigation as a fallback

3. **Fixed Account-Contact Test**: `src/tests/salesforce/fixed-account-contact.spec.js`
   - Uses direct URL navigation instead of UI navigation
   - Implements better error handling and logging
   - Uses more specific selectors for form fields

4. **Test Runner Script**: `run-fixed-tests.sh`
   - Runs the fixed tests in sequence
   - Ensures proper test dependencies

5. **Documentation**: `salesforce-test-improvements.md`
   - Detailed analysis of issues and solutions
   - Recommendations for future test development

## New NPM Scripts

Added the following scripts to `package.json`:

- `test:sf:fixed`: Runs all fixed Salesforce tests using the shell script
- `test:sf:fixed:login`: Runs only the fixed login test
- `test:sf:fixed:account`: Runs only the fixed account-contact test

## Key Improvements

1. **Direct URL Navigation**
   - Bypasses unreliable UI navigation
   - Reduces test flakiness

2. **Improved Selectors**
   - More specific selectors for ambiguous elements
   - Better handling of dynamic content

3. **Enhanced Error Handling**
   - Try/catch blocks around critical operations
   - Better logging and screenshots for debugging

4. **Increased Timeouts**
   - Longer timeouts for Salesforce operations
   - Better handling of network delays

5. **Improved Test Independence**
   - Reduced dependencies between tests
   - Better handling of test prerequisites

## Usage

To run the fixed tests:

```bash
npm run test:sf:fixed
```

Or run individual tests:

```bash
npm run test:sf:fixed:login
npm run test:sf:fixed:account
```

## Next Steps

1. Apply these patterns to all Salesforce tests
2. Implement a Salesforce-specific Page Object Model
3. Set up more robust authentication mechanisms
4. Consider using API calls for test data setup

<!-- salesforce-test-improvements.md -->

# Salesforce Test Improvements

## Issues Identified

After analyzing the failing Salesforce tests, we identified several key issues:

1. **Navigation Timeouts**: The App Launcher button was not consistently found within the default timeout period.
2. **Network Stability**: Tests were failing with "Network did not reach idle state" errors.
3. **Element Selection**: Some selectors were not specific enough, causing ambiguity.
4. **Test Dependencies**: Tests were dependent on previous tests completing successfully.
5. **Error Handling**: Insufficient error handling and recovery mechanisms.

## Solutions Implemented

### 1. Improved Login Process

- Increased timeouts for authentication
- Added better error handling and logging
- Ensured proper storage of authentication state

### 2. Direct Navigation

- Bypassed the App Launcher UI by using direct URL navigation
- Used specific URLs for different Salesforce objects (accounts, contacts)
- Reduced dependency on UI elements that might be slow to load

### 3. Better Selectors

- Used more specific selectors for ambiguous elements
- Added fallback mechanisms when elements can't be found
- Used CSS selectors instead of role-based selectors when needed

### 4. Improved Error Handling

- Added try/catch blocks around critical operations
- Implemented better logging for debugging
- Added screenshots at key points for visual verification

### 5. Test Independence

- Reduced dependencies between tests
- Used file-based state sharing when needed
- Added checks to handle missing prerequisites

## Recommendations for Future Tests

1. **Use Direct Navigation**: Whenever possible, navigate directly to Salesforce URLs instead of using the UI navigation.

2. **Increase Timeouts**: Set longer timeouts for Salesforce operations:
   ```javascript
   page.setDefaultTimeout(120000);
   ```

3. **Implement Robust Waiting**: Use a combination of waiting strategies:
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

4. **Use Specific Selectors**: For fields with potential ambiguity, use name or ID-based selectors:
   ```javascript
   // Instead of:
   await page.getByRole('textbox', { name: 'Phone' }).fill('555-123-4567');
   
   // Use:
   await page.locator('input[name="Phone"]').fill('555-123-4567');
   ```

5. **Add Comprehensive Error Handling**:
   ```javascript
   try {
     // Test operations
   } catch (error) {
     console.error(`Operation failed: ${error.message}`);
     await page.screenshot({ path: './error-screenshot.png' });
     throw error;
   }
   ```

6. **Run Tests in Headful Mode During Development**: Use the `--headed` flag to visually observe test execution.

## Next Steps

1. Apply these patterns to all Salesforce tests
2. Consider implementing a Salesforce-specific Page Object Model
3. Set up a more robust authentication mechanism
4. Implement better test data management
5. Consider using API calls for test data setup instead of UI interactions