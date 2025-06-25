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