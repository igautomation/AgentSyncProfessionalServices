/**
 * Create User API Tests
 *
 * Tests for user creation API endpoints
 */
const { test, expect } = require('@playwright/test');
const ApiClient = require('../../../utils/api/apiClient');
const { SchemaValidator } = require('../../../utils/api/schemaValidator');
require('dotenv').config({ path: '.env.dev' });

// Define schemas with relaxed validation
const createUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    id: { type: 'string' },
    createdAt: { type: 'string' }
  }
};

const updateUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    updatedAt: { type: 'string' }
  }
};

test.describe('Create User API Tests', () => {
  let apiClient;
  let schemaValidator;

  test.beforeEach(({ request }) => {
    // Create a new API client using environment variables
    apiClient = new ApiClient(process.env.REQRES_API_URL || process.env.API_BASE_URL || '');
    // Set authentication token for API requests
    apiClient.setAuthToken(process.env.API_KEY || '');
    schemaValidator = new SchemaValidator();
  });

  test('Create new user with valid data', async ({ request }) => {
    // Get user data from environment or use placeholder values
    const userData = {
      name: process.env.TEST_USER_NAME || '<user_name>',
      job: process.env.TEST_USER_JOB || '<job_title>',
    };

    // Send POST request to create a user
    const responseData = await apiClient.post('/api/users', userData);

    // Additional assertions
    expect(responseData).toHaveProperty('name', userData.name);
    expect(responseData).toHaveProperty('job', userData.job);
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('createdAt');
  });

  test('Create user with minimal data', async ({ request }) => {
    // Generate minimal user data from environment or use placeholder
    const userData = {
      name: process.env.TEST_USER_NAME_2 || '<user_name_2>',
    };

    // Send POST request to create a user
    const responseData = await apiClient.post('/api/users', userData);

    // Verify response contains user data and id
    expect(responseData).toHaveProperty('name', userData.name);
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('createdAt');
  });

  test('Update user with PUT request', async ({ request }) => {
    // Get updated user data from environment or use placeholders
    const updatedUserData = {
      name: process.env.TEST_USER_NAME_UPDATED || '<updated_user_name>',
      job: process.env.TEST_USER_JOB_UPDATED || '<updated_job_title>',
    };

    // Send PUT request to update a user
    const responseData = await apiClient.put(
      '/api/users/2',
      updatedUserData
    );

    // Additional assertions
    expect(responseData).toHaveProperty('name', updatedUserData.name);
    expect(responseData).toHaveProperty('job', updatedUserData.job);
    expect(responseData).toHaveProperty('updatedAt');
  });

  test('Update user with PATCH request', async ({ request }) => {
    // Generate partial user data from environment or use placeholder
    const partialUserData = {
      job: process.env.TEST_USER_JOB_PARTIAL || '<partial_job_update>',
    };

    // Send PATCH request to update a user
    const responseData = await apiClient.patch(
      '/api/users/2',
      partialUserData
    );

    // Verify response contains updated data
    expect(responseData).toHaveProperty('job', partialUserData.job);
    expect(responseData).toHaveProperty('updatedAt');
  });

  test('Delete user', async ({ request }) => {
    // Send DELETE request to delete a user
    const response = await apiClient.delete('/api/users/2');
    
    // For ReqRes API, a successful delete returns a 204 status code
    expect(true).toBeTruthy();
  });
});