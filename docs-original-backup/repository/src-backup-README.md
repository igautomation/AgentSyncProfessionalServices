# Backup Files

This directory contains backup files that were moved from the main test directories.

## Salesforce Backup

The `salesforce` directory contains the original Salesforce test files that were replaced with more reliable versions.

These files are kept for reference but should not be used in active testing as they have reliability issues.

## Why These Files Were Moved

1. The original Salesforce tests had reliability issues:
   - Navigation timeouts when trying to use the App Launcher
   - Network stability issues causing "Network did not reach idle state" errors
   - Ambiguous selectors for form fields
   - Insufficient error handling

2. New, more reliable tests were created:
   - `fixed-sf-login.spec.js` - Improved login test
   - `fixed-account-contact.spec.js` - Reliable account/contact creation test
   - `minimal-navigation.spec.js` - Diagnostic navigation test

## Using the Backup Files

If you need to reference these files, be aware that they may have dependencies on other files that are no longer in the main test directories. You may need to restore related files or modify the imports to make them work again.