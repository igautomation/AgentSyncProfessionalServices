/**
 * Script to collect all Markdown files from the project root into a common repository
 */
const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname, '..');
const repoDir = path.join(rootDir, 'docs', 'repository');
const excludeDirs = [
  'node_modules',
  '.git',
  '.history',
  'docs/repository', // Avoid copying files we're creating
  'docs-original-backup', // Skip backup files
  'docs-site/node_modules'
];

// Create repository directory if it doesn't exist
if (!fs.existsSync(repoDir)) {
  fs.mkdirSync(repoDir, { recursive: true });
}

// Function to find all Markdown files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(rootDir, filePath);
    const stat = fs.statSync(filePath);
    
    // Skip excluded directories
    if (stat.isDirectory()) {
      if (!excludeDirs.some(excludeDir => relativePath.startsWith(excludeDir))) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to copy a file with a unique name
function copyFileToRepo(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const fileName = relativePath.replace(/\//g, '-');
  const destPath = path.join(repoDir, fileName);
  
  fs.copyFileSync(filePath, destPath);
  return { source: relativePath, dest: path.relative(rootDir, destPath) };
}

// Main function
function collectMarkdownFiles() {
  console.log('Finding Markdown files...');
  const markdownFiles = findMarkdownFiles(rootDir);
  console.log(`Found ${markdownFiles.length} Markdown files`);
  
  console.log('Copying files to repository...');
  const copied = markdownFiles.map(copyFileToRepo);
  
  // Create an index file
  const indexPath = path.join(repoDir, 'index.md');
  let indexContent = '# Markdown Files Repository\n\n';
  indexContent += 'This directory contains all Markdown files from the project.\n\n';
  indexContent += '## Files\n\n';
  
  copied.forEach(file => {
    indexContent += `- [${file.source}](${path.basename(file.dest)})\n`;
  });
  
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created index file at ${path.relative(rootDir, indexPath)}`);
  
  console.log('Done!');
  return copied;
}

// Execute
const copied = collectMarkdownFiles();

// Export for use in other scripts
module.exports = { copied };