/**
 * GraphQL Operations Constants
 * Centralized management of all GraphQL query and mutation names
 * 
 * This file provides a single source of truth for all GraphQL operations
 * and their corresponding resolver method mappings.
 */

// ============================================================================
// QUERIES
// ============================================================================

export const QUERIES = {
  // App Queries
  APPS: 'apps',
  TIMELINE_APPS: 'timelineApps',
  APP: 'app',
  APP_BY_SLUG: 'appBySlug',

  // User Queries
  USERS: 'users',
  USER: 'user',
  ME: 'me',

  // Organization Queries
  ORGANIZATIONS: 'organizations',
  ORGANIZATION: 'organization',
  ORGANIZATION_BY_SLUG: 'organizationBySlug',

  // Media Queries
  MEDIA_BY_APP: 'mediaByApp',
  MEDIA_BY_APP_AND_TYPE: 'mediaByAppAndType',

  // Timeline Queries
  TIMELINE_EVENTS: 'timelineEvents',
  TIMELINE_EVENTS_BY_APP: 'timelineEventsByApp',
} as const;

// ============================================================================
// MUTATIONS
// ============================================================================

export const MUTATIONS = {
  // App Mutations
  CREATE_APP: 'createApp',
  UPDATE_APP: 'updateApp',
  REMOVE_APP: 'removeApp',
  INCREMENT_APP_VIEW: 'incrementAppView',
  INCREMENT_APP_LIKE: 'incrementAppLike',

  // User Mutations
  UPDATE_USER: 'updateUser',
  REMOVE_USER: 'removeUser',

  // Organization Mutations
  CREATE_ORGANIZATION: 'createOrganization',
  UPDATE_ORGANIZATION: 'updateOrganization',
  REMOVE_ORGANIZATION: 'removeOrganization',

  // Auth Mutations
  LOGIN: 'login',
  REGISTER: 'register',
  CHANGE_PASSWORD: 'changePassword',

  // Media Mutations
  UPLOAD_MEDIA: 'uploadMedia',
  REMOVE_MEDIA: 'removeMedia',

  // Timeline Mutations
  CREATE_TIMELINE_EVENT: 'createTimelineEvent',
  UPDATE_TIMELINE_EVENT: 'updateTimelineEvent',
  REMOVE_TIMELINE_EVENT: 'removeTimelineEvent',
} as const;

// ============================================================================
// RESOLVER METHOD MAPPINGS
// ============================================================================

/**
 * Mapping of GraphQL operations to their resolver methods
 * This helps track which resolver method handles which GraphQL operation
 */
export const RESOLVER_METHODS = {
  // AppsResolver
  [QUERIES.APPS]: 'AppsResolver.findAll',
  [QUERIES.TIMELINE_APPS]: 'AppsResolver.getTimelineApps',
  [QUERIES.APP]: 'AppsResolver.findOne',
  [QUERIES.APP_BY_SLUG]: 'AppsResolver.findBySlug',
  [MUTATIONS.CREATE_APP]: 'AppsResolver.createApp',
  [MUTATIONS.UPDATE_APP]: 'AppsResolver.updateApp',
  [MUTATIONS.REMOVE_APP]: 'AppsResolver.removeApp',
  [MUTATIONS.INCREMENT_APP_VIEW]: 'AppsResolver.incrementAppView',
  [MUTATIONS.INCREMENT_APP_LIKE]: 'AppsResolver.incrementAppLike',

  // UsersResolver
  [QUERIES.USERS]: 'UsersResolver.findAll',
  [QUERIES.USER]: 'UsersResolver.findOne',
  [QUERIES.ME]: 'UsersResolver.getCurrentUser',
  [MUTATIONS.UPDATE_USER]: 'UsersResolver.updateUser',
  [MUTATIONS.REMOVE_USER]: 'UsersResolver.removeUser',

  // OrganizationsResolver
  [QUERIES.ORGANIZATIONS]: 'OrganizationsResolver.findAll',
  [QUERIES.ORGANIZATION]: 'OrganizationsResolver.findOne',
  [QUERIES.ORGANIZATION_BY_SLUG]: 'OrganizationsResolver.findBySlug',
  [MUTATIONS.CREATE_ORGANIZATION]: 'OrganizationsResolver.createOrganization',
  [MUTATIONS.UPDATE_ORGANIZATION]: 'OrganizationsResolver.updateOrganization',
  [MUTATIONS.REMOVE_ORGANIZATION]: 'OrganizationsResolver.removeOrganization',

  // AuthResolver
  // Note: ME query is handled by both UsersResolver and AuthResolver, AuthResolver takes precedence
  [MUTATIONS.LOGIN]: 'AuthResolver.login',
  [MUTATIONS.REGISTER]: 'AuthResolver.register',
  [MUTATIONS.CHANGE_PASSWORD]: 'AuthResolver.changePassword',

  // MediaResolver
  [QUERIES.MEDIA_BY_APP]: 'MediaResolver.findByAppId',
  [QUERIES.MEDIA_BY_APP_AND_TYPE]: 'MediaResolver.findByAppIdAndType',
  [MUTATIONS.UPLOAD_MEDIA]: 'MediaResolver.uploadMedia',
  [MUTATIONS.REMOVE_MEDIA]: 'MediaResolver.removeMedia',

  // TimelineResolver
  [QUERIES.TIMELINE_EVENTS]: 'TimelineResolver.findAll',
  [QUERIES.TIMELINE_EVENTS_BY_APP]: 'TimelineResolver.findByAppId',
  [MUTATIONS.CREATE_TIMELINE_EVENT]: 'TimelineResolver.createTimelineEvent',
  [MUTATIONS.UPDATE_TIMELINE_EVENT]: 'TimelineResolver.updateTimelineEvent',
  [MUTATIONS.REMOVE_TIMELINE_EVENT]: 'TimelineResolver.removeTimelineEvent',
} as const;

