import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMediaInput, MediaDto, MediaType } from '../../dto/media.dto';
import { UserRole } from '../../schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MediaService } from './media.service';

@Resolver(() => MediaDto)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Query(() => [MediaDto], { name: 'mediaByApp' })
  async findByAppId(@Args('appId') appId: string): Promise<MediaDto[]> {
    return this.mediaService.findByAppId(appId);
  }

  @Query(() => [MediaDto], { name: 'mediaByAppAndType' })
  async findByAppIdAndType(
    @Args('appId') appId: string,
    @Args('type', { type: () => MediaType }) type: MediaType,
  ): Promise<MediaDto[]> {
    return this.mediaService.findByAppIdAndType(appId, type);
  }

  @Mutation(() => MediaDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async uploadMedia(
    @Args('input') createMediaInput: CreateMediaInput,
    @Context() context: any,
  ): Promise<MediaDto> {
    // In a real implementation, you would handle file upload here
    // This is a placeholder for the media upload functionality
    throw new Error('Media upload not implemented yet');
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async removeMedia(@Args('id') id: string): Promise<boolean> {
    return this.mediaService.remove(id);
  }
}
