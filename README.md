# AgentSync Test Framework

> **Note**: For a comprehensive guide to the framework, please see the [Master README](MASTER_README.md).

A comprehensive test automation framework for AgentSync projects, distributed as a private GitHub NPM package.

## Installation

### System Dependencies

This framework uses the `canvas` package which requires certain system dependencies to be installed. You can use our setup script to install these dependencies automatically:

```bash
npm run setup:dependencies
```

Or check if your system already has the required dependencies:

```bash
npm run check:dependencies
```

For detailed instructions and troubleshooting, see our [System Dependencies Guide](docs/SYSTEM_DEPENDENCIES.md).

### Using GitHub Packages

1. Run the setup script to configure your GitHub token:

```bash
npm run setup:github-token
```

Or manually create a `.npmrc` file in your project root:

```
@igautomation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Set your GitHub token as an environment variable:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

3. Install the framework:

```bash
npm install @AgentSync/professional-services-qa
```

### Quick Setup with Templates

To create a new project using templates:

```bash
# First install the framework
npm install @AgentSync/professional-services-qa

# Then use the full package name with npx
npx @AgentSync/professional-services-qa init -t basic -d my-project
```

Available templates:
- `basic`: General web testing project
- `salesforce`: Salesforce-specific testing project

## Usage

### Basic Example

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@AgentSync/professional-services-qa');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
});
```

### Page Object Model

```javascript
const { test, expect } = require('@playwright/test');
const { pages } = require('@AgentSync/professional-services-qa');

class LoginPage extends pages.BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#login-button');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Self-Healing Locators

```javascript
const { test } = require('@playwright/test');
const { utils } = require('@AgentSync/professional-services-qa');

test('using self-healing locators', async ({ page }) => {
  const { SelfHealingLocator } = utils.web;
  
  const loginButton = new SelfHealingLocator(page, {
    selector: 'button[type="submit"]',
    fallbackSelectors: [
      'button:has-text("Login")',
      '.login-button'
    ],
    name: 'Login Button'
  });
  
  await loginButton.click();
});
```

### Salesforce Testing

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@AgentSync/professional-services-qa');

test('salesforce test', async ({ page }) => {
  // Login to Salesforce
  await utils.salesforce.login(page, {
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  
  // Navigate to Contacts tab
  await utils.salesforce.navigateToTab(page, 'Contacts');
  
  // Create a new contact
  await page.click('a[title="New"]');
  await page.fill('input[name="lastName"]', 'Test Contact');
  await page.click('button[name="SaveEdit"]');
  
  // Verify success message
  await expect(page.locator('.toastMessage')).toContainText('Contact');
});
```

## Available Modules

The framework includes the following modules:

- **utils.web**: Web testing utilities
- **utils.api**: API testing utilities
- **utils.salesforce**: Salesforce testing utilities
- **utils.database**: Database interaction utilities
- **utils.common**: Common utilities
- **utils.reporting**: Reporting utilities
- **utils.visual**: Visual testing utilities
- **utils.accessibility**: Accessibility testing utilities
- **utils.performance**: Performance testing utilities
- **utils.mobile**: Mobile testing utilities
- **utils.localization**: Localization testing utilities
- **utils.security**: Security testing utilities
- **utils.testrail**: TestRail integration utilities
- **utils.scheduler**: Test scheduling utilities
- **utils.plugins**: Plugin system utilities

## Features

- **Private GitHub Package**: Secure distribution across multiple projects
- **Project Templates**: Ready-to-use templates for quick setup
- **Page Object Model**: Structured approach to organizing test code
- **Self-Healing Locators**: Resilient element locators that adapt to UI changes
- **Database Utilities**: Easy database interactions for test data management
- **Common Test Utilities**: Helper functions for common test operations
- **Plugin System**: Extensible architecture for custom functionality
- **Configuration Management**: Flexible configuration system
- **CLI Tool**: Command-line interface for project setup and management
- **GitHub Actions Integration**: Ready-to-use CI/CD workflows
- **Latest Playwright Version**: Uses Playwright v1.53.1

## Environment Variables

This framework uses environment variables for configuration to avoid hard-coded values. Before using the framework, you should set up your environment variables:

1. Copy the `.env.example` file to create environment-specific files:
   ```bash
   cp .env.example .env.dev
   cp .env.example .env.qa
   cp .env.example .env.prod
   ```

2. Fill in the appropriate values in each environment file. These files should NEVER be committed to version control.

3. Load the environment variables in your tests:
   ```javascript
   require('dotenv').config({ path: '.env.dev' }); // or other environment
   ```

4. Access environment variables in your tests:
   ```javascript
   const baseUrl = process.env.BASE_URL;
   const apiKey = process.env.API_KEY;
   ```

Refer to `.env.example` for all available configuration options.

## Documentation

### User Guide

A comprehensive user guide is available in the [docs/user-guide](docs/user-guide/index.md) directory. This includes:

- [Installation Guide](docs/user-guide/INSTALLATION.md)
- [Quick Start Guide](docs/user-guide/QUICK_START.md)
- [Usage Guide](docs/user-guide/USAGE.md)
- [Environment Variables Guide](docs/user-guide/ENVIRONMENT_VARIABLES.md)
- [Templates Guide](docs/user-guide/TEMPLATES_GUIDE.md)
- [Multi-Project Guide](docs/user-guide/MULTI_PROJECT_GUIDE.md)
- [Salesforce Testing Guide](docs/user-guide/README-SALESFORCE-TESTS.md)

### Additional Documentation

- [System Dependencies Guide](docs/SYSTEM_DEPENDENCIES.md)
- [GitHub Packages Setup Guide](docs/GITHUB_PACKAGES_SETUP.md)
- [NPM Setup Guide](docs/npm-setup.md)
- [Client Setup Checklist](docs/CLIENT_SETUP_CHECKLIST.md)

### Consolidated Documentation

A single file containing all documentation is available at [docs/CONSOLIDATED_USER_GUIDE.md](docs/CONSOLIDATED_USER_GUIDE.md).

## License

MIT