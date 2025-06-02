<!-- Source: /Users/mzahirudeen/playwright-framework-dev/docs-backup/consolidated-docs/.-USER_GUIDE.md -->

<!-- Source: /Users/mzahirudeen/playwright-framework/USER_GUIDE.md -->

# Salesforce Page Object Generator - User Guide

## Introduction

The Salesforce Page Object Generator is a tool that automates the creation of Playwright test automation code for Salesforce applications. It extracts DOM elements from Salesforce pages and generates page objects and test classes.

## Getting Started

### Installation

1. Ensure you have the required dependencies:
   - Node.js (v14+)
   - Playwright
   - Salesforce CLI

2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/playwright-framework.git
   cd playwright-framework
   npm install
   ```

### Basic Usage

The simplest way to use the framework is with the workflow script:

```bash
./run-sf-workflow.sh --url "https://your-org.lightning.force.com/lightning/o/Contact/new" --name "ContactPage"
```

## Step-by-Step Guide

### 1. Extract DOM Elements

You can extract DOM elements from a Salesforce page using:

```bash
node src/utils/generators/test-sf-extraction.js
```

This will:
- Open a browser
- Log in to Salesforce
- Navigate to the specified page
- Extract DOM elements
- Save them to `sf_contact_elements.json`

### 2. Generate Page Objects

Generate page objects from the extracted elements:

```bash
node src/utils/generators/sf-page-generator.js --input sf_contact_elements.json --output ./src/pages --name ContactPage
```

This creates:
- A page object class with selectors
- Methods to interact with the page elements

### 3. Generate Test Classes

The same command also generates test classes:

```bash
node src/utils/generators/sf-page-generator.js --input sf_contact_elements.json --test-output ./tests/pages --name ContactPage
```

This creates:
- A test class with common test scenarios
- Setup for authenticated sessions

## Working with Generated Code

### Page Objects

The generated page objects follow this structure:

```javascript
class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Page URL
    this.url = 'https://your-org.lightning.force.com/lightning/o/Contact/new';
    
    // Selectors
    this.firstNameInput = '[field-name="FirstName"]';
    this.lastNameInput = '[field-name="LastName"]';
    this.saveButton = 'button:has-text("Save")';
    // ...
  }

  // Navigation methods
  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  // Interaction methods
  async fillFirstName(value) {
    await this.fill(this.firstNameInput, value);
  }

  async clickSave() {
    await this.click(this.saveButton);
  }
  // ...
}
```

### Test Classes

The generated test classes follow this structure:

```javascript
test.describe('ContactPage Tests', () => {
  let page;
  let contactPage;

  test.beforeEach(async ({ browser }) => {
    // Setup code...
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test('should create a new record with valid data', async () => {
    await contactPage.fillFirstName('Test');
    await contactPage.fillLastName('User');
    await contactPage.clickSave();
    
    // Assertions...
  });
  
  // More test cases...
});
```

## Customizing the Framework

### Adding Custom Selectors

Edit `src/utils/generators/selectors.js` to add custom selectors:

```javascript
salesforceElements: {
  // Add your custom selectors here
  custom: [
    ".my-custom-class",
    "[data-my-attribute]"
  ]
}
```

### Modifying Page Generation

Edit `src/utils/generators/sf-page-generator.js` to customize how page objects are generated.

### Extending Test Cases

Edit the generated test files to add more test cases or customize existing ones.

## Best Practices

1. **Review Generated Code**: Always review and refine the generated code
2. **Add Custom Methods**: Add business-specific methods to page objects
3. **Maintain Selectors**: Update selectors if the page structure changes
4. **Use Descriptive Names**: Rename methods and selectors for clarity

## Troubleshooting

### Common Issues

1. **Login Failures**
   - Check credentials
   - Verify the Salesforce instance is accessible
   - Try using `--no-headless` to see the browser

2. **Missing Elements**
   - Increase wait times
   - Check if the page structure has changed
   - Verify selectors are correct

3. **Test Failures**
   - Check if the page has been modified
   - Verify test data is valid
   - Update selectors if needed

## Support

For issues or questions, please open an issue on the GitHub repository.