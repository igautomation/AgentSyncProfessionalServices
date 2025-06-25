# Client Project Setup

This guide explains how to set up a client project using the framework.

## Prerequisites

1. GitHub Personal Access Token with `read:packages` permission
2. Node.js 16 or higher
3. npm 7 or higher

## Option 1: Using the Setup Script (Recommended)

1. Set your GitHub token:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

2. Run the setup script:

```bash
npx @igautomation/agentsyncprofessionalservices setup:client-project
```

3. Follow the prompts to configure your project

## Option 2: Manual Setup

1. Create a new directory for your project:

```bash
mkdir my-client-project
cd my-client-project
```

2. Create a `.npmrc` file:

```
@igautomation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

3. Create a `package.json` file:

```json
{
  "name": "my-client-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed"
  },
  "dependencies": {
    "@igautomation/agentsyncprofessionalservices": "^1.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "dotenv": "^16.3.1"
  }
}
```

4. Install dependencies:

```bash
export GITHUB_TOKEN=your_personal_access_token
npm install
```

5. Create a `playwright.config.js` file:

```javascript
const { defineConfig } = require('@playwright/test');
const { baseConfig } = require('@igautomation/agentsyncprofessionalservices/config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  ...baseConfig,
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: { 
        ...baseConfig.use,
        browserName: 'chromium',
        baseURL: process.env.BASE_URL || 'https://your-app-url.com',
      },
    }
  ],
});
```

6. Create a test file:

```bash
mkdir -p tests
```

Create `tests/example.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');
const { utils } = require('@igautomation/agentsyncprofessionalservices');

test('example test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Your App/);
});
```

7. Install Playwright browsers:

```bash
npx playwright install
```

8. Run the tests:

```bash
npm test
```