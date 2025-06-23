# Project Templates Guide

This guide explains how to use the built-in project templates to quickly set up new test projects.

## Available Templates

The framework includes two project templates:

### Basic Template

A simple template for general web testing, including:

- Basic project structure
- Example test
- Configuration files
- Environment setup

### Salesforce Template

A specialized template for Salesforce testing, including:

- Salesforce-specific project structure
- Authentication setup
- Page objects for common Salesforce elements
- Example tests for Salesforce functionality

## Using Templates

### Command Line

You can initialize a new project using these templates with:

```bash
# Using npx
npx agentsync init -t basic -d my-project

# Or if installed globally
agentsync init -t basic -d my-project
```

Options:
- `-t, --template`: Template to use (basic, salesforce). Default: basic
- `-d, --directory`: Target directory. Default: current directory

### NPM Script

If you have the framework installed in your project:

```bash
npm exec -- agentsync init -t salesforce -d salesforce-tests
```

## Template Structure

### Basic Template

```
basic/
├── tests/
│   └── example.spec.js  # Example test using the framework
├── .env.example         # Environment variables template
├── package.json         # Project configuration with framework dependency
└── playwright.config.js # Playwright configuration extending framework defaults
```

### Salesforce Template

```
salesforce/
├── tests/
│   └── contacts.spec.js # Example Salesforce contacts test
├── pages/
│   └── ContactPage.js   # Page object for Salesforce contacts
├── .env.example         # Salesforce-specific environment variables
├── global-setup.js      # Authentication setup for Salesforce
├── package.json         # Project configuration with framework dependency
└── playwright.config.js # Playwright configuration for Salesforce
```

## Customizing Templates

You can customize these templates for your specific needs:

1. Create a new project using a template
2. Modify the files as needed
3. Use it as a starting point for your tests

## Next Steps After Initialization

1. Navigate to the project directory:
   ```bash
   cd my-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. For Salesforce template, run the authentication setup:
   ```bash
   npm run setup
   ```

5. Run tests:
   ```bash
   npm test
   ```