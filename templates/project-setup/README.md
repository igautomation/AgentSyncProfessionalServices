# PROJECT_NAME Test Automation

This project uses the AgentSync Test Framework for automated testing.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run specific test suite
npm run test:smoke
npm run test:regression

# View test report
npm run report
```

## Configuration

### Environment Variables
Copy `.env.template` to `.env` and configure:

```bash
# Application URLs
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com

# Authentication
USERNAME=test.user@example.com
PASSWORD=your-password

# Test Configuration
HEADLESS=true
TIMEOUT=30000
```

### Playwright Configuration
Main configuration is in `playwright.config.js`. Key settings:

- **Test Directory**: `./tests`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome
- **Reporters**: HTML, JSON, JUnit
- **Retries**: 2 on CI, 0 locally

## Writing Tests

### Basic Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Tests', () => {
  test('should test functionality', async ({ page }) => {
    await page.goto('/');
    // Test implementation
  });
});
```

### Using Self-Healing Locators
```javascript
const { SelfHealingLocator } = require('@agentsync/test-framework').locators;

test('should use self-healing locator', async ({ page }) => {
  const button = new SelfHealingLocator(page, '#submit-btn', {
    fallbackStrategies: [
      { selector: 'button[type="submit"]' },
      { selector: 'text=Submit' }
    ]
  });
  
  const element = await button.locate();
  await element.click();
});
```

### API Testing
```javascript
test('should test API endpoint', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength.greaterThan(0);
});
```

## Test Organization

```
tests/
├── e2e/           # End-to-end tests
├── api/           # API tests
├── smoke/         # Smoke tests
└── regression/    # Regression tests
```

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Daily schedule (2 AM UTC)

### GitHub Actions
The workflow runs tests across multiple browsers and uploads results as artifacts.

## Framework Features

- **Self-Healing Locators**: Automatic fallback strategies
- **Multi-Browser Support**: Chrome, Firefox, Safari, Mobile
- **API Testing**: Built-in request utilities
- **Visual Testing**: Screenshot comparison
- **Accessibility Testing**: WCAG compliance checks
- **Performance Testing**: Core Web Vitals monitoring
- **Reporting**: HTML, JSON, JUnit formats

## Troubleshooting

### Common Issues

**Tests failing locally but passing in CI:**
- Check browser versions: `npx playwright install`
- Verify environment variables in `.env`

**Locator not found errors:**
- Use self-healing locators with fallback strategies
- Check element timing with `waitFor` methods

**Authentication issues:**
- Verify credentials in `.env`
- Check storage state in `./auth/` directory

### Debug Mode
```bash
# Run in debug mode
npm run test:debug

# Run with UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/login.spec.js --debug
```

## Support

- Framework Documentation: [Link to docs]
- Issue Tracking: [GitHub Issues]
- Team Slack: #test-automation