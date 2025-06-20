# AgentSync Test Framework

A comprehensive test automation framework for AgentSync projects.

## Installation

```bash
# Install from npm
npm install agentsync-test-framework

# Or install from local tarball
npm install ./agentsync-test-framework-1.0.0.tgz
```

For detailed installation instructions, see the [Installation Guide](docs/INSTALLATION.md).

## Usage

```javascript
const { BasePage, utils } = require('agentsync-test-framework');

// Create a page object
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#login-button');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// Use the framework utilities
const { common } = utils;
await common.waitForPageLoad(page);
```

For more examples and usage information, see the [Usage Guide](docs/USAGE.md).

## Features

- **Page Object Model**: Structured approach to organizing test code
- **Self-Healing Locators**: Resilient element locators that adapt to UI changes
- **Database Utilities**: Easy database interactions for test data management
- **Common Test Utilities**: Helper functions for common test operations
- **Plugin System**: Extensible architecture for custom functionality
- **Configuration Management**: Flexible configuration system
- **CLI Tool**: Command-line interface for project setup and management

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Usage Guide](docs/USAGE.md)
- [API Reference](docs/README.md)
- [Examples](docs/examples/)

## Project Structure

```
agentsync-test-framework/
├── src/
│   ├── config/         # Configuration files
│   ├── pages/          # Base page objects
│   ├── utils/          # Utility modules
│   └── index.js        # Main exports
├── bin/                # CLI tools
├── docs/               # Documentation
└── templates/          # Project templates
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT