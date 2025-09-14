# GraphQL Operations Management System

## 🎯 Overview

Hệ thống quản lý tập trung các GraphQL operations trong API, cung cấp single source of truth cho tất cả query và mutation names cùng với mapping đến resolver methods.

## 📁 File Structure

```
apps/api/src/
├── constants/
│   ├── graphql-operations.ts    # Main constants file
│   ├── index.ts                 # Export index
│   └── README.md               # Documentation
├── scripts/
│   └── generate-graphql-docs.ts # Documentation generator
├── examples/
│   └── resolver-with-constants.ts # Usage examples
└── demo/
    └── constants-usage.ts       # Demo script
```

## 🔧 Available Operations

### Queries (14 operations)
- **Apps**: `apps`, `timelineApps`, `app`, `appBySlug`
- **Users**: `users`, `user`, `me`
- **Organizations**: `organizations`, `organization`, `organizationBySlug`
- **Media**: `mediaByApp`, `mediaByAppAndType`
- **Timeline**: `timelineEvents`, `timelineEventsByApp`

### Mutations (18 operations)
- **Apps**: `createApp`, `updateApp`, `removeApp`, `incrementAppView`, `incrementAppLike`
- **Users**: `updateUser`, `removeUser`
- **Organizations**: `createOrganization`, `updateOrganization`, `removeOrganization`
- **Auth**: `login`, `register`, `changePassword`
- **Media**: `uploadMedia`, `removeMedia`
- **Timeline**: `createTimelineEvent`, `updateTimelineEvent`, `removeTimelineEvent`

## 🚀 Usage Examples

### 1. Basic Usage in Resolvers

```typescript
import { QUERIES, MUTATIONS } from '@/constants/graphql-operations';

@Resolver(() => AppDto)
export class AppsResolver {
  @Query(() => [AppDto], { name: QUERIES.APPS })
  async findAll() {
    // Method name: findAll matches RESOLVER_METHODS[QUERIES.APPS]
  }

  @Mutation(() => AppDto)
  async createApp() {
    // Method name: createApp matches RESOLVER_METHODS[MUTATIONS.CREATE_APP]
  }
}
```

### 2. Operation Validation

```typescript
import { isQuery, isMutation, getAllOperations } from '@/constants/graphql-operations';

function validateOperation(operation: string) {
  const allOperations = getAllOperations();
  return allOperations.includes(operation);
}

if (isQuery('apps')) {
  // Handle query
}

if (isMutation('createApp')) {
  // Handle mutation
}
```

### 3. Resolver Method Mapping

```typescript
import { getResolverMethod } from '@/constants/graphql-operations';

const resolverMethod = getResolverMethod('apps'); // "AppsResolver.findAll"
const resolverMethod = getResolverMethod('createApp'); // "AppsResolver.createApp"
```

### 4. Operations by Resolver

```typescript
import { getOperationsByResolver } from '@/constants/graphql-operations';

const appOperations = getOperationsByResolver('AppsResolver');
// ['apps', 'timelineApps', 'app', 'appBySlug', 'createApp', 'updateApp', ...]
```

### 5. Operation Groups

```typescript
import { OPERATION_GROUPS } from '@/constants/graphql-operations';

const appOps = OPERATION_GROUPS.APPS;
const userOps = OPERATION_GROUPS.USERS;
const authOps = OPERATION_GROUPS.AUTH;
```

## 🛠️ Utility Functions

### Core Functions
- `getAllQueries()` - Get all query names
- `getAllMutations()` - Get all mutation names
- `getAllOperations()` - Get all operation names
- `getResolverMethod(operation)` - Get resolver method for operation
- `isQuery(operation)` - Check if operation is a query
- `isMutation(operation)` - Check if operation is a mutation
- `getOperationsByResolver(resolver)` - Get operations by resolver class

### Type Safety
```typescript
type QueryName = typeof QUERIES[keyof typeof QUERIES];
type MutationName = typeof MUTATIONS[keyof typeof MUTATIONS];
type OperationName = QueryName | MutationName;
```

## 📊 Resolver Mappings

