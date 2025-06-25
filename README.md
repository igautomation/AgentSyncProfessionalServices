# AgentSync Professional Services

A comprehensive test automation framework for multi-project distribution.

## Installation

You can install this package directly from GitHub:

```bash
npm install github:igautomation/AgentSyncProfessionalServices
```

### System Dependencies

This package uses the `canvas` library which requires native compilation. If you encounter errors during installation related to `canvas`, you'll need to install system dependencies.

#### macOS

Using Homebrew:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

#### Windows

For Windows, you'll need to install:
1. Microsoft Visual C++ Build Tools
2. GTK 2
3. libjpeg-turbo

See [SYSTEM_DEPENDENCIES.md](./docs/SYSTEM_DEPENDENCIES.md) for detailed instructions.

### Alternative Installation

If you're unable to install the system dependencies, you can use the `--no-optional` flag:

```bash
npm install github:igautomation/AgentSyncProfessionalServices --no-optional
```

This will skip the installation of the `canvas` dependency, but some features like accessibility testing and chart generation may not work fully.

## Features

- End-to-end testing with Playwright
- API testing
- Accessibility testing
- Salesforce integration
- Data-driven testing
- Reporting and visualization
- CLI tools

## Usage

```javascript
const { test, expect } = require('@igautomation/agentsyncprofessionalservices/fixtures');

test('My first test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

## Documentation

For more detailed documentation, see the [User Guide](./docs/USER_GUIDE.md).

## License

MIT