// ============================================================================
// OPERATION TYPES
// ============================================================================

export type QueryName = typeof QUERIES[keyof typeof QUERIES];
export type MutationName = typeof MUTATIONS[keyof typeof MUTATIONS];
export type OperationName = QueryName | MutationName;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all available query names
 */
export function getAllQueries(): readonly string[] {
  return Object.values(QUERIES);
}

/**
 * Get all available mutation names
 */
export function getAllMutations(): readonly string[] {
  return Object.values(MUTATIONS);
}

/**
 * Get all available operation names (queries + mutations)
 */
export function getAllOperations(): readonly string[] {
  return [...Object.values(QUERIES), ...Object.values(MUTATIONS)];
}

/**
 * Get resolver method for a given operation
 */
export function getResolverMethod(operation: OperationName): string | undefined {
  return RESOLVER_METHODS[operation];
}

/**
 * Check if an operation is a query
 */
export function isQuery(operation: string): operation is QueryName {
  return Object.values(QUERIES).includes(operation as QueryName);
}

/**
 * Check if an operation is a mutation
 */
export function isMutation(operation: string): operation is MutationName {
  return Object.values(MUTATIONS).includes(operation as MutationName);
}

/**
 * Get operations by resolver class
 */
export function getOperationsByResolver(resolverClass: string): OperationName[] {
  return Object.entries(RESOLVER_METHODS)
    .filter(([, method]) => method.startsWith(resolverClass))
    .map(([operation]) => operation as OperationName);
}

// ============================================================================
// OPERATION GROUPS
// ============================================================================

export const OPERATION_GROUPS = {
  APPS: [
    QUERIES.APPS,
    QUERIES.TIMELINE_APPS,
    QUERIES.APP,
    QUERIES.APP_BY_SLUG,
    MUTATIONS.CREATE_APP,
    MUTATIONS.UPDATE_APP,
    MUTATIONS.REMOVE_APP,
    MUTATIONS.INCREMENT_APP_VIEW,
    MUTATIONS.INCREMENT_APP_LIKE,
  ],
  USERS: [
    QUERIES.USERS,
    QUERIES.USER,
    QUERIES.ME,
    MUTATIONS.UPDATE_USER,
    MUTATIONS.REMOVE_USER,
  ],
  ORGANIZATIONS: [
    QUERIES.ORGANIZATIONS,
    QUERIES.ORGANIZATION,
    QUERIES.ORGANIZATION_BY_SLUG,
    MUTATIONS.CREATE_ORGANIZATION,
    MUTATIONS.UPDATE_ORGANIZATION,
    MUTATIONS.REMOVE_ORGANIZATION,
  ],
  AUTH: [
    QUERIES.ME,
    MUTATIONS.LOGIN,
    MUTATIONS.REGISTER,
    MUTATIONS.CHANGE_PASSWORD,
  ],
  MEDIA: [
    QUERIES.MEDIA_BY_APP,
    QUERIES.MEDIA_BY_APP_AND_TYPE,
    MUTATIONS.UPLOAD_MEDIA,
    MUTATIONS.REMOVE_MEDIA,
  ],
  TIMELINE: [
    QUERIES.TIMELINE_EVENTS,
    QUERIES.TIMELINE_EVENTS_BY_APP,
    MUTATIONS.CREATE_TIMELINE_EVENT,
    MUTATIONS.UPDATE_TIMELINE_EVENT,
    MUTATIONS.REMOVE_TIMELINE_EVENT,
  ],
} as const;
