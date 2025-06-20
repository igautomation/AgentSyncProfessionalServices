#!/bin/bash

# Setup Git Flow branching strategy for AgentSync Test Framework

echo "🌿 Setting up branching strategy..."

# Create develop branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/develop; then
    echo "Creating develop branch..."
    git checkout -b develop
    git push -u origin develop
fi

# Switch back to main
git checkout main

echo "✅ Branch strategy setup complete!"
echo ""
echo "Available branches:"
echo "  main     - Production releases"
echo "  develop  - Integration branch"
echo ""
echo "Workflow:"
echo "  1. Create feature branches from develop: git checkout -b feature/my-feature develop"
echo "  2. Create release branches from develop: git checkout -b release/1.2.0 develop"
echo "  3. Create hotfix branches from main: git checkout -b hotfix/1.2.1 main"