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