| Operation | Resolver Method |
|-----------|----------------|
| `apps` | `AppsResolver.findAll` |
| `timelineApps` | `AppsResolver.getTimelineApps` |
| `app` | `AppsResolver.findOne` |
| `appBySlug` | `AppsResolver.findBySlug` |
| `createApp` | `AppsResolver.createApp` |
| `updateApp` | `AppsResolver.updateApp` |
| `removeApp` | `AppsResolver.removeApp` |
| `users` | `UsersResolver.findAll` |
| `user` | `UsersResolver.findOne` |
| `me` | `UsersResolver.getCurrentUser` |
| `updateUser` | `UsersResolver.updateUser` |
| `removeUser` | `UsersResolver.removeUser` |
| `organizations` | `OrganizationsResolver.findAll` |
| `organization` | `OrganizationsResolver.findOne` |
| `organizationBySlug` | `OrganizationsResolver.findBySlug` |
| `createOrganization` | `OrganizationsResolver.createOrganization` |
| `updateOrganization` | `OrganizationsResolver.updateOrganization` |
| `removeOrganization` | `OrganizationsResolver.removeOrganization` |
| `login` | `AuthResolver.login` |
| `register` | `AuthResolver.register` |
| `changePassword` | `AuthResolver.changePassword` |
| `mediaByApp` | `MediaResolver.findByAppId` |
| `mediaByAppAndType` | `MediaResolver.findByAppIdAndType` |
| `uploadMedia` | `MediaResolver.uploadMedia` |
| `removeMedia` | `MediaResolver.removeMedia` |
| `timelineEvents` | `TimelineResolver.findAll` |
| `timelineEventsByApp` | `TimelineResolver.findByAppId` |
| `createTimelineEvent` | `TimelineResolver.createTimelineEvent` |
| `updateTimelineEvent` | `TimelineResolver.updateTimelineEvent` |
| `removeTimelineEvent` | `TimelineResolver.removeTimelineEvent` |

## 🎨 Benefits

### 1. **Single Source of Truth**
- Tất cả operation names được định nghĩa ở một chỗ
- Dễ dàng thay đổi và maintain

### 2. **Type Safety**
- TypeScript support với proper typing
- Compile-time checking cho operation names

### 3. **Consistency**
- Đảm bảo naming consistency across toàn bộ API
- Tránh typos và naming conflicts

### 4. **Documentation**
- Clear mapping giữa operations và resolver methods
- Auto-generated documentation

### 5. **Maintainability**
- Dễ dàng add/remove operations
- Centralized management

### 6. **IDE Support**
- Auto-completion
- Refactoring support
- Go to definition

## 🔄 Adding New Operations

### Step 1: Add to Constants
```typescript
// In graphql-operations.ts
export const QUERIES = {
  // ... existing queries
  NEW_QUERY: 'newQuery',
} as const;

export const MUTATIONS = {
  // ... existing mutations
  NEW_MUTATION: 'newMutation',
} as const;
```

### Step 2: Add Resolver Mapping
```typescript
export const RESOLVER_METHODS = {
  // ... existing mappings
  [QUERIES.NEW_QUERY]: 'SomeResolver.newMethod',
  [MUTATIONS.NEW_MUTATION]: 'SomeResolver.newMutationMethod',
} as const;
```

### Step 3: Add to Operation Groups
```typescript
export const OPERATION_GROUPS = {
  // ... existing groups
  SOME_GROUP: [
    // ... existing operations
    QUERIES.NEW_QUERY,
    MUTATIONS.NEW_MUTATION,
  ],
} as const;
```

### Step 4: Update Documentation
- Update this README
- Update resolver examples
- Update demo script

## 🧪 Testing

### Run Demo
```bash
cd apps/api
npx ts-node src/demo/constants-usage.ts
```

### Generate Documentation
```bash
cd apps/api
npm run generate:graphql-docs
```

## 📈 Statistics

- **Total Operations**: 32
- **Queries**: 14
- **Mutations**: 18
- **Resolvers**: 6 (AppsResolver, UsersResolver, OrganizationsResolver, AuthResolver, MediaResolver, TimelineResolver)
- **Operation Groups**: 6 (APPS, USERS, ORGANIZATIONS, AUTH, MEDIA, TIMELINE)

## 🔮 Future Enhancements

1. **Auto-generation** từ GraphQL schema
2. **Validation** cho resolver method names
3. **Metrics** và analytics cho operations
4. **Rate limiting** configuration per operation
5. **Caching** configuration per operation
6. **Monitoring** và alerting per operation

## 📝 Notes

- ME query được handle bởi cả UsersResolver và AuthResolver, AuthResolver có precedence
- Tất cả operations đều có proper TypeScript typing
- Constants được export từ index.ts để dễ import
- Demo script chạy được và show tất cả functionality
- Documentation generator có thể tạo markdown và JSON docs
