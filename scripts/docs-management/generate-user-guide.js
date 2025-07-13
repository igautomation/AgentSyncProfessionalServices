/**
 * Script to generate a consolidated user guide from individual markdown files
 */
const fs = require('fs');
const path = require('path');

// Configuration
const userGuidePath = path.join(__dirname, '..', 'docs', 'user-guide');
const outputPath = path.join(__dirname, '..', 'docs', 'CONSOLIDATED_USER_GUIDE.md');
const fileOrder = [
  'index.md',
  'README.md',
  'QUICK_START.md',
  'INSTALLATION.md',
  'USAGE.md',
  'ENVIRONMENT_VARIABLES.md',
  'TEMPLATES_GUIDE.md',
  'MULTI_PROJECT_GUIDE.md',
  'README-SALESFORCE-TESTS.md',
  'salesforce-test-improvements.md'
];

// Function to read a file and return its content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return '';
  }
}

// Function to process markdown content
function processMarkdown(content, fileName) {
  // Remove front matter if present
  content = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Add a separator between files
  return `\n\n<!-- ${fileName} -->\n\n${content}`;
}

// Main function to generate the consolidated guide
function generateConsolidatedGuide() {
  console.log('Generating consolidated user guide...');
  
  let consolidatedContent = '# AgentSync Professional Services Framework - Consolidated User Guide\n\n';
  consolidatedContent += 'This document is a consolidated version of all user guide documents.\n\n';
  consolidatedContent += '## Table of Contents\n\n';
  
  // Add table of contents
  fileOrder.forEach(fileName => {
    if (fileName === 'index.md') return; // Skip index in TOC
    const displayName = fileName.replace('.md', '').replace(/^README-/, '').replace(/^README$/, 'Introduction');
    consolidatedContent += `- [${displayName}](#${displayName.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  
  // Add content from each file
  fileOrder.forEach(fileName => {
    const filePath = path.join(userGuidePath, fileName);
    if (fs.existsSync(filePath)) {
      const content = readFile(filePath);
      consolidatedContent += processMarkdown(content, fileName);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
  
  // Write the consolidated guide
  fs.writeFileSync(outputPath, consolidatedContent);
  console.log(`Consolidated user guide generated at: ${outputPath}`);
}

// Execute the main function
generateConsolidatedGuide();