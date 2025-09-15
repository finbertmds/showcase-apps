/**
 * Example: Using GraphQL Operations Constants in Resolver
 * 
 * This file demonstrates how to use the centralized GraphQL operations constants
 * in your resolvers for better maintainability and consistency.
 */

import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MUTATIONS, QUERIES, RESOLVER_METHODS } from '../constants/graphql-operations';
import { AppDto, CreateAppInput, UpdateAppInput } from '../dto/app.dto';
import { AppsService } from '../modules/apps/apps.service';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';

/**
 * Example resolver showing how to use GraphQL operations constants
 * 
 * Benefits:
 * 1. Centralized operation names
 * 2. Type safety
 * 3. Easy refactoring
 * 4. Consistent naming
 * 5. Better IDE support
 */
@Resolver(() => AppDto)
export class ExampleAppsResolver {
  constructor(private readonly appsService: AppsService) {}

  /**
   * Example: Using QUERIES constant for query name
   * Instead of hardcoding 'apps', we use QUERIES.APPS
   */
  @Query(() => [AppDto], { name: QUERIES.APPS })
  async findAll(
    @Args('status', { nullable: true }) status?: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<AppDto[]> {
    // Method name matches the resolver mapping in RESOLVER_METHODS
    // RESOLVER_METHODS[QUERIES.APPS] = 'AppsResolver.findAll'
    const { apps } = await this.appsService.findAll({ status }, limit, offset);
    return apps as any;
  }

  /**
   * Example: Using QUERIES constant for timeline apps
   */
  @Query(() => [AppDto], { name: QUERIES.TIMELINE_APPS })
  async getTimelineApps(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<AppDto[]> {
    // Method name: getTimelineApps matches RESOLVER_METHODS[QUERIES.TIMELINE_APPS]
    const { apps } = await this.appsService.getTimelineApps(limit, offset);
    return apps as any;
  }

  /**
   * Example: Using QUERIES constant for single app
   */
  @Query(() => AppDto, { name: QUERIES.APP })
  async findOne(@Args('id') id: string): Promise<AppDto> {
    // Method name: findOne matches RESOLVER_METHODS[QUERIES.APP]
    return this.appsService.findOne(id) as any;
  }

  /**
   * Example: Using MUTATIONS constant for create app
   */
  @Mutation(() => AppDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async createApp(
    @Args('input') createAppInput: CreateAppInput,
    @Context() context: any,
  ): Promise<AppDto> {
    // Method name: createApp matches RESOLVER_METHODS[MUTATIONS.CREATE_APP]
    const user = context.req.user;
    return this.appsService.create(createAppInput, user.id, user.organizationId?.toString() || null) as any;
  }

  /**
   * Example: Using MUTATIONS constant for update app
   */
  @Mutation(() => AppDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async updateApp(
    @Args('id') id: string,
    @Args('input') updateAppInput: UpdateAppInput,
    @Context() context: any,
  ): Promise<AppDto> {
    // Method name: updateApp matches RESOLVER_METHODS[MUTATIONS.UPDATE_APP]
    const user = context.req.user;
    return this.appsService.update(id, updateAppInput, user._id.toString(), user.role) as any;
  }

  /**
   * Example: Using MUTATIONS constant for remove app
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async removeApp(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    // Method name: removeApp matches RESOLVER_METHODS[MUTATIONS.REMOVE_APP]
    const user = context.req.user;
    return this.appsService.remove(id, user.id, user.role);
  }

  /**
   * Example: Using MUTATIONS constant for increment view
   */
  @Mutation(() => Boolean)
  async incrementAppView(
    @Args('id') id: string,
  @Context() context: any,
): Promise<boolean> {
    // Method name: incrementAppView matches RESOLVER_METHODS[MUTATIONS.INCREMENT_APP_VIEW]
    const user = context.req.user;
    await this.appsService.incrementViewCount(id, user.id);
    return true;
  }

  /**
   * Example: Using MUTATIONS constant for increment like
   */
  @Mutation(() => Boolean)
  async incrementAppLike(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    // Method name: incrementAppLike matches RESOLVER_METHODS[MUTATIONS.INCREMENT_APP_LIKE]
    const user = context.req.user;
    await this.appsService.incrementLikeCount(id, user.id);
    return true;
  }
}

/**
 * Example: Using constants in service layer
 */
export class ExampleAppsService {
  /**
   * Example: Using constants for logging or debugging
   */
  async logOperation(operation: string, data: any) {
    console.log(`Executing operation: ${operation}`);
    console.log(`Resolver method: ${RESOLVER_METHODS[operation] || 'Unknown'}`);
    console.log('Data:', data);
  }

  /**
   * Example: Using constants for validation
   */
  async validateOperation(operation: string) {
    const validOperations = Object.keys(RESOLVER_METHODS);
    if (!validOperations.includes(operation)) {
      throw new Error(`Invalid operation: ${operation}. Valid operations: ${validOperations.join(', ')}`);
    }
  }
}

/**
 * Example: Using constants in tests
 */
export class ExampleTestHelper {
  /**
   * Example: Using constants in test setup
   */
  static getTestOperations() {
    return {
      queries: Object.values(QUERIES),
      mutations: Object.values(MUTATIONS),
      all: [...Object.values(QUERIES), ...Object.values(MUTATIONS)],
    };
  }

  /**
   * Example: Using constants for test data
   */
  static getTestDataForOperation(operation: string) {
    const testData: Record<string, any> = {
      [QUERIES.APPS]: { status: 'published', limit: 10 },
      [QUERIES.APP]: { id: 'test-app-id' },
      [MUTATIONS.CREATE_APP]: { input: { title: 'Test App', slug: 'test-app' } },
      [MUTATIONS.UPDATE_APP]: { id: 'test-app-id', input: { title: 'Updated App' } },
    };

    return testData[operation] || {};
  }
}
