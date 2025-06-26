#!/bin/bash

# Setup script for private GitHub dependencies
# This script helps set up authentication for private GitHub packages

# Check if GitHub token is provided
if [ -z "$1" ]; then
  echo "Usage: ./setup-private-deps.sh YOUR_GITHUB_TOKEN"
  echo "You need to provide a GitHub Personal Access Token with 'read:packages' scope"
  exit 1
fi

GITHUB_TOKEN=$1

# Create or update .npmrc file
echo "Creating .npmrc file with GitHub authentication..."
echo "@igautomation:registry=https://npm.pkg.github.com/" > .npmrc
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc

echo "Setting up git config for GitHub packages..."
git config --global url."https://$GITHUB_TOKEN:x-oauth-basic@github.com/".insteadOf "https://github.com/"

echo "Setup complete! You can now install private dependencies."
echo "Run 'npm install' to install all dependencies including private packages."

# Optional: Install dependencies automatically
read -p "Do you want to install dependencies now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm install
fi