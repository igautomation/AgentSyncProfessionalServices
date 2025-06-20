#!/bin/bash

# Script to publish the framework to GitHub Packages

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN is not set. Please set it before running this script."
  echo "Example: export GITHUB_TOKEN=your_personal_access_token"
  exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")/.." || exit

# Ensure we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️ Warning: You're not on the main branch. Current branch: $CURRENT_BRANCH"
  read -p "Do you want to continue anyway? (y/N): " CONTINUE
  if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
    echo "Publishing cancelled."
    exit 0
  fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ Warning: You have uncommitted changes."
  read -p "Do you want to continue anyway? (y/N): " CONTINUE
  if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
    echo "Publishing cancelled."
    exit 0
  fi
fi

# Create .npmrc file for GitHub Packages
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
echo "@agentsync:registry=https://npm.pkg.github.com" >> .npmrc

# Build the framework
echo "🔨 Building framework..."
npm run build

# Publish to GitHub Packages
echo "📦 Publishing to GitHub Packages..."
npm publish

# Clean up
rm .npmrc

echo "✅ Package published successfully!"
echo "You can now install it with: npm install @agentsync/test-framework"