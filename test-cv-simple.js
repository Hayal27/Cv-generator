#!/usr/bin/env node

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5003/api';
let authToken = '';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: `test.${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

const testCVData = {
  title: 'Test CV',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    city: 'New York',
    country: 'USA'
  },
  summary: 'Test summary',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: []
};

async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...(data && { data })
    };

    console.log(`Making ${method} request to ${config.url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }

    const response = await axios(config);
    console.log(`Response status: ${response.status}`);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    console.log(`Request failed with status: ${error.response?.status || 'No status'}`);
    console.log('Error data:', JSON.stringify(error.response?.data || error.message, null, 2));
    
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

async function testServerHealth() {
  console.log('\n=== Testing Server Health ===');
  const result = await makeRequest('GET', '/health');
  return result.success;
}

async function testUserRegistration() {
  console.log('\n=== Testing User Registration ===');
  const result = await makeRequest('POST', '/auth/register', testUser);
  return result.success;
}

async function testUserLogin() {
  console.log('\n=== Testing User Login ===');
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await makeRequest('POST', '/auth/login', loginData);
  
  if (result.success) {
    authToken = result.data.token;
    console.log('Auth token obtained:', authToken ? 'Yes' : 'No');
  }
  
  return result.success;
}

async function testCVCreation() {
  console.log('\n=== Testing CV Creation ===');
  
  // Test with /cv route
  console.log('Testing POST /api/cv');
  let result = await makeRequest('POST', '/cv', testCVData, authToken);
  
  if (result.success) {
    console.log('✅ CV creation via /cv successful');
    return true;
  }
  
  // Test with /cv/create route
  console.log('Testing POST /api/cv/create');
  result = await makeRequest('POST', '/cv/create', testCVData, authToken);
  
  if (result.success) {
    console.log('✅ CV creation via /cv/create successful');
    return true;
  }
  
  console.log('❌ Both CV creation routes failed');
  return false;
}

async function runTests() {
  console.log('🧪 CV Generator Simple Test Suite');
  console.log('==================================');
  
  try {
    // Test server health
    const serverHealthy = await testServerHealth();
    if (!serverHealthy) {
      console.log('❌ Server is not healthy. Make sure the server is running on http://localhost:5003');
      return;
    }
    console.log('✅ Server is healthy');
    
    // Test user registration
    const registrationSuccess = await testUserRegistration();
    if (!registrationSuccess) {
      console.log('❌ User registration failed');
      return;
    }
    console.log('✅ User registration successful');
    
    // Test user login
    const loginSuccess = await testUserLogin();
    if (!loginSuccess) {
      console.log('❌ User login failed');
      return;
    }
    console.log('✅ User login successful');
    
    // Test CV creation
    const cvCreationSuccess = await testCVCreation();
    if (!cvCreationSuccess) {
      console.log('❌ CV creation failed');
      return;
    }
    console.log('✅ CV creation successful');
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run the tests
runTests();