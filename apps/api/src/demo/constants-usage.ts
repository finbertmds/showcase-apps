/**
 * Demo: GraphQL Operations Constants Usage
 * 
 * This file demonstrates various ways to use the GraphQL operations constants
 * in your NestJS application.
 */

import {
  MUTATIONS,
  OPERATION_GROUPS,
  QUERIES,
  getAllMutations,
  getAllQueries,
  getOperationsByResolver,
  getResolverMethod,
  isMutation,
  isQuery
} from '../constants/graphql-operations';

// ============================================================================
// 1. BASIC USAGE IN RESOLVERS
// ============================================================================

console.log('=== BASIC USAGE IN RESOLVERS ===');

// Instead of hardcoding query names
console.log('Query name:', QUERIES.APPS); // "apps"
console.log('Mutation name:', MUTATIONS.CREATE_APP); // "createApp"

// Get resolver method for an operation
console.log('Resolver method for apps query:', getResolverMethod(QUERIES.APPS)); // "AppsResolver.findAll"
console.log('Resolver method for createApp mutation:', getResolverMethod(MUTATIONS.CREATE_APP)); // "AppsResolver.createApp"

// ============================================================================
// 2. OPERATION TYPE CHECKING
// ============================================================================

console.log('\n=== OPERATION TYPE CHECKING ===');

const operation1 = 'apps';
const operation2 = 'createApp';

console.log(`Is "${operation1}" a query?`, isQuery(operation1)); // true
console.log(`Is "${operation1}" a mutation?`, isMutation(operation1)); // false
console.log(`Is "${operation2}" a query?`, isQuery(operation2)); // false
console.log(`Is "${operation2}" a mutation?`, isMutation(operation2)); // true

// ============================================================================
// 3. GETTING ALL OPERATIONS
// ============================================================================

console.log('\n=== GETTING ALL OPERATIONS ===');

console.log('All queries:', getAllQueries());
console.log('All mutations:', getAllMutations());
console.log('Total operations:', getAllQueries().length + getAllMutations().length);

// ============================================================================
// 4. OPERATIONS BY RESOLVER
// ============================================================================

console.log('\n=== OPERATIONS BY RESOLVER ===');

const appOperations = getOperationsByResolver('AppsResolver');
console.log('AppsResolver operations:', appOperations);

const userOperations = getOperationsByResolver('UsersResolver');
console.log('UsersResolver operations:', userOperations);

const authOperations = getOperationsByResolver('AuthResolver');
console.log('AuthResolver operations:', authOperations);

// ============================================================================
// 5. OPERATION GROUPS
// ============================================================================

console.log('\n=== OPERATION GROUPS ===');

console.log('App operations:', OPERATION_GROUPS.APPS);
console.log('User operations:', OPERATION_GROUPS.USERS);
console.log('Auth operations:', OPERATION_GROUPS.AUTH);
console.log('Organization operations:', OPERATION_GROUPS.ORGANIZATIONS);

// ============================================================================
// 6. VALIDATION AND ERROR HANDLING
// ============================================================================

console.log('\n=== VALIDATION AND ERROR HANDLING ===');

function validateOperation(operation: string): boolean {
  const allOperations = [...getAllQueries(), ...getAllMutations()];
  
  if (!allOperations.includes(operation)) {
    console.error(`Invalid operation: ${operation}`);
    console.log('Valid operations:', allOperations);
    return false;
  }
  
  console.log(`Valid operation: ${operation}`);
  return true;
}

validateOperation('apps'); // Valid
validateOperation('invalidOperation'); // Invalid

// ============================================================================
// 7. LOGGING AND DEBUGGING
// ============================================================================

console.log('\n=== LOGGING AND DEBUGGING ===');

function logOperation(operation: string, data: any) {
  const resolverMethod = getResolverMethod(operation as any);
  const operationType = isQuery(operation) ? 'Query' : 'Mutation';
  
  console.log(`[${operationType}] ${operation} -> ${resolverMethod}`);
  console.log('Data:', data);
}

logOperation(QUERIES.APPS, { status: 'published', limit: 10 });
logOperation(MUTATIONS.CREATE_APP, { title: 'New App', slug: 'new-app' });

