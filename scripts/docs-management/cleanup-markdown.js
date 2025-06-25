/**
 * Script to remove all .md files except those in the docs directory
 */
const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const excludeDirs = [
  'node_modules',
  '.git',
  '.history',
  'docs',  // Exclude the docs directory
  'docs-site/node_modules'  // Explicitly exclude docs-site/node_modules
];

// Function to find all Markdown files
function findMarkdownFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(rootDir, filePath);
      
      // Skip excluded directories
      if (excludeDirs.some(excludeDir => relativePath.startsWith(excludeDir))) {
        continue;
      }
      
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findMarkdownFiles(filePath, fileList);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return fileList;
}

// Function to remove a file
function removeFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error removing file ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function cleanupMarkdownFiles() {
  console.log('Finding Markdown files to remove...');
  const markdownFiles = findMarkdownFiles(rootDir);
  console.log(`Found ${markdownFiles.length} Markdown files outside the docs directory`);
  
  if (markdownFiles.length === 0) {
    console.log('No files to remove.');
    return;
  }
  
  console.log('Removing files...');
  let removedCount = 0;
  
  for (const file of markdownFiles) {
    const relativePath = path.relative(rootDir, file);
    console.log(`Removing ${relativePath}...`);
    
    if (removeFile(file)) {
      removedCount++;
    }
  }
  
  console.log(`Removed ${removedCount} of ${markdownFiles.length} Markdown files.`);
}

// Execute
cleanupMarkdownFiles();