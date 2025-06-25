/**
 * Script to create a categorized index of Markdown files
 */
const fs = require('fs');
const path = require('path');

// Configuration
const repoDir = path.join(__dirname, '..', 'docs', 'repository');
const indexPath = path.join(repoDir, 'categorized-index.md');

// Define categories and their patterns
const categories = [
  {
    name: 'Getting Started',
    patterns: ['QUICK_START', 'INSTALLATION', 'README', 'getting-started', 'intro']
  },
  {
    name: 'User Guides',
    patterns: ['USAGE', 'USER_GUIDE', 'user-guide', 'GUIDE', 'guide']
  },
  {
    name: 'Salesforce Testing',
    patterns: ['salesforce', 'SALESFORCE']
  },
  {
    name: 'API Testing',
    patterns: ['api-testing', 'API']
  },
  {
    name: 'Configuration',
    patterns: ['ENVIRONMENT', 'config', 'CONFIG', 'SETUP']
  },
  {
    name: 'Templates',
    patterns: ['TEMPLATES', 'templates']
  },
  {
    name: 'Project Setup',
    patterns: ['CLIENT_SETUP', 'project-setup']
  },
  {
    name: 'Publishing and Distribution',
    patterns: ['PUBLISH', 'DISTRIBUTION', 'distribution']
  },
  {
    name: 'Development',
    patterns: ['DEVELOPMENT', 'development']
  }
];

// Function to get all Markdown files in the repository
function getMarkdownFiles() {
  return fs.readdirSync(repoDir)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .filter(file => file !== 'index.md' && file !== 'categorized-index.md');
}

// Function to categorize a file
function categorizeFile(file) {
  for (const category of categories) {
    if (category.patterns.some(pattern => file.includes(pattern))) {
      return category.name;
    }
  }
  return 'Other';
}

// Main function to create the categorized index
function createCategorizedIndex() {
  console.log('Creating categorized index...');
  
  const files = getMarkdownFiles();
  const categorizedFiles = {};
  
  // Initialize categories
  for (const category of categories) {
    categorizedFiles[category.name] = [];
  }
  categorizedFiles['Other'] = [];
  
  // Categorize files
  files.forEach(file => {
    const category = categorizeFile(file);
    const originalPath = file.replace(/^docs-/, 'docs/').replace(/-/g, '/');
    categorizedFiles[category].push({ file, originalPath });
  });
  
  // Create index content
  let indexContent = '# Categorized Markdown Files Repository\n\n';
  indexContent += 'This directory contains all Markdown files from the project, organized by category.\n\n';
  indexContent += '## Table of Contents\n\n';
  
  // Add table of contents
  Object.keys(categorizedFiles).forEach(category => {
    if (categorizedFiles[category].length > 0) {
      indexContent += `- [${category}](#${category.toLowerCase().replace(/\s+/g, '-')})\n`;
    }
  });
  
  // Add categories and files
  Object.keys(categorizedFiles).forEach(category => {
    if (categorizedFiles[category].length > 0) {
      indexContent += `\n## ${category}\n\n`;
      categorizedFiles[category].forEach(({ file, originalPath }) => {
        // Display the original path but link to the file in the repository
        indexContent += `- [${originalPath}](${file})\n`;
      });
    }
  });
  
  // Write the index file
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created categorized index at ${indexPath}`);
}

// Execute
createCategorizedIndex();