// ============================================================================
// 8. TESTING UTILITIES
// ============================================================================

console.log('\n=== TESTING UTILITIES ===');

class TestHelper {
  static getTestOperations() {
    return {
      queries: getAllQueries(),
      mutations: getAllMutations(),
      all: [...getAllQueries(), ...getAllMutations()],
    };
  }

  static getTestDataForOperation(operation: string) {
    const testData: Record<string, any> = {
      [QUERIES.APPS]: { status: 'published', limit: 10 },
      [QUERIES.APP]: { id: 'test-app-id' },
      [QUERIES.USERS]: {},
      [QUERIES.ME]: {},
      [MUTATIONS.CREATE_APP]: { input: { title: 'Test App', slug: 'test-app' } },
      [MUTATIONS.UPDATE_APP]: { id: 'test-app-id', input: { title: 'Updated App' } },
      [MUTATIONS.LOGIN]: { input: { email: 'test@example.com', password: 'password' } },
      [MUTATIONS.REGISTER]: { input: { email: 'test@example.com', username: 'testuser', name: 'Test User', password: 'password' } },
    };

    return testData[operation] || {};
  }

  static validateTestData(operation: string, data: any) {
    const expectedData = this.getTestDataForOperation(operation);
    const isValid = Object.keys(expectedData).every(key => key in data);
    
    console.log(`Test data for ${operation}:`, expectedData);
    console.log(`Provided data:`, data);
    console.log(`Valid:`, isValid);
    
    return isValid;
  }
}

console.log('Test operations:', TestHelper.getTestOperations());
TestHelper.validateTestData(QUERIES.APPS, { status: 'published', limit: 10 });
TestHelper.validateTestData(MUTATIONS.CREATE_APP, { input: { title: 'Test App' } });

// ============================================================================
// 9. MIDDLEWARE AND INTERCEPTORS
// ============================================================================

console.log('\n=== MIDDLEWARE AND INTERCEPTORS ===');

class OperationLogger {
  static logRequest(operation: string, context: any) {
    const resolverMethod = getResolverMethod(operation as any);
    const operationType = isQuery(operation) ? 'Query' : 'Mutation';
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${operationType}: ${operation}`);
    console.log(`Resolver: ${resolverMethod}`);
    console.log(`Context:`, context);
  }

  static logResponse(operation: string, result: any, duration: number) {
    const operationType = isQuery(operation) ? 'Query' : 'Mutation';
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${operationType}: ${operation} completed in ${duration}ms`);
    console.log(`Result:`, result);
  }
}

// Simulate request/response logging
OperationLogger.logRequest(QUERIES.APPS, { user: 'admin', ip: '127.0.0.1' });
OperationLogger.logResponse(QUERIES.APPS, { apps: [], total: 0 }, 150);

// ============================================================================
// 10. CONFIGURATION AND SETTINGS
// ============================================================================

console.log('\n=== CONFIGURATION AND SETTINGS ===');

class GraphQLConfig {
  static getOperationSettings(operation: string) {
    const settings: Record<string, any> = {
      [QUERIES.APPS]: { 
        maxLimit: 100, 
        defaultLimit: 20, 
        cacheable: true,
        timeout: 5000 
      },
      [MUTATIONS.CREATE_APP]: { 
        rateLimit: 10, 
        timeout: 10000,
        requiresAuth: true 
      },
      [MUTATIONS.LOGIN]: { 
        rateLimit: 5, 
        timeout: 3000,
        requiresAuth: false 
      },
    };

    return settings[operation] || { timeout: 5000 };
  }

  static isOperationCacheable(operation: string): boolean {
    const settings = this.getOperationSettings(operation);
    return settings.cacheable === true;
  }

  static getOperationTimeout(operation: string): number {
    const settings = this.getOperationSettings(operation);
    return settings.timeout || 5000;
  }
}

console.log('Apps query settings:', GraphQLConfig.getOperationSettings(QUERIES.APPS));
console.log('Is apps query cacheable?', GraphQLConfig.isOperationCacheable(QUERIES.APPS));
console.log('Apps query timeout:', GraphQLConfig.getOperationTimeout(QUERIES.APPS));

console.log('\n=== DEMO COMPLETED ===');
