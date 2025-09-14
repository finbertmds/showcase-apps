#!/usr/bin/env ts-node

/**
 * GraphQL Operations Documentation Generator
 * 
 * This script generates documentation for all GraphQL operations
 * based on the constants defined in graphql-operations.ts
 */

import {
  MUTATIONS,
  OPERATION_GROUPS,
  QUERIES,
  RESOLVER_METHODS,
  getAllMutations,
  getAllQueries,
  getOperationsByResolver
} from '../constants/graphql-operations';

interface OperationInfo {
  name: string;
  type: 'query' | 'mutation';
  resolver: string;
  description?: string;
}

class GraphQLDocsGenerator {
  private operations: OperationInfo[] = [];

  constructor() {
    this.loadOperations();
  }

  private loadOperations() {
    // Load queries
    Object.values(QUERIES).forEach(query => {
      this.operations.push({
        name: query,
        type: 'query',
        resolver: RESOLVER_METHODS[query] || 'Unknown',
        description: this.getOperationDescription(query, 'query')
      });
    });

    // Load mutations
    Object.values(MUTATIONS).forEach(mutation => {
      this.operations.push({
        name: mutation,
        type: 'mutation',
        resolver: RESOLVER_METHODS[mutation] || 'Unknown',
        description: this.getOperationDescription(mutation, 'mutation')
      });
    });
  }

  private getOperationDescription(operation: string, type: 'query' | 'mutation'): string {
    const descriptions: Record<string, string> = {
      // App operations
      'apps': 'Get all apps with optional filtering by status, visibility, platforms, tags, search, organizationId',
      'timelineApps': 'Get apps for timeline view with pagination',
      'app': 'Get single app by ID',
      'appBySlug': 'Get single app by slug',
      'createApp': 'Create a new app (requires ADMIN or DEVELOPER role)',
      'updateApp': 'Update existing app (requires ADMIN or DEVELOPER role)',
      'removeApp': 'Delete app (requires ADMIN or DEVELOPER role)',
      'incrementAppView': 'Increment app view count',
      'incrementAppLike': 'Increment app like count',

      // User operations
      'users': 'Get all users (requires ADMIN role)',
      'user': 'Get single user by ID',
      'me': 'Get current authenticated user',
      'updateUser': 'Update user information (requires ADMIN role)',
      'removeUser': 'Delete user (requires ADMIN role)',

      // Organization operations
      'organizations': 'Get all organizations',
      'organization': 'Get single organization by ID',
      'organizationBySlug': 'Get organization by slug',
      'createOrganization': 'Create new organization',
      'updateOrganization': 'Update organization',
      'removeOrganization': 'Delete organization',

      // Auth operations
      'login': 'User login with email/username and password',
      'register': 'User registration with email, username, name, password, and role',
      'changePassword': 'Change user password (requires authentication)',

      // Media operations
      'mediaByApp': 'Get all media files for an app',
      'mediaByAppAndType': 'Get media files for an app filtered by type',
      'uploadMedia': 'Upload media file (requires ADMIN or DEVELOPER role)',
      'removeMedia': 'Delete media file (requires ADMIN or DEVELOPER role)',

      // Timeline operations
      'timelineEvents': 'Get timeline events with pagination',
      'timelineEventsByApp': 'Get timeline events for specific app',
      'createTimelineEvent': 'Create timeline event (requires ADMIN or DEVELOPER role)',
      'updateTimelineEvent': 'Update timeline event (requires ADMIN or DEVELOPER role)',
      'removeTimelineEvent': 'Delete timeline event (requires ADMIN or DEVELOPER role)',
    };

    return descriptions[operation] || `${type} operation`;
  }

  public generateMarkdownDocs(): string {
    let docs = '# GraphQL API Operations\n\n';
    docs += 'This document lists all available GraphQL operations in the Showcase Apps API.\n\n';

    // Summary
    docs += '## Summary\n\n';
    docs += `- **Total Operations**: ${this.operations.length}\n`;
    docs += `- **Queries**: ${getAllQueries().length}\n`;
    docs += `- **Mutations**: ${getAllMutations().length}\n\n`;

    // Operations by type
    docs += this.generateOperationsByType();
    
    // Operations by resolver
    docs += this.generateOperationsByResolver();
    
    // Operations by group
    docs += this.generateOperationsByGroup();

    return docs;
  }

  private generateOperationsByType(): string {
    let section = '## Operations by Type\n\n';

    // Queries
    section += '### Queries\n\n';
    const queries = this.operations.filter(op => op.type === 'query');
    queries.forEach(query => {
      section += `- **${query.name}** (${query.resolver})\n`;
      section += `  - ${query.description}\n\n`;
    });

    // Mutations
    section += '### Mutations\n\n';
    const mutations = this.operations.filter(op => op.type === 'mutation');
    mutations.forEach(mutation => {
      section += `- **${mutation.name}** (${mutation.resolver})\n`;
      section += `  - ${mutation.description}\n\n`;
    });

    return section;
  }

  private generateOperationsByResolver(): string {
    let section = '## Operations by Resolver\n\n';

    const resolvers = new Set(this.operations.map(op => op.resolver.split('.')[0]));
    
    resolvers.forEach(resolver => {
      const operations = getOperationsByResolver(resolver);
      section += `### ${resolver}\n\n`;
      
      operations.forEach(operation => {
        const op = this.operations.find(o => o.name === operation);
        if (op) {
          section += `- **${op.name}** (${op.type})\n`;
          section += `  - ${op.description}\n\n`;
        }
      });
    });

    return section;
  }

  private generateOperationsByGroup(): string {
    let section = '## Operations by Group\n\n';

    Object.entries(OPERATION_GROUPS).forEach(([groupName, operations]) => {
      section += `### ${groupName}\n\n`;
      
      operations.forEach(operation => {
        const op = this.operations.find(o => o.name === operation);
        if (op) {
          section += `- **${op.name}** (${op.type}) - ${op.resolver}\n`;
          section += `  - ${op.description}\n\n`;
        }
      });
    });

    return section;
  }

  public generateJsonDocs(): string {
    const docs = {
      summary: {
        totalOperations: this.operations.length,
        totalQueries: getAllQueries().length,
        totalMutations: getAllMutations().length,
      },
      operations: this.operations,
      groups: OPERATION_GROUPS,
      resolvers: Object.keys(RESOLVER_METHODS).reduce((acc, operation) => {
        const resolver = RESOLVER_METHODS[operation];
        if (!acc[resolver]) {
          acc[resolver] = [];
        }
        acc[resolver].push(operation);
        return acc;
      }, {} as Record<string, string[]>)
    };

    return JSON.stringify(docs, null, 2);
  }
}

// Main execution
if (require.main === module) {
  const generator = new GraphQLDocsGenerator();
  
  console.log('Generating GraphQL API documentation...\n');
  
  // Generate markdown docs
  const markdownDocs = generator.generateMarkdownDocs();
  console.log('=== MARKDOWN DOCUMENTATION ===');
  console.log(markdownDocs);
  
  console.log('\n=== JSON DOCUMENTATION ===');
  const jsonDocs = generator.generateJsonDocs();
  console.log(jsonDocs);
  
  console.log('\nDocumentation generated successfully!');
}

export { GraphQLDocsGenerator };
