/**
 * Script to organize all documentation
 * This script runs all the documentation organization steps in sequence
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const rootDir = path.join(__dirname, '..');
const repoDir = path.join(rootDir, 'docs', 'repository');

// Function to run a script and log its output
function runScript(scriptPath) {
  console.log(`Running ${path.basename(scriptPath)}...`);
  try {
    // Use direct require instead of execSync to avoid path issues
    require(scriptPath);
    console.log(`Completed ${path.basename(scriptPath)}`);
  } catch (error) {
    console.error(`Error running ${path.basename(scriptPath)}: ${error.message}`);
    process.exit(1);
  }
}

// Main function
function organizeDocumentation() {
  console.log('Starting documentation organization...');
  
  // Step 1: Collect all Markdown files
  runScript(path.join(__dirname, 'collect-markdown.js'));
  
  // Step 2: Create categorized index
  runScript(path.join(__dirname, 'create-categorized-index.js'));
  
  // Step 3: Update user guide
  runScript(path.join(__dirname, 'update-user-guide.js'));
  
  // Step 4: Create README for the repository
  const readmePath = path.join(repoDir, 'README.md');
  const readmeContent = `# Documentation Repository

This directory contains all Markdown documentation files from the project, organized for easy reference.

## Navigation

- [Alphabetical Index](index.md) - All files listed alphabetically
- [Categorized Index](categorized-index.md) - Files organized by category

## Usage

This repository is intended to provide a single location for all documentation files, making it easier to find and reference documentation.

## Updating

To update this repository with the latest documentation files, run:

\`\`\`bash
npm run collect:markdown
npm run categorize:markdown
\`\`\`

Or to run all documentation organization steps:

\`\`\`bash
npm run organize:docs
\`\`\`
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`Created README at ${path.relative(rootDir, readmePath)}`);
  
  console.log('Documentation organization complete!');
}

// Execute
organizeDocumentation();