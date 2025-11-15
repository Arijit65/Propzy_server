const http = require('http');

// Test configuration
const BASE_URL = 'localhost';
const PORT = 5000;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Helper function to make HTTP requests
function makeRequest(path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;

    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Test functions
async function testUserRegistration() {
  console.log(`\n${colors.blue}━━━ Test 1: User Registration ━━━${colors.reset}`);
  
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'test123',
    userName: 'Test User',
    phone: '1234567890'
  };

  try {
    const result = await makeRequest('/auth/register', 'POST', testUser);
    
    if (result.status === 201 && result.data.success) {
      console.log(`${colors.green}✓ User registration successful${colors.reset}`);
      console.log(`  Email: ${testUser.email}`);
      console.log(`  Token received: ${result.data.token ? 'Yes' : 'No'}`);
      return { user: testUser, token: result.data.token };
    } else {
      console.log(`${colors.red}✗ User registration failed${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testUserLogin(email, password) {
  console.log(`\n${colors.blue}━━━ Test 2: User Login ━━━${colors.reset}`);
  
  try {
    const result = await makeRequest('/auth/login', 'POST', { email, password });
    
    if (result.status === 200 && result.data.success) {
      console.log(`${colors.green}✓ User login successful${colors.reset}`);
      console.log(`  User ID: ${result.data.user.id}`);
      console.log(`  Role: ${result.data.user.role}`);
      console.log(`  Token received: ${result.data.token ? 'Yes' : 'No'}`);
      return result.data.token;
    } else {
      console.log(`${colors.red}✗ User login failed${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testGetCurrentUser(token) {
  console.log(`\n${colors.blue}━━━ Test 3: Get Current User (Protected Route) ━━━${colors.reset}`);
  
  try {
    const result = await makeRequest('/users/me', 'GET', null, token);
    
    if (result.status === 200 && result.data.success) {
      console.log(`${colors.green}✓ Get current user successful${colors.reset}`);
      console.log(`  User:`, result.data.user);
      return true;
    } else {
      console.log(`${colors.red}✗ Get current user failed${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function testAdminLogin() {
  console.log(`\n${colors.blue}━━━ Test 4: Admin Login ━━━${colors.reset}`);
  
  const adminCreds = {
    email: 'admin@propzy.com',
    password: 'admin123'
  };

  try {
    const result = await makeRequest('/auth/admin/login', 'POST', adminCreds);
    
    if (result.status === 200 && result.data.success) {
      console.log(`${colors.green}✓ Admin login successful${colors.reset}`);
      console.log(`  Admin:`, result.data.admin);
      console.log(`  Token received: ${result.data.token ? 'Yes' : 'No'}`);
      return result.data.token;
    } else {
      console.log(`${colors.yellow}⚠ Admin login failed (Admin user may not exist)${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      console.log(`  ${colors.yellow}Run 'node createAdmin.js' to create admin user${colors.reset}`);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testUnauthorizedAccess() {
  console.log(`\n${colors.blue}━━━ Test 5: Unauthorized Access (No Token) ━━━${colors.reset}`);
  
  try {
    const result = await makeRequest('/users/me', 'GET');
    
    if (result.status === 401) {
      console.log(`${colors.green}✓ Unauthorized access correctly blocked${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      return true;
    } else {
      console.log(`${colors.red}✗ Unauthorized access not properly blocked${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function testInvalidToken() {
  console.log(`\n${colors.blue}━━━ Test 6: Invalid Token ━━━${colors.reset}`);
  
  try {
    const result = await makeRequest('/users/me', 'GET', null, 'invalid_token_12345');
    
    if (result.status === 403) {
      console.log(`${colors.green}✓ Invalid token correctly rejected${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      return true;
    } else {
      console.log(`${colors.red}✗ Invalid token not properly rejected${colors.reset}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log(`${colors.yellow}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.yellow}║   Authentication System Test Suite            ║${colors.reset}`);
  console.log(`${colors.yellow}╚════════════════════════════════════════════════╝${colors.reset}`);

  let passedTests = 0;
  const totalTests = 6;

  // Test 1: User Registration
  const registrationResult = await testUserRegistration();
  if (registrationResult) passedTests++;

  // Test 2: User Login
  let userToken = null;
  if (registrationResult) {
    userToken = await testUserLogin(registrationResult.user.email, registrationResult.user.password);
    if (userToken) passedTests++;
  }

  // Test 3: Get Current User
  if (userToken) {
    const getCurrentUserResult = await testGetCurrentUser(userToken);
    if (getCurrentUserResult) passedTests++;
  }

  // Test 4: Admin Login
  const adminToken = await testAdminLogin();
  if (adminToken) passedTests++;

  // Test 5: Unauthorized Access
  const unauthorizedResult = await testUnauthorizedAccess();
  if (unauthorizedResult) passedTests++;

  // Test 6: Invalid Token
  const invalidTokenResult = await testInvalidToken();
  if (invalidTokenResult) passedTests++;

  // Summary
  console.log(`\n${colors.yellow}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}Test Summary${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ ${totalTests - passedTests} test(s) failed${colors.reset}`);
  }

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run tests
runAllTests();
