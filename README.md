# AgentSync Master Test Framework

A comprehensive, enterprise-grade test automation framework that consolidates the best features from AgentSync Professional Services and Playwright frameworks for end-to-end testing, API testing, and Salesforce automation.

## 🚀 Framework Overview

This master framework provides a unified solution combining:

- **Professional Services Features**: Advanced CLI tools, comprehensive reporting, visualization capabilities
- **Playwright Specialization**: Focused Salesforce testing, enhanced TestRail integration, streamlined authentication
- **Cross-browser testing** across Chrome, Firefox, Safari, and Edge
- **API testing** for REST and GraphQL endpoints with advanced validation
- **Salesforce-specific testing** with specialized utilities and page objects
- **TestRail integration** for comprehensive test case management
- **Accessibility testing** with detailed reporting
- **Advanced reporting and visualization** with chart generation
- **CI/CD integration** with GitHub Actions workflows

## 🎯 Key Consolidated Features

### 🔧 Professional Services Features
- **Advanced CLI Tools**: Comprehensive command-line interface for project setup and management
- **Page Object Generators**: Automated generation of page objects from DOM elements
- **Comprehensive Reporting**: HTML, PDF, and custom report generation
- **Data Visualization**: Chart generation and data analysis capabilities
- **Multi-project Distribution**: Framework designed for client delivery
- **Extensive Documentation**: Complete user guides and setup instructions

### 🎭 Playwright Specialization Features
- **Enhanced Salesforce Testing**: Specialized utilities for Salesforce automation
- **TestRail Integration**: Complete test case management and result reporting
- **Streamlined Authentication**: OAuth and token-based authentication management
- **Organized Architecture**: Core/specialized pattern for better maintainability
- **Performance Optimization**: Enhanced performance testing utilities

## 📂 Project Structure

```
AgentSyncMasterFramework/
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── pages/              # Page objects
│   │   └── salesforce/     # Salesforce page objects
│   ├── tests/              # Test files
│   │   ├── api/            # API tests
│   │   ├── ui/             # UI tests
│   │   ├── accessibility/  # Accessibility tests
│   │   └── salesforce/     # Salesforce tests
│   ├── utils/              # Utility modules
│   │   ├── accessibility/  # Accessibility utilities
│   │   ├── api/            # API testing utilities
│   │   ├── ci/             # CI/CD utilities
│   │   ├── generators/     # Code generators
│   │   ├── reporting/      # Advanced reporting
│   │   ├── salesforce/     # Salesforce utilities
│   │   ├── testrail/       # TestRail integration
│   │   ├── visualization/  # Data visualization
│   │   └── web/            # Web interaction utilities
│   ├── fixtures/           # Test fixtures
│   └── dashboard/          # Test dashboard
├── bin/                    # CLI executables
├── templates/              # Project templates
├── examples/               # Usage examples
├── scripts/                # Helper scripts
├── docs/                   # Documentation
└── .github/                # GitHub Actions workflows
```

## 🛠️ Installation

### Prerequisites

Install system dependencies for advanced features:

#### macOS
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### Framework Installation

```bash
# Install the framework
npm install @agentsync/master-test-framework

# Install Playwright browsers
npx playwright install

# Initialize a new project
npx agentsync init my-test-project
```

### Alternative Installation (without optional dependencies)
```bash
npm install @agentsync/master-test-framework --no-optional
```

## 🚀 Quick Start

### 1. Initialize Project
```bash
npx agentsync init my-project
cd my-project
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:api
npm run test:ui
npm run test:salesforce
npm run test:accessibility

# Run with different configurations
npm run test:salesforce:headed
npm run test:salesforce:debug
```

## 🔧 Key Features

### Salesforce Testing
- **Authentication**: OAuth 2.0 and session-based authentication
- **API Testing**: Complete REST API testing for Salesforce objects
- **UI Testing**: Lightning UI page objects and interactions
- **Apex Testing**: Execute and validate Apex code
- **SOQL Queries**: Builder pattern for complex queries
- **Data Management**: CRUD operations with cleanup

### API Testing
- **REST & GraphQL**: Comprehensive API testing capabilities
- **Schema Validation**: JSON schema validation with detailed reporting
- **Authentication**: Multiple authentication methods
- **Data-driven Testing**: CSV, JSON, and YAML data sources
- **Performance Testing**: Response time and load testing

### Accessibility Testing
- **WCAG Compliance**: Complete WCAG 2.1 AA/AAA testing
- **Automated Scanning**: Integration with axe-core
- **Custom Reports**: Detailed accessibility reports
- **Visual Testing**: Screenshot comparison for accessibility

### Advanced Reporting
- **Multiple Formats**: HTML, PDF, JSON, XML reports
- **TestRail Integration**: Automatic test result upload
- **Custom Dashboards**: Real-time test execution dashboards
- **Data Visualization**: Charts and graphs for test metrics
- **Historical Tracking**: Test result trends and analysis

