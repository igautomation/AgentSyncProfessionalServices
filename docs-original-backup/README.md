# AgentSync Test Framework Documentation

## Overview

The AgentSync Test Framework is a comprehensive test automation framework built on top of Playwright. It provides a structured approach to writing and maintaining automated tests for web applications.

## Installation

```bash
# Install from npm
npm install agentsync-test-framework

# Or install from a local tarball
npm install agentsync-test-framework-1.0.0.tgz
```

## Key Components

### Page Objects

The framework uses the Page Object Model (POM) pattern to represent web pages as classes:

```javascript
const { BasePage } = require('agentsync-test-framework');

class LoginPage extends BasePage {
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
```

### Utilities

The framework provides various utility modules:

- **Common Utilities**: Helper functions for common operations
- **Database Utilities**: Functions for database interactions
- **Plugin System**: Extensible plugin architecture

```javascript
const { utils } = require('agentsync-test-framework');
const { common } = utils;

// Wait for page to load
await common.waitForPageLoad(page);

// Take screenshot
await common.takeScreenshot(page, 'login-page');
```

### Configuration

The framework provides a flexible configuration system:

```javascript
const { config } = require('agentsync-test-framework');
const baseConfig = config.getBaseConfig();

// Extend the base configuration
const myConfig = {
  ...baseConfig,
  timeout: 60000,
  retries: 3
};
```

## CLI Tool

The framework includes a CLI tool for project setup:

```bash
npx agentsync-framework init --name "My Project"
```

## Best Practices

1. **Use Page Objects**: Encapsulate page interactions in page objects
2. **Organize Tests**: Group tests by feature or functionality
3. **Use Data-Driven Testing**: Parameterize tests for better coverage
4. **Handle Waits Properly**: Use explicit waits instead of timeouts
5. **Implement Reporting**: Use the built-in reporting utilities

## Examples

See the [examples](./examples/) directory for complete examples of using the framework.