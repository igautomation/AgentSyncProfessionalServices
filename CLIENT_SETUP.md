# Client Project Setup Guide

This guide explains how to set up a new client project using the AgentSync Test Framework.

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- GitHub account with access to the AgentSync repository
- GitHub Personal Access Token with `read:packages` scope

## Setup Options

### Option 1: Using the Setup Script (Recommended)

1. **Run the Setup Script**

   ```bash
   npx @agentsync/test-framework setup:client-project
   ```

2. **Follow the Prompts**

   The script will ask for:
   - Project name
   - Project description
   - Base URL
   - API URL

3. **Complete Setup**

   ```bash
   cd your-project-name
   export GITHUB_TOKEN=your_personal_access_token
   npm install
   npx playwright install
   ```

### Option 2: Manual Setup

1. **Create Project Structure**

   ```bash
   mkdir your-project-name
   cd your-project-name
   ```

2. **Set Up Authentication**

   Create a `.npmrc` file:

   ```
   @agentsync:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. **Create package.json**

   ```json
   {
     "name": "your-project-name",
     "version": "1.0.0",
     "description": "Client-specific test automation project",
     "private": true,
     "scripts": {
       "test": "playwright test",
       "test:headed": "playwright test --headed",
       "test:debug": "playwright test --debug",
       "report": "playwright show-report"
     },
     "dependencies": {
       "@agentsync/test-framework": "^1.0.0"
     },
     "devDependencies": {
       "@playwright/test": "^1.40.0",
       "dotenv": "^16.3.1"
     }
   }
   ```

4. **Create playwright.config.js**

   ```javascript
   const { defineConfig } = require('@playwright/test');
   const { baseConfig } = require('@agentsync/test-framework/config');
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
       },
     ],
   });
   ```

5. **Create .env File**

   ```
   BASE_URL=https://your-app-url.com
   API_URL=https://your-api-url.com
   USERNAME=your_username
   PASSWORD=your_password
   ```

6. **Create Example Test**

   ```bash
   mkdir -p tests
   ```

   Create `tests/example.spec.js`:

   ```javascript
   const { test, expect } = require('@playwright/test');
   const { utils } = require('@agentsync/test-framework');

   test('example test', async ({ page }) => {
     await page.goto('/');
     await expect(page).toHaveTitle(/Your App/);
   });
   ```

7. **Install Dependencies**

   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   npm install
   npx playwright install
   ```

## GitHub Actions Integration

1. **Create GitHub Repository**

   Create a new repository on GitHub for your project.

2. **Create Workflow File**

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

3. **Add GitHub Token Secret**

   Add a `GITHUB_TOKEN` secret in your repository settings.

4. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-org/your-project.git
   git push -u origin main
   ```

## Running Tests

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

## Next Steps

- Create page objects for your application
- Add more test cases
- Set up test data management
- Configure reporting and notifications

## Support

For framework support:

- GitHub Issues: [https://github.com/agentsync/test-framework/issues](https://github.com/agentsync/test-framework/issues)
- Email: support@agentsync.com