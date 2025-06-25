# Project Templates

This directory contains templates for quickly setting up new test projects using the AgentSync Test Framework.

## Available Templates

### Basic Template

A simple template for general web testing:

```
basic/
├── tests/
│   └── example.spec.js
├── .env.example
├── package.json
└── playwright.config.js
```

### Salesforce Template

A template specifically for Salesforce testing:

```
salesforce/
├── tests/
│   └── contacts.spec.js
├── pages/
│   └── ContactPage.js
├── .env.example
├── global-setup.js
├── package.json
└── playwright.config.js
```

## Usage

You can initialize a new project using these templates with:

```bash
# Using npx
npx @igautomation/agentsyncprofessionalservices init -t basic -d my-project

# Or if installed globally
agentsync-init -t basic -d my-project
```

Options:
- `-t, --template`: Template to use (basic, salesforce). Default: basic
- `-d, --directory`: Target directory. Default: current directory

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