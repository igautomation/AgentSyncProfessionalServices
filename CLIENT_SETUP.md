# Client Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your specific credentials and URLs
# Required variables for Salesforce testing:
# - SF_USERNAME
# - SF_PASSWORD  
# - SF_LOGIN_URL
# - SF_INSTANCE_URL
# - SF_SECURITY_TOKEN
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test types
npm run test:api
npm run test:e2e
npm run test:accessibility
npm run test:salesforce
```

## 📋 What Was Cleaned Up

The following development artifacts were removed for client delivery:

### Removed Directories:
- `.history/` - Development file history
- `cleanup/` - Development cleanup files
- `consolidated-docs/` - Duplicate documentation
- `docs-backup/` - Backup documentation
- `temp/` - Temporary files
- `sandbox/` - Development sandbox
- `logs/` - Test execution logs
- `playwright-report/` - Generated reports
- `test-results/` - Test results
- `reports/` - Generated reports
- `artifacts/` - Build artifacts
- `node_modules/` - Dependencies (reinstall with npm install)

### Removed Files:
- Development environment files (`.env.dev`, `.env.prod`, `.env.qa`)
- Development documentation files
- `package-lock.json` (will be regenerated)
- Temporary and log files

### Kept for Client:
- `.env.example` - Template for environment variables
- All source code and framework functionality
- Documentation in `docs/` directory
- Configuration files
- Test examples

## 🔧 Framework Features

This framework includes:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- API testing capabilities
- Accessibility testing
- Salesforce integration
- Performance testing
- Visual regression testing
- CI/CD integration
- Comprehensive reporting

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:
- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [Framework Guide](docs/FRAMEWORK_GUIDE.md)
- [Salesforce Testing Guide](docs/salesforce-testing-guide.md)

## 🔧 Troubleshooting

### Common Issues:

1. **"Cannot find module 'dotenv'" error**
   ```bash
   npm install
   ```

2. **GitHub Actions failing**
   - Ensure all dependencies are in package.json
   - Check that workflow files reference correct directories
   - Verify environment variables are set correctly

3. **Missing Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Tests not finding elements**
   - Check if `.env` file exists and has correct URLs
   - Verify network connectivity to test sites

### Verification Test:
```bash
# Run a simple test to verify setup
npx playwright test --list | head -5
```

## 🆘 Support

For questions or issues:
1. Check the documentation in the `docs/` directory
2. Review the example tests in `src/tests/examples/`
3. Check the configuration files in `src/config/`
4. Run the verification test above

## 🔒 Security Notes

- Never commit `.env` files with real credentials
- Use `.env.example` as a template
- Store sensitive credentials securely
- Review the `.gitignore` file to ensure sensitive files are excluded