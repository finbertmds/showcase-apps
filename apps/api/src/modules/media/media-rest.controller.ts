import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PresignedUrlRequestDto, PresignedUrlResponseDto } from '../../dto/media.dto';
import { MediaType } from '../../schemas/media.schema';
import { UserRole } from '../../schemas/user.schema';
import { MinioService } from '../../services/minio.service';
import { AppsService } from '../apps/apps.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MediaService } from './media.service';

@Controller('apps/:appId/media')
export class MediaRestController {
  constructor(
    private appsService: AppsService,
    private minioService: MinioService,
    private mediaService: MediaService,
  ) {}

  @Post('logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async getLogoPresignedUrl(
    @Param('appId') appId: string,
    @Body() body: PresignedUrlRequestDto,
    @Req() req: any,
  ): Promise<PresignedUrlResponseDto> {
    const user = req.user;

    // Validate request body
    if (!body.contentType) {
      throw new Error('Content-Type is required');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const contentType = body.contentType.toLowerCase();
    if (!allowedTypes.includes(contentType)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}. Received: ${body.contentType}`);
    }

    // Check app permissions
    await this.checkAppPermissions(appId, user.id, user.role);

    // Check if app already has a logo
    const existingLogo = await this.mediaService.findByAppIdAndType(appId, MediaType.LOGO);
    if (existingLogo && existingLogo.length > 0) {
      throw new Error('App already has a logo. Only one logo is allowed per app.');
    }

    // Generate unique filename
    const fileExtension = contentType.split('/')[1];
    const filename = `apps/${appId}/logos/${uuidv4()}.${fileExtension}`;

    // Get presigned upload URL
    const uploadUrl = await this.minioService.getPresignedUploadUrl(
      filename,
      contentType,
      60 * 60, // 1 hour expiration
    );

    return {
      uploadUrl,
      filename,
      expiresIn: 60 * 60,
    };
  }

  @Post('screenshot')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async getScreenshotPresignedUrl(
    @Param('appId') appId: string,
    @Body() body: PresignedUrlRequestDto,
    @Req() req: any,
  ): Promise<PresignedUrlResponseDto> {
    const user = req.user;

    // Validate request body
    if (!body.contentType) {
      throw new Error('Content-Type is required');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const contentType = body.contentType.toLowerCase();
    if (!allowedTypes.includes(contentType)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}. Received: ${body.contentType}`);
    }

    // Check app permissions
    await this.checkAppPermissions(appId, user.id, user.role);

    // Generate unique filename
    const fileExtension = contentType.split('/')[1];
    const filename = `apps/${appId}/screenshots/${uuidv4()}.${fileExtension}`;

    // Get presigned upload URL
    const uploadUrl = await this.minioService.getPresignedUploadUrl(
      filename,
      contentType,
      60 * 60, // 1 hour expiration
    );

    return {
      uploadUrl,
      filename,
      expiresIn: 60 * 60,
    };
  }

  private async checkAppPermissions(appId: string, userId: string, userRole: string): Promise<void> {
    const app = await this.appsService.findOne(appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Admin can manage any app
    if (userRole === UserRole.ADMIN) {
      return;
    }

    // App owner can manage their own app
    if (app.createdBy.toString() === userId) {
      return;
    }

    // Organization admin can manage apps in their organization
    if (app.organizationId) {
      // TODO: Check if user is organization admin
      // This would require additional logic to check organization membership and role
    }

    throw new Error('Permission denied. Only app owner or admin can manage media.');
  }
}
