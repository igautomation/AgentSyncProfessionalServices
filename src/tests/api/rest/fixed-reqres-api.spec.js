/**
 * ReqRes API Tests with Schema Validation
 * 
 * Tests for ReqRes API with JSON schema validation
 */
const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../../utils/api');
const { SchemaValidator } = require('../../../utils/api/schemaValidator');
const config = require('../../../config');

// Read base URL from environment or config
const baseUrl = process.env.API_BASE_URL || config.api?.baseUrl;

// Load schemas from config or use defaults
const schemas = config.api?.schemas || {
  usersList: {
    type: 'object',
    required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
    properties: {
      page: { type: 'number' },
      per_page: { type: 'number' },
      total: { type: 'number' },
      total_pages: { type: 'number' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
          properties: {
            id: { type: 'number' },
            email: { type: 'string', format: 'email' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            avatar: { type: 'string', format: 'uri' }
          }
        }
      },
      support: {
        type: 'object',
        required: ['url', 'text'],
        properties: {
          url: { type: 'string', format: 'uri' },
          text: { type: 'string' }
        }
      }
    }
  },
  singleUser: {
    type: 'object',
    required: ['data', 'support'],
    properties: {
      data: {
        type: 'object',
        required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
        properties: {
          id: { type: 'number' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          avatar: { type: 'string', format: 'uri' }
        }
      },
      support: {
        type: 'object',
        required: ['url', 'text'],
        properties: {
          url: { type: 'string', format: 'uri' },
          text: { type: 'string' }
        }
      }
    }
  },
  createUser: {
    type: 'object',
    required: ['name', 'job', 'id', 'createdAt'],
    properties: {
      name: { type: 'string' },
      job: { type: 'string' },
      id: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  }
};

test.describe('ReqRes API with Schema Validation', () => {
  let apiClient;
  let schemaValidator;
  
  test.beforeEach(({ request }) => {
    apiClient = new ApiClient(baseUrl);
    schemaValidator = new SchemaValidator();
  });
  
  test('Get users list with schema validation', async ({ request }) => {
    // Get page parameter from environment or config
    const page = parseInt(process.env.TEST_PAGE) || config.api?.testData?.page;
    
    // Send GET request to list users endpoint
    const responseData = await apiClient.get('/users', {
      params: { page }
    });
    
    // Validate response against schema
    const validationResult = schemaValidator.validate(responseData, schemas.usersList);
    expect(validationResult.valid).toBeTruthy();
    
    // Additional assertions
    expect(responseData.page).toBe(page);
    expect(responseData.data.length).toBeGreaterThan(0);
  });
  
  test('Get single user with schema validation', async ({ request }) => {
    // Get user ID from environment or config
    const userId = parseInt(process.env.TEST_USER_ID) || config.api?.testData?.userId;
    
    // Send GET request to get a specific user
    const responseData = await apiClient.get(`/users/${userId}`);
    
    // Validate response against schema
    const validationResult = schemaValidator.validate(responseData, schemas.singleUser);
    expect(validationResult.valid).toBeTruthy();
    
    // Additional assertions
    expect(responseData.data.id).toBe(userId);
  });
  
  test('Create user with schema validation', async ({ request }) => {
    // Get user data from environment or config
    const userData = {
      name: process.env.NEW_USER_NAME || config.api?.testData?.newUser?.name,
      job: process.env.NEW_USER_JOB || config.api?.testData?.newUser?.job
    };
    
    // Send POST request to create a user
    const responseData = await apiClient.post('/users', userData);
    
    // Validate response against schema
    const validationResult = schemaValidator.validate(responseData, schemas.createUser);
    expect(validationResult.valid).toBeTruthy();
    
    // Additional assertions
    expect(responseData.name).toBe(userData.name);
    expect(responseData.job).toBe(userData.job);
  });
  
  test('Validate error response for non-existent resource', async ({ request }) => {
    // Get non-existent resource ID from environment or config
    const resourceId = parseInt(process.env.TEST_NONEXISTENT_USER_ID) || config.api?.testData?.nonExistentUserId;
    
    try {
      // Send GET request for a non-existent resource
      await apiClient.get(`/unknown/${resourceId}`);
      // If we get here, the request didn't fail as expected
      expect(false).toBeTruthy('Expected request to fail with 404');
    } catch (error) {
      // Verify response status is 404 Not Found
      expect(error.status).toBe(404);
      
      // Verify response body is empty object
      expect(Object.keys(error.data || {}).length).toBe(0);
    }
  });
});