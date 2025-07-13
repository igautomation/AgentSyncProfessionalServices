/**
 * Script to update the user guide with the master README
 */
const fs = require('fs');
const path = require('path');

// Paths
const masterReadmePath = path.join(__dirname, '..', 'MASTER_README.md');
const userGuidePath = path.join(__dirname, '..', 'docs', 'user-guide');
const userGuideMasterPath = path.join(userGuidePath, 'MASTER_README.md');

// Copy the master README to the user guide directory
console.log('Copying master README to user guide directory...');
fs.copyFileSync(masterReadmePath, userGuideMasterPath);
console.log(`Master README copied to ${userGuideMasterPath}`);

// Update the index.md to reference the master README
const indexPath = path.join(userGuidePath, 'index.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add reference to master README if it doesn't exist
if (!indexContent.includes('MASTER_README.md')) {
  const insertPoint = indexContent.indexOf('## Table of Contents');
  if (insertPoint !== -1) {
    const newContent = indexContent.slice(0, insertPoint) +
      '> **Note**: For a quick overview of the framework, see the [Master README](./MASTER_README.md).\n\n' +
      indexContent.slice(insertPoint);
    fs.writeFileSync(indexPath, newContent);
    console.log('Updated index.md with reference to master README');
  }
}

// Run the generate-user-guide.js script to update the consolidated guide
console.log('Updating consolidated user guide...');
require('./generate-user-guide.js');

console.log('User guide update complete!');