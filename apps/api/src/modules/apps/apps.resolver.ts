import { AppStatus, AppVisibility } from '@/schemas/app.schema';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppDto, CreateAppInput, UpdateAppInput } from '../../dto/app.dto';
import { User, UserRole } from '../../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AppsService } from './apps.service';

@Resolver(() => AppDto)
export class AppsResolver {
  constructor(private readonly appsService: AppsService) {}

  @Mutation(() => AppDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async createApp(
    @Args('input') createAppInput: CreateAppInput,
    @CurrentUser() user: User, 
  ): Promise<AppDto> {
    return this.appsService.create(createAppInput, user.id, user.organizationId?.toString() || null) as any;
  }

  @Query(() => [AppDto], { name: 'apps' })
  async findAll(
    @Args('status', { nullable: true }) status?: AppStatus,
    @Args('visibility', { nullable: true }) visibility?: AppVisibility,
    @Args('platforms', { type: () => [String!], nullable: true }) platforms?: string[],
    @Args('tags', { type: () => [String!], nullable: true }) tags?: string[],
    @Args('search', { nullable: true }) search?: string,
    @Args('organizationId', { nullable: true }) organizationId?: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<AppDto[]> {
    const { apps } = await this.appsService.findAll(
      {
        status: status?.toLowerCase(), 
        visibility: visibility?.toLowerCase(),
        platforms: platforms?.map(platform => platform.toLowerCase()),
        tags,
        search,
        organizationId
      },
      limit,
      offset,
    );
    return apps as any;
  }

  @Query(() => [AppDto], { name: 'timelineApps' })
  async getTimelineApps(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<AppDto[]> {
    const { apps } = await this.appsService.getTimelineApps(limit, offset);
    return apps as any;
  }

  @Query(() => AppDto, { name: 'app' })
  async findOne(@Args('id') id: string): Promise<AppDto> {
    return this.appsService.findOne(id) as any;
  }

  @Query(() => AppDto, { name: 'appBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<AppDto> {
    return this.appsService.findBySlug(slug) as any;
  }

  @Mutation(() => AppDto)
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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async removeApp(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = context.req.user;
    return this.appsService.remove(id, user.id, user.role);
  }

  @Mutation(() => Boolean)
  async incrementAppView(@Args('id') id: string): Promise<boolean> {
    await this.appsService.incrementViewCount(id);
    return true;
  }

  @Mutation(() => Boolean)
  async incrementAppLike(@Args('id') id: string): Promise<boolean> {
    await this.appsService.incrementLikeCount(id);
    return true;
  }
}
