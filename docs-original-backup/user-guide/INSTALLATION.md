# Installation Guide

This guide explains how to install and set up the AgentSync Test Framework in your project.

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Playwright Test

## Installation Options

### Option 1: Install from npm

```bash
npm install agentsync-test-framework
```

### Option 2: Install from local tarball

```bash
# Download the tarball
# Then install it
npm install ./agentsync-test-framework-1.0.0.tgz
```

### Option 3: Install from GitHub Packages

1. Create or edit your `.npmrc` file:

```
@agentsync:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

2. Install the package:

```bash
npm install @agentsync/test-framework
```

## Project Setup

### Manual Setup

1. Create a new project directory:

```bash
mkdir my-test-project
cd my-test-project
```

2. Initialize a new npm project:

```bash
npm init -y
```

3. Install the framework:

```bash
npm install agentsync-test-framework
```

4. Create a basic project structure:

```
my-test-project/
├── tests/
│   ├── e2e/
│   ├── api/
│   └── pages/
├── playwright.config.js
└── package.json
```

5. Create a basic Playwright configuration:

```javascript
// playwright.config.js
const { baseConfig } = require('agentsync-test-framework').config;

module.exports = {
  ...baseConfig,
  testDir: './tests',
  use: {
    baseURL: 'https://your-app-url.com',
  },
};
```

### Using the CLI Tool

1. Install the framework globally:

```bash
npm install -g agentsync-test-framework
```

2. Create a new project:

```bash
agentsync-framework init --name "My Test Project"
```

This will create a new project with the recommended structure and configuration.

## Verification

To verify that the framework is installed correctly:

1. Create a simple test file:

```javascript
// tests/example.spec.js
const { test, expect } = require('@playwright/test');
const { utils } = require('agentsync-test-framework');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
  await utils.common.takeScreenshot(page, 'example');
});
```

2. Run the test:

```bash
npx playwright test
```

If everything is set up correctly, the test should run successfully.

## Next Steps

- Read the [Framework Documentation](./README.md) for more details
- Check out the [Examples](./examples/) directory for usage examples
- Configure your CI/CD pipeline to run tests automatically