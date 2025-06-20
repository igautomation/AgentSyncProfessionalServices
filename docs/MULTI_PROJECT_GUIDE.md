# Multi-Project Framework Implementation Guide

This guide explains how to use the AgentSync Test Framework across multiple client projects.

## Overview

The AgentSync Test Framework is distributed as a private GitHub NPM package, allowing it to be securely used across multiple client projects. This approach provides several benefits:

- **Centralized Maintenance**: Framework updates are made in one place
- **Version Control**: Each project can use a specific framework version
- **Secure Distribution**: Private access through GitHub authentication
- **Consistent Testing**: Standardized approach across all projects

## Implementation Steps

### 1. Framework Repository Setup

The framework is hosted in a GitHub repository and published as a private NPM package.

**Key Components:**
- GitHub repository with the framework code
- GitHub Packages for distribution
- GitHub Actions for automated testing and publishing

### 2. Client Project Setup

Each client project consumes the framework as a dependency.

#### Option A: Manual Setup

1. **Create Project Structure**

   ```bash
   mkdir client-project
   cd client-project
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
     "name": "client-project",
     "version": "1.0.0",
     "dependencies": {
       "@agentsync/test-framework": "^1.0.0"
     },
     "devDependencies": {
       "@playwright/test": "^1.40.0"
     }
   }
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Create Configuration Files**

   Create a `playwright.config.js` file that extends the framework's base configuration.

#### Option B: Automated Setup (Recommended)

Use the provided setup script:

```bash
npx @agentsync/test-framework setup:client-project
```

This script will:
1. Prompt for project information
2. Create the project structure
3. Set up configuration files
4. Create example test files

### 3. GitHub Actions Integration

Each client project should include a GitHub Actions workflow for automated testing.

1. **Create Workflow File**

   Create a file at `.github/workflows/tests.yml`:

   ```yaml
   name: Client Tests
   
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

2. **Add GitHub Token Secret**

   Add a `GITHUB_TOKEN` secret in your repository settings.

### 4. Framework Usage in Tests

```javascript
const { test, expect } = require('@playwright/test');
const { utils, pages } = require('@agentsync/test-framework');

test('should use framework utilities', async ({ page }) => {
  const { webInteractions } = utils.web;
  
  await page.goto('/');
  await webInteractions.waitForPageLoad(page);
  
  // Use self-healing locators
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

### 5. Framework Updates

When the framework is updated:

1. **Publish New Version**

   ```bash
   cd framework-repo
   npm version patch  # or minor or major
   npm run publish:framework
   ```

2. **Update Client Projects**

   ```bash
   cd client-project
   npm update @agentsync/test-framework
   ```

## Best Practices

### Version Management

- Use semantic versioning for the framework
- Pin to specific versions in critical projects
- Use version ranges (e.g., `^1.0.0`) for flexibility in non-critical projects

### Authentication

- Use GitHub Personal Access Tokens for local development
- Use GitHub Actions tokens for CI/CD
- Rotate tokens regularly for security

### Project Structure

```
client-project/
├── .github/
│   └── workflows/
│       └── tests.yml
├── tests/
│   ├── example.spec.js
│   └── ...
├── .env
├── .npmrc
├── package.json
└── playwright.config.js
```

### Documentation

- Keep a CHANGELOG.md in the framework repository
- Document breaking changes clearly
- Provide migration guides for major version updates

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   ```
   npm ERR! 401 Unauthorized
   ```

   **Solution**: Check your GitHub token and .npmrc configuration.

2. **Missing Dependencies**

   ```
   Error: Cannot find module '@agentsync/test-framework'
   ```

   **Solution**: Verify your package.json and run `npm install`.

3. **Version Conflicts**

   **Solution**: Update to the latest compatible version or pin to a specific version.

### Support

For framework support:

- GitHub Issues: [https://github.com/agentsync/test-framework/issues](https://github.com/agentsync/test-framework/issues)
- Email: support@agentsync.com