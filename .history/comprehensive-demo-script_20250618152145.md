# Playwright Test Framework - Comprehensive Demo Script

## 1. Introduction

"Welcome to this demonstration of our enterprise-grade Playwright test automation framework. Today I'll walk you through the key features, architecture, best practices, and utilities that make this framework powerful and flexible for testing web applications, APIs, and Salesforce."

## 2. Framework Architecture

"Our framework follows a modular architecture designed for maintainability and extensibility:

```
AgentSyncProfessionalServices/
├── src/                    # Source code
│   ├── pages/              # Page objects
│   ├── tests/              # Test files
│   └── utils/              # Utility modules
├── config/                 # Configuration files
├── docs/                   # Documentation
└── reports/                # Test reports
```

This separation of concerns allows us to maintain clean code and easily extend functionality."

## 3. Core Features Overview

"The framework provides comprehensive testing capabilities:

1. **Cross-browser Testing**: Chrome, Firefox, Safari, and Edge
2. **API Testing**: REST and GraphQL endpoints
3. **Salesforce Testing**: Specialized utilities for Salesforce
4. **Visual Testing**: Screenshot comparison
5. **Accessibility Testing**: WCAG compliance checks
6. **Performance Testing**: Core Web Vitals metrics
7. **Data-Driven Testing**: Multiple data formats
8. **Self-Healing Locators**: Recovery from UI changes
9. **Reporting**: Customizable HTML reports
10. **CI/CD Integration**: GitHub Actions and Docker support"

## 4. Page Object Model Implementation

"We implement the Page Object Model pattern for maintainable UI tests:

```javascript
// Example page object
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// Usage in test
test('User can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

This approach encapsulates UI elements and interactions, making tests more maintainable."

## 5. API Testing Capabilities

"Our framework provides robust API testing utilities:

```javascript
// API test example
test('API can create a user', async ({ request }) => {
  // Make request
  const response = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      job: 'QA Engineer'
    }
  });
  
  // Validate response
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.name).toBe('John Doe');
  
  // Schema validation
  const isValid = schemaValidator.validate('user', data);
  expect(isValid).toBeTruthy();
});
```

We support REST and GraphQL APIs with request building, response validation, and schema verification."

## 6. Salesforce Testing

"For Salesforce testing, we provide specialized utilities:

```javascript
// Salesforce test example
test('can create a contact in Salesforce', async ({ page }) => {
  // Login to Salesforce
  const loginPage = new SalesforceLoginPage(page);
  await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD);
  
  // Create contact
  const contactsPage = new SalesforceContactsPage(page);
  await contactsPage.navigate();
  await contactsPage.createContact({
    firstName: 'Test',
    lastName: 'Contact',
    email: 'test@example.com'
  });
  
  // Verify contact creation
  expect(await contactsPage.isContactCreated('Test Contact')).toBeTruthy();
});
```

Our Salesforce utilities handle authentication, page navigation, and data management."

## 7. Self-Healing Locators

"Our framework includes self-healing locators that automatically recover from UI changes:

```javascript
// Self-healing locator example
const loginButton = new SelfHealingLocator(page, [
  '#login-button',
  '.login-btn',
  'button:has-text("Login")',
  'button.btn-primary',
]);

// Use the locator
await loginButton.click();
```

This approach makes tests more resilient to UI changes."

## 8. Visual Testing

"We support visual regression testing with screenshot comparison:

```javascript
// Visual test example
test('homepage visual regression test', async ({ page }) => {
  await page.goto('/');
  
  // Compare screenshot with baseline
  expect(await page.screenshot()).toMatchSnapshot('homepage.png');
});
```

This helps detect unintended visual changes."

## 9. Accessibility Testing

"Our framework includes accessibility testing capabilities:

```javascript
// Accessibility test example
test('homepage meets accessibility standards', async ({ page }) => {
  await page.goto('/');
  
  // Check accessibility
  const violations = await checkAccessibility(page);
  expect(violations.length).toBe(0);
});
```

This ensures applications meet WCAG compliance standards."

## 10. Performance Testing

"We measure performance metrics including Core Web Vitals:

```javascript
// Performance test example
test('homepage performance', async ({ page }) => {
  // Measure performance
  const metrics = await measurePerformance(page, '/');
  
  // Validate metrics
  expect(metrics.LCP).toBeLessThan(2500); // Good LCP is < 2.5s
  expect(metrics.FID).toBeLessThan(100);  // Good FID is < 100ms
  expect(metrics.CLS).toBeLessThan(0.1);  // Good CLS is < 0.1
});
```

This helps identify performance regressions."

## 11. Data-Driven Testing

"Our framework supports data-driven testing with multiple data sources:

```javascript
// Data-driven test example
const users = require('../data/users.json');

