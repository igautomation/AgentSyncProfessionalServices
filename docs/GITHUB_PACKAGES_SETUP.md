# GitHub Packages Setup Guide

This guide explains how to set up and use the AgentSync Test Framework as a private GitHub package.

## For Framework Maintainers

### Publishing the Framework

1. **Prepare for Publishing**

   Ensure your `package.json` has the correct configuration:

   ```json
   {
     "name": "@agentsync/test-framework",
     "version": "1.0.0",
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

2. **Authentication**

   Create a `.npmrc` file in the project root:

   ```
   @agentsync:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

   Set your GitHub token:

   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   ```

3. **Manual Publishing**

   ```bash
   npm publish
   ```

4. **Automated Publishing with GitHub Actions**

   The framework includes a GitHub Actions workflow that automatically publishes the package when a new release is created.

   To create a new release:

   1. Go to the GitHub repository
   2. Click on "Releases"
   3. Click "Draft a new release"
   4. Enter the version tag (e.g., `v1.0.1`)
   5. Add release notes
   6. Click "Publish release"

### Version Management

Follow semantic versioning:

- **Major version (X.0.0)**: Breaking changes
- **Minor version (1.X.0)**: New features (backward compatible)
- **Patch version (1.0.X)**: Bug fixes (backward compatible)

## For Client Projects

### Setting Up a New Client Project

1. **Create Project Structure**

   ```bash
   mkdir my-client-project
   cd my-client-project
   ```

2. **Authentication Setup**

   Create a `.npmrc` file:

   ```
   @agentsync:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. **Initialize Project**

   ```bash
   npm init -y
   ```

4. **Update package.json**

   ```json
   {
     "name": "my-client-project",
     "version": "1.0.0",
     "dependencies": {
       "@agentsync/test-framework": "^1.0.0"
     },
     "devDependencies": {
       "@playwright/test": "^1.40.0"
     }
   }
   ```

5. **Install Dependencies**

   ```bash
   npm install
   ```

### Using the Framework in Client Projects

1. **Import Framework Components**

   ```javascript
   const { utils, fixtures, pages } = require('@agentsync/test-framework');
   ```

2. **Use Framework Utilities**

   ```javascript
   const { webInteractions } = utils.web;
   await webInteractions.waitForPageLoad(page);
   ```

3. **Use Self-Healing Locators**

   ```javascript
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
   ```

4. **Extend Base Page Objects**

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

### GitHub Actions Integration

1. **Create GitHub Actions Workflow**

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

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Ensure your GitHub token has the `read:packages` scope
2. Check that your `.npmrc` file is correctly configured
3. Verify that the token environment variable is set

### Package Not Found

If the package cannot be found:

1. Check that you're using the correct package name (`@agentsync/test-framework`)
2. Verify that your `.npmrc` file is in the project root
3. Ensure you have access to the GitHub repository

### Version Conflicts

If you encounter version conflicts:

1. Check the framework's version in your `package.json`
2. Update to the latest version if needed: `npm update @agentsync/test-framework`