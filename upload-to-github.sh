#!/bin/bash
# Script to upload the framework to the specified GitHub repository

REPO_URL="https://github.com/agentsync/professional-services-qa.git"
BRANCH="main"
CURRENT_DIR=$(pwd)

echo "Uploading framework to $REPO_URL on branch $BRANCH"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed"
    exit 1
fi

# Configure git if needed
git config --global --get user.name > /dev/null || read -p "Enter your Git username: " GIT_USERNAME && git config --global user.name "$GIT_USERNAME"
git config --global --get user.email > /dev/null || read -p "Enter your Git email: " GIT_EMAIL && git config --global user.email "$GIT_EMAIL"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Working in temporary directory: $TEMP_DIR"

# Clone the target repository
echo "Cloning target repository..."
git clone $REPO_URL $TEMP_DIR
if [ $? -ne 0 ]; then
    echo "Error: Failed to clone repository. Make sure you have access to it."
    exit 1
fi

cd $TEMP_DIR

# Create or checkout the target branch
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH

# Copy files from framework (excluding .git directory and this script)
echo "Copying framework files..."
rsync -av --exclude='.git' --exclude='upload-to-github.sh' "$CURRENT_DIR/" ./

# Add all files to git
git add .

# Commit changes
git commit -m "Upload Playwright testing framework"
if [ $? -ne 0 ]; then
    echo "No changes to commit or commit failed."
    exit 1
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push origin $BRANCH

if [ $? -eq 0 ]; then
    echo "Successfully uploaded framework to $REPO_URL"
else
    echo "Error: Failed to push to GitHub. Make sure you have write access to the repository."
    echo "You may need to authenticate with GitHub. Try running these commands manually:"
    echo "cd $TEMP_DIR"
    echo "git push origin $BRANCH"
fi

# Clean up
echo "Cleaning up temporary directory..."
cd $CURRENT_DIR
rm -rf $TEMP_DIR