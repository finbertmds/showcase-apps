import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTimelineEventInput, TimelineEventDto, UpdateTimelineEventInput } from '../../dto/timeline-event.dto';
import { UserRole } from '../../schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TimelineService } from './timeline.service';

@Resolver(() => TimelineEventDto)
export class TimelineResolver {
  constructor(private readonly timelineService: TimelineService) {}

  @Query(() => [TimelineEventDto], { name: 'timelineEvents' })
  async findAll(
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ): Promise<TimelineEventDto[]> {
    const { events } = await this.timelineService.findAll(limit, offset);
    return events;
  }

  @Query(() => [TimelineEventDto], { name: 'timelineEventsByApp' })
  async findByAppId(
    @Args('appId') appId: string,
    @Args('isPublic', { defaultValue: true }) isPublic?: boolean,
  ): Promise<TimelineEventDto[]> {
    return this.timelineService.findByAppId(appId, isPublic);
  }

  @Mutation(() => TimelineEventDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async createTimelineEvent(
    @Args('input') createTimelineEventInput: CreateTimelineEventInput,
    @Context() context: any,
  ): Promise<TimelineEventDto> {
    const user = context.req.user;
    return this.timelineService.create(createTimelineEventInput, user.id);
  }

  @Mutation(() => TimelineEventDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async updateTimelineEvent(
    @Args('id') id: string,
    @Args('input') updateTimelineEventInput: UpdateTimelineEventInput,
  ): Promise<TimelineEventDto> {
    return this.timelineService.update(id, updateTimelineEventInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async removeTimelineEvent(@Args('id') id: string): Promise<boolean> {
    return this.timelineService.remove(id);
  }
}