### CLI Tools
- **Project Generator**: Create new test projects
- **Page Object Generator**: Generate page objects from URLs
- **Selector Generator**: Extract and optimize selectors
- **Test Runner**: Advanced test execution with filtering
- **Report Generator**: Custom report generation

## 📊 Usage Examples

### Basic Test
```javascript
const { test, expect } = require('@agentsync/master-test-framework/fixtures');

test('Basic web test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### Salesforce Test
```javascript
const { test, expect } = require('@agentsync/master-test-framework/fixtures');
const { SalesforceTestHelper } = require('@agentsync/master-test-framework/utils/salesforce');

test('Salesforce account creation', async ({ page, salesforceAuth }) => {
  const sfHelper = new SalesforceTestHelper(page, salesforceAuth);
  
  await sfHelper.navigateToAccounts();
  const accountId = await sfHelper.createAccount({
    name: 'Test Account',
    type: 'Customer'
  });
  
  expect(accountId).toBeTruthy();
});
```

### API Test with TestRail
```javascript
const { test, expect } = require('@agentsync/master-test-framework/fixtures');
const { ApiClient } = require('@agentsync/master-test-framework/utils/api');

test('API endpoint validation @C12345', async ({ request }) => {
  const apiClient = new ApiClient(request);
  
  const response = await apiClient.get('/api/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength(10);
});
```

### Accessibility Test
```javascript
const { test, expect } = require('@agentsync/master-test-framework/fixtures');
const { AccessibilityUtils } = require('@agentsync/master-test-framework/utils/accessibility');

test('Accessibility compliance', async ({ page }) => {
  await page.goto('https://example.com');
  
  const accessibilityUtils = new AccessibilityUtils(page);
  const results = await accessibilityUtils.runAccessibilityTest();
  
  expect(results.violations).toHaveLength(0);
});
```

## 🔧 Configuration

### Environment Variables
```bash
# Salesforce Configuration
SF_LOGIN_URL=https://test.salesforce.com
SF_USERNAME=your-username
SF_PASSWORD=your-password
SF_SECURITY_TOKEN=your-token

# TestRail Configuration
TESTRAIL_URL=https://your-instance.testrail.io
TESTRAIL_USERNAME=your-username
TESTRAIL_PASSWORD=your-password
TESTRAIL_PROJECT_ID=1

# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your-api-key
```

### Playwright Configuration
```javascript
// playwright.config.js
module.exports = {
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'accessibility', testMatch: '**/accessibility/**' },
    { name: 'salesforce', testMatch: '**/salesforce/**' },
  ],
};
```

## 🤖 CI/CD Integration

### GitHub Actions
```yaml
name: Test Execution
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
        env:
          SF_USERNAME: ${{ secrets.SF_USERNAME }}
          SF_PASSWORD: ${{ secrets.SF_PASSWORD }}
          TESTRAIL_USERNAME: ${{ secrets.TESTRAIL_USERNAME }}
          TESTRAIL_PASSWORD: ${{ secrets.TESTRAIL_PASSWORD }}
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: reports/
```

## 📈 Advanced Features

### Data Visualization
```javascript
const { ChartGenerator } = require('@agentsync/master-test-framework/utils/visualization');

const chartGen = new ChartGenerator();
await chartGen.generateTestResultsChart({
  data: testResults,
  type: 'bar',
  output: 'reports/test-results-chart.png'
});
```

### Performance Monitoring
```javascript
const { PerformanceUtils } = require('@agentsync/master-test-framework/utils/performance');

test('Performance test', async ({ page }) => {
  const perfUtils = new PerformanceUtils(page);
  
  await perfUtils.startMonitoring();
  await page.goto('https://example.com');
  const metrics = await perfUtils.getMetrics();
  
  expect(metrics.loadTime).toBeLessThan(3000);
});
```

### Custom Reporting
```javascript
const { ReportingUtils } = require('@agentsync/master-test-framework/utils/reporting');

const reporter = new ReportingUtils();
await reporter.generateCustomReport({
  template: 'executive-summary',
  data: testResults,
  output: 'reports/executive-summary.pdf'
});
```

## 🔒 Security Features

- **Credential Management**: Secure storage and rotation of credentials
- **Data Protection**: Encryption of sensitive test data
- **Access Control**: Role-based access to test resources
- **Audit Logging**: Complete audit trail of test executions

## 📚 Documentation

- [Installation Guide](./docs/INSTALLATION.md)
- [User Guide](./docs/USER_GUIDE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Salesforce Testing Guide](./docs/SALESFORCE_GUIDE.md)
- [TestRail Integration](./docs/TESTRAIL_GUIDE.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the examples in the `/examples` folder

## 📄 License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

---

**AgentSync Master Test Framework** - Combining the best of Professional Services and Playwright specialization for enterprise test automation.