/**
 * Script to ensure reports directories exist before tests run
 */
const fs = require('fs');
const path = require('path');

// Define directories to create
const directories = [
  'reports',
  'reports/accessibility',
  'reports/api',
  'reports/e2e',
  'reports/salesforce',
  'reports/visual',
  'test-results'
];

// Create each directory if it doesn't exist
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
});

console.log('All report directories created successfully');