# GraphQL Operations Constants

This directory contains centralized constants for managing GraphQL operations in the API.

## Files

- `graphql-operations.ts` - Centralized GraphQL query and mutation names with resolver mappings

## Usage

### Import Constants

```typescript
import { QUERIES, MUTATIONS, RESOLVER_METHODS } from '@/constants/graphql-operations';
```

### Available Operations

#### Queries
- `QUERIES.APPS` - Get all apps with filtering
- `QUERIES.TIMELINE_APPS` - Get timeline apps
- `QUERIES.APP` - Get single app by ID
- `QUERIES.APP_BY_SLUG` - Get app by slug
- `QUERIES.USERS` - Get all users (admin only)
- `QUERIES.USER` - Get single user by ID
- `QUERIES.ME` - Get current user
- `QUERIES.ORGANIZATIONS` - Get all organizations
- `QUERIES.ORGANIZATION` - Get single organization by ID
- `QUERIES.ORGANIZATION_BY_SLUG` - Get organization by slug
- `QUERIES.MEDIA_BY_APP` - Get media by app ID
- `QUERIES.MEDIA_BY_APP_AND_TYPE` - Get media by app ID and type
- `QUERIES.TIMELINE_EVENTS` - Get timeline events
- `QUERIES.TIMELINE_EVENTS_BY_APP` - Get timeline events by app ID

#### Mutations
- `MUTATIONS.CREATE_APP` - Create new app
- `MUTATIONS.UPDATE_APP` - Update existing app
- `MUTATIONS.REMOVE_APP` - Delete app
- `MUTATIONS.INCREMENT_APP_VIEW` - Increment app view count
- `MUTATIONS.INCREMENT_APP_LIKE` - Increment app like count
- `MUTATIONS.UPDATE_USER` - Update user (admin only)
- `MUTATIONS.REMOVE_USER` - Delete user (admin only)
- `MUTATIONS.CREATE_ORGANIZATION` - Create new organization
- `MUTATIONS.UPDATE_ORGANIZATION` - Update organization
- `MUTATIONS.REMOVE_ORGANIZATION` - Delete organization
- `MUTATIONS.LOGIN` - User login
- `MUTATIONS.REGISTER` - User registration
- `MUTATIONS.CHANGE_PASSWORD` - Change user password
- `MUTATIONS.UPLOAD_MEDIA` - Upload media file
- `MUTATIONS.REMOVE_MEDIA` - Delete media file
- `MUTATIONS.CREATE_TIMELINE_EVENT` - Create timeline event
- `MUTATIONS.UPDATE_TIMELINE_EVENT` - Update timeline event
- `MUTATIONS.REMOVE_TIMELINE_EVENT` - Delete timeline event

### Resolver Method Mapping

```typescript
// Get resolver method for an operation
const resolverMethod = RESOLVER_METHODS[QUERIES.APPS]; // "AppsResolver.findAll"
const resolverMethod = RESOLVER_METHODS[MUTATIONS.CREATE_APP]; // "AppsResolver.createApp"
```

### Utility Functions

```typescript
import { 
  getAllQueries, 
  getAllMutations, 
  getAllOperations,
  getResolverMethod,
  isQuery,
  isMutation,
  getOperationsByResolver 
} from '@/constants/graphql-operations';

// Get all operations
const allQueries = getAllQueries();
const allMutations = getAllMutations();
const allOperations = getAllOperations();

// Check operation type
if (isQuery('apps')) { /* handle query */ }
if (isMutation('createApp')) { /* handle mutation */ }

// Get operations by resolver
const appOperations = getOperationsByResolver('AppsResolver');
```

### Operation Groups

```typescript
import { OPERATION_GROUPS } from '@/constants/graphql-operations';

// Get all app-related operations
const appOps = OPERATION_GROUPS.APPS;

// Get all user-related operations
const userOps = OPERATION_GROUPS.USERS;
```

## Benefits

1. **Single Source of Truth** - All GraphQL operation names in one place
2. **Type Safety** - TypeScript support with proper typing
3. **Consistency** - Ensures consistent naming across the API
4. **Documentation** - Clear mapping between operations and resolver methods
5. **Maintainability** - Easy to add/remove operations
6. **IDE Support** - Auto-completion and refactoring support

## Adding New Operations

1. Add the operation name to the appropriate constant object (`QUERIES` or `MUTATIONS`)
2. Add the resolver method mapping to `RESOLVER_METHODS`
3. Add the operation to the appropriate group in `OPERATION_GROUPS`
4. Update this documentation

## Example: Adding a new query

```typescript
// In graphql-operations.ts
export const QUERIES = {
  // ... existing queries
  NEW_QUERY: 'newQuery',
} as const;

export const RESOLVER_METHODS = {
  // ... existing mappings
  [QUERIES.NEW_QUERY]: 'SomeResolver.newMethod',
} as const;

export const OPERATION_GROUPS = {
  // ... existing groups
  SOME_GROUP: [
    // ... existing operations
    QUERIES.NEW_QUERY,
  ],
} as const;
```
