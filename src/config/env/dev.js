/**
 * Development environment configuration
 * 
 * Configure your test applications in .env.dev file
 */
require('dotenv').config({ path: '.env.dev' });

module.exports = {
  baseUrl: process.env.BASE_URL || '',
  apiUrl: process.env.API_URL || '',
  credentials: {
    username: process.env.TEST_USERNAME || '',
    password: process.env.TEST_PASSWORD || '',
  },
  timeouts: {
    default: 30000,
    navigation: 30000,
    action: 15000,
    expect: 10000,
  },
  reporting: {
    screenshotOnFailure: true,
    videoOnFailure: true,
    traceOnFailure: true,
  },
};