for (const user of users) {
  test(`Login test for ${user.role}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
    
    // Role-specific assertions
    if (user.role === 'admin') {
      await expect(page.locator('#admin-panel')).toBeVisible();
    } else {
      await expect(page.locator('#user-dashboard')).toBeVisible();
    }
  });
}
```

This allows testing multiple scenarios efficiently."

## 12. Web Scraping Utilities

"Our web scraping utilities extract data for validation:

```javascript
// Web scraping example
test('extract product data', async ({ page }) => {
  await page.goto('/products');
  
  const scraper = new WebScrapingUtils(page);
  
  // Extract table data
  const products = await scraper.extractTableData('#products-table');
  
  // Extract structured data
  const featuredProduct = await scraper.extractStructuredData({
    name: '.featured-product .name',
    price: '.featured-product .price',
    rating: '.featured-product .rating'
  });
  
  // Save extracted data
  const dataProvider = new DataProvider();
  dataProvider.saveAsJson(products, 'products');
});
```

This enables data extraction for validation and reporting."

## 13. Reporting System

"Our reporting system provides comprehensive insights:

```javascript
// Configure reporters in playwright.config.js
reporter: [
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'reports/junit-results.xml' }],
  ['json', { outputFile: 'reports/test-results.json' }]
]

// Generate custom report
test.afterAll(async () => {
  await generateCustomReport({
    inputFile: 'reports/test-results.json',
    outputFile: 'reports/custom-report.html',
    includeScreenshots: true,
    includeVideos: true
  });
});
```

Our reports include test results, screenshots, videos, and metrics."

## 14. CI/CD Integration

"The framework integrates with CI/CD pipelines:

```yaml
# GitHub Actions workflow example
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

This ensures tests run automatically with every code change."

## 15. Docker Support

"We provide Docker support for consistent environments:

```dockerfile
# Dockerfile example
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
```

This allows running tests in containerized environments."

## 16. Best Practices

"Our framework follows these best practices:

1. **Page Object Model**: Encapsulate UI elements and interactions
2. **Data-Driven Testing**: Separate test logic from test data
3. **Explicit Waits**: Use explicit waits for dynamic elements
4. **Error Handling**: Add proper error handling and recovery
5. **Clean Test Data**: Clean up test data after test execution
6. **Minimal UI Interaction**: Use API for setup when possible
7. **Parallel Execution**: Run tests in parallel for faster feedback
8. **Selective Retries**: Retry only flaky tests, not all tests
9. **Visual Verification**: Use visual testing for UI validation
10. **Comprehensive Reporting**: Generate detailed test reports"

## 17. Configuration System

"Our configuration system is flexible and environment-aware:

```javascript
// playwright.config.js example
module.exports = defineConfig({
  // Test directory
  testDir: './src/tests',
  
  // Environment-specific settings
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
  },
  
  // Multiple browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'salesforce',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './auth/salesforce-storage-state.json',
        baseURL: process.env.SF_INSTANCE_URL
      },
      testMatch: '**/salesforce/**/*.spec.js'
    },
  ],
});
```

This allows adapting tests to different environments without code changes."

## 18. Running Tests

"Tests can be run with simple commands:

```bash
# Run all tests
npm test

# Run specific test types
npm run test:api            # API tests
npm run test:e2e            # End-to-end tests
npm run test:accessibility  # Accessibility tests
npm run test:salesforce     # Salesforce tests

# Run with UI mode for debugging
npx playwright test --ui

# Run tests in headed mode
npx playwright test --headed

# View test reportsfkfjfkjfkfjkeefjejlewjlweqjlwefjl2jflwjlwj
npm run report
```

These commands make it easy to run and debug tests."

## 19. Utility Modules

"Our framework includes several utility modules:

1. **ApiClient**: REST and GraphQL API requests
2. **DataOrchestrator**: Test data management
3. **SelfHealingLocator**: Resilient element selection
4. **PerformanceUtils**: Performance measurement
5. **AccessibilityUtils**: Accessibility checking
6. **VisualComparisonUtils**: Screenshot comparison
7. **WebScrapingUtils**: Data extraction
8. **ReportingUtils**: Custom report generation
9. **SalesforceUtils**: Salesforce-specific utilities
10. **DatabaseUtils**: Database connection and queries

These utilities provide reusable functionality for tests."

## 20. Conclusion

"In conclusion, our Playwright test framework provides:

1. **Comprehensive Testing**: UI, API, and Salesforce testing
2. **Maintainable Architecture**: Page objects and utilities
3. **Resilient Tests**: Self-healing locators and retries
4. **Detailed Reporting**: HTML reports and dashboards
5. **CI/CD Integration**: GitHub Actions and Docker support

This framework enables efficient, reliable, and maintainable test automation."

## 21. Questions?

"I'd be happy to answer any questions or dive deeper into specific aspects of the framework."