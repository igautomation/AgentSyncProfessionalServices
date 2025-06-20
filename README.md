# AgentSync Test Framework

A comprehensive test automation framework for AgentSync projects, distributed as a private GitHub NPM package.

## Installation

### Using GitHub Packages

1. Create a `.npmrc` file in your project root:

```
@igautomation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Set your GitHub token:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

3. Install the framework:

```bash
npm install @igautomation/agentsyncprofessionalservices
```

### Quick Setup

Use our setup script to create a new project:

```bash
npx @igautomation/agentsyncprofessionalservices setup:client-project
```

## Usage

```javascript
const { test, expect } = require('@playwright/test');
const { utils, pages } = require('@igautomation/agentsyncprofessionalservices');

// Create a page object
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

// Use self-healing locators
test('login test', async ({ page }) => {
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

## Features

- **Private GitHub Package**: Secure distribution across multiple projects
- **Page Object Model**: Structured approach to organizing test code
- **Self-Healing Locators**: Resilient element locators that adapt to UI changes
- **Database Utilities**: Easy database interactions for test data management
- **Common Test Utilities**: Helper functions for common test operations
- **Plugin System**: Extensible architecture for custom functionality
- **Configuration Management**: Flexible configuration system
- **CLI Tool**: Command-line interface for project setup and management
- **GitHub Actions Integration**: Ready-to-use CI/CD workflows

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [GitHub Packages Setup Guide](docs/GITHUB_PACKAGES_SETUP.md)
- [Multi-Project Guide](docs/MULTI_PROJECT_GUIDE.md)
- [Quick Start Guide](docs/QUICK_START.md)
- [Client Setup Checklist](docs/CLIENT_SETUP_CHECKLIST.md)

## License

MIT