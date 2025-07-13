# AgentSync Master Framework - Installation Guide

Complete installation guide for the consolidated AgentSync Master Test Framework.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

### System Dependencies

The framework includes advanced features that require native compilation. Install the appropriate system dependencies for your platform:

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install dependencies using Homebrew
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# For M1/M2 Macs, you might need:
arch -arm64 brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt-get update

# Install build essentials and dependencies
sudo apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  libpixman-1-dev \
  libfontconfig1-dev \
  libfreetype6-dev
```

#### CentOS/RHEL/Fedora
```bash
# For CentOS/RHEL
sudo yum groupinstall "Development Tools"
sudo yum install cairo-devel pango-devel libjpeg-turbo-devel giflib-devel librsvg2-devel pixman-devel fontconfig-devel freetype-devel

# For Fedora
sudo dnf groupinstall "Development Tools"
sudo dnf install cairo-devel pango-devel libjpeg-turbo-devel giflib-devel librsvg2-devel pixman-devel fontconfig-devel freetype-devel
```

#### Windows
```bash
# Install Visual Studio Build Tools
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Install Windows Build Tools via npm (alternative)
npm install --global windows-build-tools

# Install GTK dependencies
# Download GTK+ bundle from: https://www.gtk.org/docs/installations/windows/
```

## 🚀 Installation Methods

### Method 1: NPM Installation (Recommended)

```bash
# Install the framework
npm install @agentsync/master-test-framework

# Install Playwright browsers
npx playwright install

# Verify installation
npx agentsync --version
```

### Method 2: GitHub Installation

```bash
# Install directly from GitHub
npm install github:igautomation/AgentSyncMasterFramework

# Install Playwright browsers
npx playwright install

# Verify installation
npx agentsync --version
```

### Method 3: Local Development Installation

```bash
# Clone the repository
git clone https://github.com/igautomation/AgentSyncMasterFramework.git
cd AgentSyncMasterFramework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Build the framework
npm run build

# Link for local development
npm link
```

## 🔧 Alternative Installation (Without Optional Dependencies)

If you encounter issues with native dependencies, you can install without optional packages:

```bash
# Install without canvas and chart generation
npm install @agentsync/master-test-framework --no-optional

# Note: This will disable some features:
# - Chart generation
# - Advanced accessibility reporting
# - PDF report generation
```

## 🛠️ Post-Installation Setup

### 1. Initialize a New Project

```bash
# Create a new test project
npx agentsync init my-test-project
cd my-test-project

# Install project dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or your preferred editor
```

### 3. Verify Installation

```bash
# Run framework validation
npm run validate:framework

# Run a simple test
npm test -- --grep "framework validation"

# Check all features
npx agentsync doctor
```

## 🔐 Environment Configuration

### Basic Configuration (.env)

```bash
# Base URL for testing
BASE_URL=https://your-app.com

# Salesforce Configuration
SF_LOGIN_URL=https://test.salesforce.com
SF_USERNAME=your-username@company.com
SF_PASSWORD=your-password
SF_SECURITY_TOKEN=your-security-token

# TestRail Configuration
TESTRAIL_URL=https://your-company.testrail.io
TESTRAIL_USERNAME=your-username
TESTRAIL_PASSWORD=your-password
TESTRAIL_PROJECT_ID=1

# API Configuration
API_BASE_URL=https://api.your-app.com
API_KEY=your-api-key

# Reporting Configuration
REPORT_OUTPUT_DIR=./reports
ENABLE_CHARTS=true
ENABLE_PDF_REPORTS=true

# CI/CD Configuration
CI_ENVIRONMENT=local
PARALLEL_WORKERS=4
```

### Advanced Configuration

```bash
# Performance Testing
PERFORMANCE_BUDGET_LOAD_TIME=3000
PERFORMANCE_BUDGET_FCP=1500

# Accessibility Testing
ACCESSIBILITY_STANDARD=WCAG21AA
ACCESSIBILITY_TAGS=wcag2a,wcag2aa,wcag21aa

# Visual Testing
VISUAL_THRESHOLD=0.2
VISUAL_UPDATE_SNAPSHOTS=false

# Security
ENCRYPT_SENSITIVE_DATA=true
CREDENTIAL_ROTATION_DAYS=30

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
```

## 🐳 Docker Installation

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/igautomation/AgentSyncMasterFramework.git
cd AgentSyncMasterFramework

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Build and run with Docker Compose
docker-compose up --build

# Run tests in Docker
docker-compose run tests npm test
```

### Using Dockerfile

```bash
# Build the Docker image
docker build -t agentsync-master-framework .

# Run tests in container
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -e SF_USERNAME=$SF_USERNAME \
  -e SF_PASSWORD=$SF_PASSWORD \
  agentsync-master-framework npm test
```

## 🔍 Troubleshooting

### Common Installation Issues

#### Issue: Canvas/Cairo compilation errors
```bash
# Solution 1: Install system dependencies (see above)
# Solution 2: Install without optional dependencies
npm install @agentsync/master-test-framework --no-optional
```

#### Issue: Playwright browser installation fails
```bash
# Clear npm cache
npm cache clean --force

# Install browsers with dependencies
npx playwright install --with-deps

# For specific browsers only
npx playwright install chromium firefox webkit
```

#### Issue: Permission errors on macOS/Linux
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm for Node.js management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

#### Issue: Windows build tools errors
```bash
# Install Visual Studio Build Tools
npm install --global windows-build-tools

# Or install Visual Studio Community with C++ workload
# Download from: https://visualstudio.microsoft.com/vs/community/
```

### Verification Commands

```bash
# Check Node.js and npm versions
node --version
npm --version

# Check Playwright installation
npx playwright --version

# Check framework installation
npx agentsync --version

# Run framework doctor
npx agentsync doctor

# Test basic functionality
npx agentsync test --dry-run
```

## 📦 Package Structure

After installation, your project will have:

```
your-project/
├── .env                    # Environment configuration
├── .env.example           # Environment template
├── playwright.config.js   # Playwright configuration
├── package.json           # Project dependencies
├── src/
│   ├── tests/             # Test files
│   ├── pages/             # Page objects
│   └── utils/             # Custom utilities
├── reports/               # Test reports
└── node_modules/
    └── @agentsync/
        └── master-test-framework/  # Framework files
```

## 🔄 Updating the Framework

```bash
# Check current version
npm list @agentsync/master-test-framework

# Update to latest version
npm update @agentsync/master-test-framework

# Update Playwright browsers
npx playwright install

# Verify update
npx agentsync --version
```

## 🆘 Getting Help

If you encounter issues during installation:

1. **Check the troubleshooting section above**
2. **Run the framework doctor**: `npx agentsync doctor`
3. **Check system dependencies**: Ensure all native dependencies are installed
4. **Review logs**: Check npm install logs for specific error messages
5. **Create an issue**: Report installation problems on GitHub

## 📚 Next Steps

After successful installation:

1. **Read the User Guide**: [USER_GUIDE.md](./USER_GUIDE.md)
2. **Review Examples**: Check the `/examples` directory
3. **Configure your environment**: Set up `.env` file
4. **Write your first test**: Follow the Quick Start guide
5. **Explore advanced features**: Review the Features documentation

---

**Installation Complete!** You're now ready to use the AgentSync Master Test Framework for comprehensive test automation.