#!/usr/bin/env node

/**
 * Utility to verify page generator paths
 */
const fs = require('fs');
const path = require('path');

// Configuration
const pagesDir = './src/pages';
const testsDir = './src/tests';

console.log('Verifying page generator paths...');

// Check if directories exist
if (!fs.existsSync(pagesDir)) {
  console.log(`Creating pages directory: ${pagesDir}`);
  fs.mkdirSync(pagesDir, { recursive: true });
}

if (!fs.existsSync(testsDir)) {
  console.log(`Creating tests directory: ${testsDir}`);
  fs.mkdirSync(testsDir, { recursive: true });
}

// Check if BasePage exists
const basePagePath = path.join(pagesDir, 'BasePage.js');
if (!fs.existsSync(basePagePath)) {
  console.log('BasePage.js not found. Please run the page generator to create it.');
} else {
  console.log('BasePage.js exists.');
}

// Check test imports
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.spec.js'));

console.log(`Found ${testFiles.length} test files.`);

let hasErrors = false;
for (const testFile of testFiles) {
  const testPath = path.join(testsDir, testFile);
  const content = fs.readFileSync(testPath, 'utf8');
  
  // Check for incorrect imports
  if (content.includes("require('../src/pages/")) {
    console.log(`Error: Incorrect import path in ${testFile}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log('Found import errors. Please fix them using the page generator utility.');
} else {
  console.log('All test imports look good!');
}

console.log('Verification complete.');