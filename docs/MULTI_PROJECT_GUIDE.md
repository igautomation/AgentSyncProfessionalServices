# Multi-Project Framework Usage Guide

This guide explains how to use the AgentSync Test Framework across multiple projects in your organization.

## Framework Distribution Strategy

### 1. Framework as NPM Package

The framework is distributed as a private NPM package `@agentsync/test-framework` via GitHub Packages.

#### Installation
```bash
# Configure npm to use GitHub Packages
npm config set @agentsync:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN

# Install the framework
npm install @agentsync/test-framework
```

### 2. Project Setup

#### Quick Start
```bash
# Create new project directory
mkdir my-project-tests
cd my-project-tests

# Initialize with framework CLI
npx @agentsync/test-framework init --name my-project

# Start testing
npm test
```

#### Manual Setup
```bash
# Install framework
npm install @agentsync/test-framework @playwright/test

# Create basic structure
mkdir -p tests/{e2e,api} auth reports

# Copy configuration templates
cp node_modules/@agentsync/test-framework/templates/project-setup/playwright.config.template.js playwright.config.js
cp node_modules/@agentsync/test-framework/templates/project-setup/.env.template .env
```

## Repository Structure Options

### Option A: Separate Repositories (Recommended)
```
framework-repo/                    # Framework source
├── src/
├── templates/
└── package.json

project-1-repo/                    # Project 1 tests
├── tests/
├── playwright.config.js
├── package.json                   # framework as dependency
└── .env

project-2-repo/                    # Project 2 tests
├── tests/
├── playwright.config.js
├── package.json                   # framework as dependency
└── .env
```

### Option B: Monorepo Structure
```
client-testing-ecosystem/
├── packages/
│   ├── test-framework/            # Framework source
│   ├── project-1-tests/           # Project 1 tests
│   ├── project-2-tests/           # Project 2 tests
│   └── shared-configs/            # Shared configurations
├── package.json
└── lerna.json
```

## Version Management

### Framework Versioning
- **Major (X.0.0)**: Breaking changes requiring project updates
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.2.X)**: Bug fixes and improvements

### Project Dependencies
```json
{
  "dependencies": {
    "@agentsync/test-framework": "^1.2.0"
  }
}
```

### Update Strategy
```bash
# Check for framework updates
npm outdated @agentsync/test-framework

# Update to latest compatible version
npm update @agentsync/test-framework

# Update to specific version
npm install @agentsync/test-framework@1.3.0
```

## Configuration Management

### Base Configuration
The framework provides base configuration that projects can extend:

```javascript
// playwright.config.js
const { defineConfig } = require('@playwright/test');
const { baseConfig } = require('@agentsync/test-framework/src/config/base.config');

module.exports = defineConfig({
  ...baseConfig,
  
  // Project-specific overrides
  testDir: './tests',
  use: {
    ...baseConfig.browser,
    baseURL: process.env.BASE_URL
  }
});
```

### Environment-Specific Configs
```javascript
// playwright.config.staging.js
const baseConfig = require('./playwright.config.js');

module.exports = {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'https://staging.myapp.com'
  }
};
```

## Usage Examples

### Basic Test with Framework
```javascript
const { test, expect } = require('@playwright/test');
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test('login functionality', async ({ page }) => {
  await page.goto('/login');
  
  // Use self-healing locator
  const loginButton = new SelfHealingLocator(page, '#login-btn', {
    fallbackStrategies: [
      { selector: 'button[type="submit"]' },
      { selector: 'text=Login' }
    ]
  });
  
  const button = await loginButton.locate();
  await button.click();
});
```

### Using Framework Utilities
```javascript
const { test } = require('@playwright/test');
const { utils } = require('@agentsync/test-framework');

test('API test with framework utilities', async ({ request }) => {
  const response = await utils.api.makeRequest(request, {
    method: 'GET',
    url: '/api/users',
    expectedStatus: 200
  });
  
  await utils.api.validateSchema(response, 'user-list-schema.json');
});
```

## CI/CD Integration

### GitHub Actions Setup
```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@agentsync'
      
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - run: npx playwright install --with-deps
      - run: npm test
```

## Best Practices

### 1. Version Pinning
- Pin framework version in production projects
- Use range versions in development: `^1.2.0`

### 2. Configuration Management
- Keep project-specific configs minimal
- Use environment variables for differences
- Document any framework overrides

### 3. Test Organization
```
tests/
├── e2e/
│   ├── smoke/
│   ├── regression/
│   └── integration/
├── api/
├── accessibility/
└── performance/
```

### 4. Reporting Strategy
- Centralized reporting dashboard
- Project-specific report storage
- Automated report distribution

### 5. Maintenance
- Regular framework updates
- Deprecation notices for breaking changes
- Migration guides for major versions

## Troubleshooting

### Common Issues

#### Framework Not Found
```bash
# Check registry configuration
npm config get @agentsync:registry

# Verify authentication
npm whoami --registry=https://npm.pkg.github.com
```

#### Version Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Configuration Issues
```bash
# Validate configuration
npx playwright test --list

# Debug configuration
DEBUG=pw:api npx playwright test
```

## Support and Resources

- **Framework Documentation**: [Internal Wiki Link]
- **Issue Tracking**: [GitHub Issues Link]
- **Slack Channel**: #test-automation
- **Office Hours**: Tuesdays 2-3 PM EST

## Migration Guide

When updating framework versions, follow these steps:

1. **Review Changelog**: Check breaking changes
2. **Update Dependencies**: `npm update @agentsync/test-framework`
3. **Run Tests**: Verify compatibility
4. **Update Configs**: Apply any required changes
5. **Deploy**: Update CI/CD pipelines if needed