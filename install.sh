#!/bin/bash

# AgentSync Test Framework Installation Script

echo "🚀 Installing AgentSync Test Framework..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if the tarball exists
if [ -f "agentsync-test-framework-1.0.0.tgz" ]; then
    echo "📦 Found local package. Installing from tarball..."
    npm install ./agentsync-test-framework-1.0.0.tgz
else
    echo "🌐 Installing from npm registry..."
    npm install agentsync-test-framework
fi

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ AgentSync Test Framework installed successfully!"
    echo ""
    echo "📚 Documentation:"
    echo "  - README: ./node_modules/agentsync-test-framework/README.md"
    echo "  - Docs: ./node_modules/agentsync-test-framework/docs/"
    echo ""
    echo "🔧 Next steps:"
    echo "  1. Create a playwright.config.js file"
    echo "  2. Set up your test directory structure"
    echo "  3. Start writing tests!"
    echo ""
    echo "For more information, visit: https://github.com/agentsync/test-framework"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi