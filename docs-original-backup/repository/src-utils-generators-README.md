# Page Object Generator

This directory contains utilities for generating page objects and test files from web pages.

## Overview

The page object generator creates page objects and corresponding test files from web pages. It supports:

- Standard web pages
- Salesforce pages
- Authentication
- Element extraction
- DOM collection extraction
- Test file generation

## Usage

```bash
node generate-page.js --url "https://example.com" --name ExamplePage --generate-tests
```

### Options

- `--url`, `-u`: URL to generate page object from (required)
- `--name`, `-n`: Name of the page class
- `--output`, `-o`: Output directory (default: ./src/pages)
- `--visible`, `-v`: Run in visible browser mode
- `--username`: Username for authentication
- `--password`: Password for authentication
- `--salesforce`, `-sf`: Generate Salesforce-specific page object
- `--no-collections`: Don't include DOM collection methods
- `--generate-tests`, `-t`: Generate test files
- `--help`, `-h`: Show help message

## Files

- `generate-page.js`: Main CLI entry point
- `page-generator.js`: Core functionality for generating page objects and tests
- `element-extractor.js`: Extracts elements from web pages
- `domCollections.js`: Handles DOM collections like tables and lists
- `config.js`: Configuration for the generator
- `verify-paths.js`: Utility to verify page generator paths
- `improve-generator.js`: Utility to improve the page generator

## Examples

### Basic Example

```bash
node generate-page.js --url "https://example.com" --name HomePage
```

### Salesforce Example

```bash
node generate-page.js --url "https://your-instance.salesforce.com/lightning/o/Contact/new" --name ContactForm --salesforce --username "user@example.com" --password "password" --generate-tests
```

### Visible Mode

```bash
node generate-page.js --url "https://example.com" --name HomePage --visible
```

## Troubleshooting

If you encounter issues with the generated files:

1. Run `node verify-paths.js` to check for path issues
2. Run `node improve-generator.js` to apply improvements to the generator
3. Check that the BasePage class exists in the output directory