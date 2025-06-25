#!/bin/bash

# Script to run the fixed Salesforce tests

echo "Running fixed Salesforce tests..."

# Step 1: Run the fixed login test first to establish authentication
echo "Step 1: Running fixed login test..."
npx playwright test src/tests/salesforce/fixed-sf-login.spec.js --headed

# Step 2: Run the minimal navigation test to diagnose navigation issues
echo "Step 2: Running minimal navigation test..."
npx playwright test src/tests/salesforce/minimal-navigation.spec.js --headed

# Step 3: Run the fixed account-contact test
echo "Step 3: Running fixed account-contact test..."
npx playwright test src/tests/salesforce/fixed-account-contact.spec.js --headed

echo "All tests completed. Check the screenshots and logs for results."