import { AppStatus, AppVisibility } from '@/schemas/app.schema';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MUTATIONS, QUERIES } from '../../constants/graphql-operations';
import { AppDto, AppsPage, CreateAppInput, UpdateAppInput } from '../../dto/app.dto';
import { User, UserRole } from '../../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AppsService } from './apps.service';

@Resolver(() => AppDto)
export class AppsResolver {
  constructor(private readonly appsService: AppsService) {}

  @Mutation(() => AppDto, { name: MUTATIONS.CREATE_APP })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async createApp(
    @Args('input') createAppInput: CreateAppInput,
    @CurrentUser() user: User, 
  ): Promise<AppDto> {
    return this.appsService.create(createAppInput, user.id, user.organizationId?.toString() || null) as any;
  }

  @Query(() => [String], { name: 'getAllTags' })
  async getAllTags(): Promise<string[]> {
    return this.appsService.getAllTags();
  }

  @Query(() => [AppDto], { name: QUERIES.APPS })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Args('status', { nullable: true }) status?: AppStatus,
    @Args('visibility', { nullable: true }) visibility?: AppVisibility,
    @Args('platforms', { type: () => [String!], nullable: true }) platforms?: string[],
    @Args('tags', { type: () => [String!], nullable: true }) tags?: string[],
    @Args('search', { nullable: true }) search?: string,
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
    @Args('category', { nullable: true }) category?: string,
    @Context() context?: any,
  ): Promise<AppDto[]> {
    const userId = context?.req?.user?.id;
    const { apps } = await this.appsService.findAll(
      {
        status: status, 
        visibility: visibility,
        platforms: platforms,
        tags,
        search,
        organizationId,
        category
      },
      limit,
      offset,
      userId,
    );
    return apps as any;
  }

  @Query(() => AppsPage, { name: QUERIES.APPS_PAGINATED })
  @UseGuards(JwtAuthGuard)
  async findPaginated(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('category', { nullable: true }) category?: string,
    @Context() context?: any,
  ): Promise<AppsPage> {
    const filters: any = {};
    
    if (search) {
      filters.$text = { $search: search };
    }
    
    if (category) {
      filters.tags = { $in: [category] };
    }

    const userId = context?.req?.user?.id;
    const { apps, total } = await this.appsService.findPaginated(filters, limit, offset, userId);
    
    return {
      items: apps as any,
      totalCount: total,
      limit,
      offset,
    };
  }

  @Query(() => [AppDto], { name: QUERIES.TIMELINE_APPS })
  @UseGuards(JwtAuthGuard)
  async getTimelineApps(
    @Args('status', { nullable: true }) status?: AppStatus,
    @Args('visibility', { nullable: true }) visibility?: AppVisibility,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
    @Context() context?: any,
  ): Promise<AppDto[]> {
    const userId = context?.req?.user?.id;
    const { apps } = await this.appsService.getTimelineApps(status, visibility, limit, offset, userId);
    return apps as any;
  }

  @Query(() => AppDto, { name: QUERIES.APP })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id') id: string,
    @Context() context?: any,
  ): Promise<AppDto> {
    const userId = context?.req?.user?.id;
    return this.appsService.findOne(id, userId) as any;
  }

  @Query(() => AppDto, { name: QUERIES.APP_BY_SLUG })
  @UseGuards(JwtAuthGuard)
  async findBySlug(
    @Args('slug') slug: string,
    @Context() context?: any,
  ): Promise<AppDto> {
    const userId = context?.req?.user?.id;
    return this.appsService.findBySlug(slug, userId) as any;
  }

  @Mutation(() => AppDto, { name: MUTATIONS.UPDATE_APP })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async updateApp(
    @Args('id') id: string,
    @Args('input') updateAppInput: UpdateAppInput,
    @Context() context: any,
  ): Promise<AppDto> {
    const user = context.req.user;
    return this.appsService.update(id, updateAppInput, user._id.toString(), user.role) as any;
  }

  @Mutation(() => Boolean, { name: MUTATIONS.REMOVE_APP })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async removeApp(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = context.req.user;
    return this.appsService.remove(id, user.id, user.role);
  }

  @Mutation(() => Boolean, { name: MUTATIONS.INCREMENT_APP_VIEW })
  @UseGuards(JwtAuthGuard)
  async incrementAppView(
    @Args('id') id: string,
    @Context() context: any
  ): Promise<boolean> {
    const userId = context.req?.user?.id;
    if (!userId) {
      // If user not authenticated, return false (no increment)
      return false;
    }
    
    return await this.appsService.incrementViewCount(id, userId);
  }

  @Mutation(() => Boolean, { name: MUTATIONS.INCREMENT_APP_LIKE })
  @UseGuards(JwtAuthGuard)
  async incrementAppLike(
    @Args('id') id: string,
    @Context() context: any
  ): Promise<boolean> {
    const userId = context.req?.user?.id;
    if (!userId) {
      // If user not authenticated, return false (no increment)
      return false;
    }
    
    return await this.appsService.incrementLikeCount(id, userId);
  }

  @Query(() => Boolean, { name: QUERIES.HAS_USER_LIKED_APP })
  @UseGuards(JwtAuthGuard)
  async hasUserLikedApp(
    @Args('appId') appId: string,
    @Context() context: any
  ): Promise<boolean> {
    const userId = context.req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    return await this.appsService.hasUserLikedApp(appId, userId);
  }

  @Query(() => Boolean, { name: QUERIES.HAS_USER_VIEWED_APP })
  @UseGuards(JwtAuthGuard)
  async hasUserViewedApp(
    @Args('appId') appId: string,
    @Context() context: any
  ): Promise<boolean> {
    const userId = context.req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    return await this.appsService.hasUserViewedApp(appId, userId);
  }

  @Query(() => [String], { name: QUERIES.GET_USER_LIKED_APPS })
  @UseGuards(JwtAuthGuard)
  async getUserLikedApps(@Context() context: any): Promise<string[]> {
    const userId = context.req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    return await this.appsService.getUserLikedApps(userId);
  }

  @Query(() => [String], { name: QUERIES.GET_USER_VIEWED_APPS })
  @UseGuards(JwtAuthGuard)
  async getUserViewedApps(@Context() context: any): Promise<string[]> {
    const userId = context.req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    return await this.appsService.getUserViewedApps(userId);
  }
}
