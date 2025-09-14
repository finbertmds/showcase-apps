/**
 * Constants Index
 * 
 * Centralized export of all constants used throughout the API
 */

// GraphQL Operations
export {
  getAllMutations,
  getAllOperations, getAllQueries, getOperationsByResolver, getResolverMethod, isMutation, isQuery, MUTATIONS, OPERATION_GROUPS, QUERIES, RESOLVER_METHODS, type MutationName,
  type OperationName, type QueryName
} from './graphql-operations';

// Import for re-export
import {
  MUTATIONS,
  OPERATION_GROUPS,
  QUERIES,
  RESOLVER_METHODS,
} from './graphql-operations';

// Re-export commonly used constants for convenience
export const GRAPHQL_OPERATIONS = {
  QUERIES: QUERIES,
  MUTATIONS: MUTATIONS,
  RESOLVER_METHODS: RESOLVER_METHODS,
  OPERATION_GROUPS: OPERATION_GROUPS,
} as const;
