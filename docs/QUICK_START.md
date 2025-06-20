# AgentSync Test Framework Quick Start Guide

This guide provides a quick start for setting up and using the AgentSync Test Framework in your project.

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- GitHub account with access to the AgentSync repository
- GitHub Personal Access Token with `read:packages` scope

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select the `read:packages` scope
4. Click "Generate token"
5. Copy the token

### 2. Set Up Authentication

Create a `.npmrc` file in your project root:

```
@agentsync:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set your GitHub token as an environment variable:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

### 3. Create a New Project

#### Option A: Using the Setup Script (Recommended)

```bash
npx @agentsync/test-framework setup:client-project
```

Follow the prompts to create your project.

#### Option B: Manual Setup

1. Create project structure:

   ```bash
   mkdir my-project
   cd my-project
   ```

2. Create package.json:

   ```json
   {
     "name": "my-project",
     "version": "1.0.0",
     "dependencies": {
       "@agentsync/test-framework": "^1.0.0"
     },
     "devDependencies": {
       "@playwright/test": "^1.40.0"
     },
     "scripts": {
       "test": "playwright test"
     }
   }
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create playwright.config.js:

   ```javascript
   const { defineConfig } = require('@playwright/test');
   const { baseConfig } = require('@agentsync/test-framework/config');
   
   module.exports = defineConfig({
     ...baseConfig,
     testDir: './tests',
     projects: [
       {
         name: 'chromium',
         use: { 
           ...baseConfig.use,
           browserName: 'chromium',
         },
       },
     ],
   });
   ```

5. Create a test file:

   ```bash
   mkdir tests
   touch tests/example.spec.js
   ```

6. Write a test:

   ```javascript
   const { test, expect } = require('@playwright/test');
   const { utils } = require('@agentsync/test-framework');
   
   test('example test', async ({ page }) => {
     await page.goto('https://example.com');
     await expect(page).toHaveTitle(/Example/);
   });
   ```

### 4. Run Tests

```bash
npx playwright install  # Install browsers (first time only)
npm test
```

## Using Framework Features

### Self-Healing Locators

```javascript
const { SelfHealingLocator } = require('@agentsync/test-framework').utils.web;

const loginButton = new SelfHealingLocator(page, {
  selector: 'button[type="submit"]',
  fallbackSelectors: [
    'button:has-text("Login")',
    '.login-button'
  ],
  name: 'Login Button'
});

await loginButton.click();
```

### Page Objects

```javascript
const { BasePage } = require('@agentsync/test-framework').pages;

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }
  
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
```

### API Testing

```javascript
const { test } = require('@playwright/test');
const { utils } = require('@agentsync/test-framework');

test('API test', async ({ request }) => {
  const { apiClient } = utils.api;
  
  const client = apiClient.create({
    baseURL: 'https://api.example.com',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const response = await client.get('/users');
  expect(response.status).toBe(200);
});
```

## GitHub Actions Integration

Create a file at `.github/workflows/tests.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
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
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
```

Add a `GITHUB_TOKEN` secret in your repository settings.

## Next Steps

- Read the [full documentation](./MULTI_PROJECT_GUIDE.md)
- Explore [framework features](./FRAMEWORK_GUIDE.md)
- Check out [example tests](../examples/playwright)