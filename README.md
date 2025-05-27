# Playwright Testing Framework

A comprehensive testing framework built with Playwright.

## Features

- API testing utilities
- UI testing utilities
- Salesforce integration
- Performance testing
- Accessibility testing
- Visual comparison
- Test coverage analysis

## Getting Started

### Installation

```bash
npm install
```

### Running Tests

```bash
npm test
```

### Test Coverage

Run coverage analysis:

```bash
npm run coverage
```

This will:
- Run all tests in the project
- Generate coverage reports in HTML, JSON, and text formats
- Check coverage against thresholds (70% lines, 70% functions, 40% branches)
- Exit with error code if thresholds are not met

The HTML coverage report will be available at `coverage/index.html`.

## Project Structure

- `src/utils/` - Utility functions and helpers
- `src/tests/` - Test files
- `src/config/` - Configuration files
- `scripts/` - Helper scripts