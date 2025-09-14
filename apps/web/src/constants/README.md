# Constants Documentation

This directory contains centralized constants for the application to ensure consistency and maintainability.

## Structure

```
src/constants/
├── index.ts          # Main export file
├── pagination.ts     # Pagination-related constants
└── README.md         # This documentation
```

## Usage Examples

### Pagination Constants

```typescript
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PAGE_SIZES } from '@/constants';

// In a component
const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

// In pagination component
<Pagination
  pageSizeOptions={PAGE_SIZE_OPTIONS}
  // ... other props
/>

// Using specific page sizes
const smallPageSize = PAGE_SIZES.SMALL; // 10
const largePageSize = PAGE_SIZES.LARGE; // 50
```

### Application Constants

```typescript
import { APP_CONFIG, ROUTES, STORAGE_KEYS } from '@/constants';

// App title
document.title = APP_CONFIG.NAME;

// Navigation
router.push(ROUTES.ADMIN_APPS);

// Local storage
localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

## Benefits

1. **Single Source of Truth**: All constants are defined in one place
2. **Type Safety**: TypeScript ensures correct usage
3. **Easy Refactoring**: Change values in one place
4. **Consistency**: Same values used across the application
5. **Documentation**: Constants serve as documentation

## Adding New Constants

1. Create a new file in `src/constants/` (e.g., `api.ts`)
2. Define your constants with proper types
3. Export them from `src/constants/index.ts`
4. Use them in your components

Example:
```typescript
// src/constants/api.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  APPS: '/api/apps',
} as const;

// src/constants/index.ts
export * from './api';
```
