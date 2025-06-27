#!/bin/bash
# Script to export the framework to a client repository

# Check if client repo URL is provided
if [ -z "$1" ]; then
  echo "Usage: ./export-framework.sh <client-repo-url> [branch-name]"
  echo "Example: ./export-framework.sh https://github.com/client/repo.git main"
  exit 1
fi

CLIENT_REPO=$1
BRANCH=${2:-main}  # Default to main if not specified
TEMP_DIR=$(mktemp -d)

echo "Exporting framework to $CLIENT_REPO on branch $BRANCH"

# Clone the client repository
echo "Cloning client repository..."
git clone $CLIENT_REPO $TEMP_DIR
cd $TEMP_DIR

# Create or checkout the target branch
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH

# Copy files from framework (excluding .git directory)
echo "Copying framework files..."
rsync -av --exclude='.git' --exclude='export-framework.sh' "$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")"/ ./

# Commit and push changes
echo "Committing changes..."
git add .
git commit -m "Import Playwright testing framework"

echo "Ready to push. Run the following command to push to the client repository:"
echo "cd $TEMP_DIR && git push origin $BRANCH"
echo ""
echo "Temporary directory: $TEMP_DIR"