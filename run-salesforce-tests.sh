#!/bin/bash

# Script to run Salesforce tests with improved reliability

# First ensure we have a valid authentication state
echo "Refreshing Salesforce authentication..."
npx playwright test src/tests/salesforce/salesforce-login.spec.js

# Run the minimal test first
echo "Running minimal Salesforce test..."
npx playwright test src/tests/salesforce/minimal-sf-flow.spec.js

# Run all Salesforce tests if the minimal test passes
if [ $? -eq 0 ]; then
  echo "Minimal test passed, running all Salesforce tests..."
  npx playwright test --project=salesforce
else
  echo "Minimal test failed, please check the authentication and configuration"
  exit 1
fi