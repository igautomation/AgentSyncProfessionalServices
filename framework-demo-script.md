# Playwright Test Framework Demo Script

## Introduction
"I'll be demonstrating our Playwright test automation framework, which provides comprehensive testing capabilities for web applications, APIs, and Salesforce."

## Framework Architecture
"Our framework follows a modular architecture:
- **src/** contains our code: page objects, tests, and utilities
- **config/** holds environment configurations
- **docs/** provides comprehensive documentation
- **reports/** stores test results"

## Key Features
"Our framework offers:
1. Cross-browser testing across Chrome, Firefox, Safari, and Edge
2. API testing for REST and GraphQL endpoints
3. Salesforce-specific testing utilities
4. Self-healing locators that recover from UI changes
5. Visual regression testing with screenshot comparison
6. Accessibility testing with WCAG compliance checks
7. Performance testing with Core Web Vitals metrics"

## Demo: Page Object Model
"We use the Page Object Model for maintainable tests:

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```"

## Demo: API Testing
"Our API testing utilities make it easy to test endpoints:

```javascript
test('API can create a user', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'John Doe', job: 'QA Engineer' }
  });
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.name).toBe('John Doe');
});
```"

## Demo: Salesforce Testing
"For Salesforce, we have specialized utilities:

```javascript
test('can create a contact', async ({ page }) => {
  const loginPage = new SalesforceLoginPage(page);
  await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD);
  
  const contactsPage = new SalesforceContactsPage(page);
  await contactsPage.navigate();
  await contactsPage.createContact({
    firstName: 'Test',
    lastName: 'Contact',
    email: 'test@example.com'
  });
  
  expect(await contactsPage.isContactCreated('Test Contact')).toBeTruthy();
});
```"

## Demo: Web Scraping
"Our web scraping utilities extract data for validation:

```javascript
test('extract product data', async ({ page }) => {
  await page.goto('https://example.com/products');
  
  const scraper = new WebScrapingUtils(page);
  const products = await scraper.extractTableData('#products-table');
  
  expect(products.length).toBeGreaterThan(0);
  expect(products[0].name).toBeDefined();
  expect(products[0].price).toBeDefined();
  
  // Save data for reporting
  const dataProvider = new DataProvider();
  dataProvider.saveAsJson(products, 'products');
});
```"

## Running Tests
"Tests can be run with simple commands:
```bash
# Run all tests
npm test

# Run specific test types
npm run test:api
npm run test:e2e
npm run test:salesforce

# Run with UI mode for debugging
npx playwright test --ui
```"

## Reporting
"Our framework generates comprehensive reports:
- HTML reports with test results and screenshots
- JUnit reports for CI/CD integration
- Custom dashboards for test metrics and trends"

## CI/CD Integration
"The framework integrates with CI/CD pipelines through:
- GitHub Actions workflows
- Docker containers for consistent environments
- Parallel test execution for faster feedback"

## Conclusion
"This framework provides a robust foundation for test automation with:
- Maintainable architecture
- Comprehensive testing capabilities
- Reliable execution
- Detailed reporting
- Seamless CI/CD integration"