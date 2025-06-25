# Environment Variables and Configuration

This document explains how to properly configure the framework using environment variables to avoid hard-coded values in your tests.

## Why Use Environment Variables?

Using environment variables instead of hard-coded values provides several benefits:

1. **Security**: Sensitive information like credentials and API keys are not stored in code
2. **Flexibility**: Different environments (dev, QA, prod) can use different configurations
3. **Portability**: The same code can run in different environments without modification
4. **Compliance**: Meets security requirements for client deployments
5. **Multi-project support**: Enables the framework to be used across multiple projects

## Setting Up Environment Variables

### Step 1: Create Environment-Specific Files

Copy the `.env.example` file to create environment-specific files:

```bash
cp .env.example .env.dev
cp .env.example .env.qa
cp .env.example .env.prod
```

### Step 2: Configure Each Environment

Edit each file to include the appropriate values for that environment. For example, in `.env.dev`:

```
# Base URLs
API_BASE_URL=https://dev-api.example.com
BASE_URL=https://dev.example.com

# API Keys
API_KEY=dev-api-key-123

# Test Credentials
USERNAME=testuser
PASSWORD=testpass
```

### Step 3: Load Environment Variables in Tests

In your test files, load the appropriate environment variables:

```javascript
// Load environment variables from .env.dev
require('dotenv').config({ path: '.env.dev' });

// Or dynamically based on a NODE_ENV variable
const env = process.env.NODE_ENV || 'dev';
require('dotenv').config({ path: `.env.${env}` });
```

### Step 4: Use Environment Variables in Tests

Access environment variables in your tests:

```javascript
const { test, expect } = require('@playwright/test');

test('API test', async ({ request }) => {
  // Use environment variables instead of hard-coded values
  const response = await request.get(`${process.env.API_BASE_URL}/users/1`);
  expect(response.status()).toBe(200);
});
```

## Important Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BASE_URL` | Base URL for UI tests | `https://example.com` |
| `API_BASE_URL` | Base URL for API tests | `https://api.example.com` |
| `API_KEY` | API key for authentication | `your-api-key` |
| `USERNAME` | Username for login tests | `testuser` |
| `PASSWORD` | Password for login tests | `testpass` |
| `SF_USERNAME` | Salesforce username | `user@example.com` |
| `SF_PASSWORD` | Salesforce password | `password` |
| `SF_LOGIN_URL` | Salesforce login URL | `https://login.salesforce.com` |
| `SF_INSTANCE_URL` | Salesforce instance URL | `https://instance.salesforce.com` |

## Environment Variables in CI/CD

For CI/CD pipelines, set environment variables in your CI/CD platform:

### GitHub Actions

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ secrets.BASE_URL }}
      API_BASE_URL: ${{ secrets.API_BASE_URL }}
      API_KEY: ${{ secrets.API_KEY }}
      USERNAME: ${{ secrets.USERNAME }}
      PASSWORD: ${{ secrets.PASSWORD }}
    steps:
      # Your steps here
```

### Jenkins

```groovy
pipeline {
  environment {
    BASE_URL = credentials('base-url')
    API_BASE_URL = credentials('api-base-url')
    API_KEY = credentials('api-key')
    USERNAME = credentials('username')
    PASSWORD = credentials('password')
  }
  
  stages {
    // Your stages here
  }
}
```

## Security Best Practices

1. **Never commit environment files**: Add `.env.*` to your `.gitignore` file
2. **Use secrets management**: Store sensitive values in your CI/CD platform's secrets manager
3. **Rotate credentials**: Regularly rotate API keys and passwords
4. **Limit access**: Restrict access to environment variables to only those who need them
5. **Use different values**: Use different credentials for different environments

## Troubleshooting

If your tests can't access environment variables:

1. Verify the `.env` file exists in the correct location
2. Check that `dotenv` is properly configured
3. Ensure the variable is defined in your environment file
4. Try logging `process.env` to debug (but never in production code)
5. Check for typos in variable names