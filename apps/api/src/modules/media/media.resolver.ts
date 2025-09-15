import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

// Custom interface for file upload
interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
  createReadStream(): any;
}

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MUTATIONS, QUERIES } from '../../constants/graphql-operations';
import {
  ALLOWED_LOGO_TYPES,
  ALLOWED_SCREENSHOT_TYPES,
  CreateMediaInput,
  GetAppMediaInput,
  MAX_FILE_SIZE,
  MediaDto,
  MediaType,
  UploadAppLogoInput,
  UploadAppScreenshotInput
} from '../../dto/media.dto';
import { Media } from '../../schemas/media.schema';
import { UserRole } from '../../schemas/user.schema';
import { MinioService } from '../../services/minio.service';
import { AppsService } from '../apps/apps.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { MediaService } from './media.service';

@Resolver(() => MediaDto)
export class MediaResolver {
  constructor(
    private mediaService: MediaService,
    private minioService: MinioService,
    private appsService: AppsService,
    private organizationsService: OrganizationsService,
    private usersService: UsersService,
    @InjectQueue('image-processing') private imageProcessingQueue: Queue,
  ) {}

  @Mutation(() => MediaDto, { name: MUTATIONS.UPLOAD_APP_LOGO })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async uploadAppLogo(
    @Args('input') input: UploadAppLogoInput,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Context() context: any,
  ): Promise<MediaDto> {
    const user = context.req.user;
    
    // Validate file
    await this.validateFile(file, ALLOWED_LOGO_TYPES, MAX_FILE_SIZE);
    
    // Check permissions
    await this.checkAppPermissions(input.appId, user.id, user.role);
    
    // Get app info for organization context
    const app = await this.appsService.findOne(input.appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Handle old logo replacement
    await this.handleOldLogoReplacement(input.appId);

    // Upload file to MinIO
    const { url, filename } = await this.minioService.uploadFile(
      await this.fileUploadToMulterFile(file),
      `apps/${input.appId}/logos`
    );

    // Create media record
    const media = await this.mediaService.create({
      appId: input.appId,
      organizationId: app.organizationId?.toString(),
      type: MediaType.LOGO,
      order: 0,
    }, await this.fileUploadToMulterFile(file), user.id);

    // Update media with actual URL and filename
    await this.mediaService.updateMediaMetadata((media as any)._id.toString(), {
      url,
      filename,
      originalName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });

    // Queue image processing job
    await this.imageProcessingQueue.add('process-app-logo', {
      mediaId: (media as any)._id.toString(),
      appId: input.appId,
      filePath: filename,
      operations: ['resize', 'optimize', 'strip'],
    });

    return media as any;
  }

  @Mutation(() => MediaDto, { name: MUTATIONS.UPLOAD_APP_SCREENSHOT })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async uploadAppScreenshot(
    @Args('input') input: UploadAppScreenshotInput,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Context() context: any,
  ): Promise<MediaDto> {
    const user = context.req.user;
    
    // Validate file
    await this.validateFile(file, ALLOWED_SCREENSHOT_TYPES, MAX_FILE_SIZE);
    
    // Check permissions
    await this.checkAppPermissions(input.appId, user.id, user.role);
    
    // Get app info for organization context
    const app = await this.appsService.findOne(input.appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Upload file to MinIO
    const { url, filename } = await this.minioService.uploadFile(
      await this.fileUploadToMulterFile(file),
      `apps/${input.appId}/screenshots`
    );

    // Create media record
    const media = await this.mediaService.create({
      appId: input.appId,
      organizationId: app.organizationId?.toString(),
      type: MediaType.SCREENSHOT,
      order: input.order || 0,
    }, await this.fileUploadToMulterFile(file), user.id);

    // Update media with actual URL and filename
    await this.mediaService.updateMediaMetadata((media as any)._id.toString(), {
      url,
      filename,
      originalName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });

    // Queue image processing job
    await this.imageProcessingQueue.add('process-app-screenshot', {
      mediaId: (media as any)._id.toString(),
      appId: input.appId,
      filePath: filename,
      operations: ['resize', 'optimize', 'strip'],
    });

    return media as any;
  }

  @Query(() => [MediaDto], { name: QUERIES.GET_APP_MEDIA })
  @UseGuards(JwtAuthGuard)
  async getAppMedia(
    @Args('input') input: GetAppMediaInput,
    @Context() context: any,
  ): Promise<MediaDto[]> {
    const user = context.req.user;
    
    // Check permissions
    await this.checkAppPermissions(input.appId, user.id, user.role);
    
    let mediaList: Media[];
    
    if (input.type) {
      mediaList = await this.mediaService.findByAppIdAndType(input.appId, input.type);
    } else {
      mediaList = await this.mediaService.findByAppId(input.appId);
    }

    // Transform Media documents to MediaDto
    return mediaList.map((media) => ({
      id: (media as any)._id.toString(),
      appId: media.appId.toString(),
      organizationId: media.organizationId?.toString(),
      userId: media.userId?.toString(),
      type: media.type,
      url: media.url,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      width: media.width,
      height: media.height,
      order: media.order,
      isActive: media.isActive,
      meta: media.meta,
      uploadedBy: media.uploadedBy.toString(),
      createdBy: media.createdBy.toString(),
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    } as MediaDto));
  }

  @Mutation(() => Boolean, { name: MUTATIONS.DELETE_MEDIA })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async deleteMedia(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ): Promise<boolean> {
    try {
      const user = context.req.user;
      
      // Get media to check permissions
      const media = await this.mediaService.findById(id);
      if (!media) {
        throw new Error('Media not found');
      }
      
      // Check permissions
      await this.checkAppPermissions(media.appId.toString(), user.id, user.role);
      
      // Delete main file from MinIO
      try {
        await this.minioService.deleteFile(media.filename);
      } catch (error) {
        console.warn('⚠️ Failed to delete main file from MinIO:', error);
        // Continue with database deletion even if file deletion fails
      }

      // Delete all thumbnails from MinIO
      if (media.meta && media.meta.thumbnails && Array.isArray(media.meta.thumbnails)) {
        for (const thumbnail of media.meta.thumbnails) {
          if (thumbnail.url) {
            try {
              // Extract filename from thumbnail URL
              // URL format: http://localhost:9000/showcase-media/apps/68c6a6ef3e3115349fa8e8af/screenshots/filename_small.jpg
              // We need: apps/68c6a6ef3e3115349fa8e8af/screenshots/filename_small.jpg
              const urlParts = thumbnail.url.split('/');
              const bucketIndex = urlParts.findIndex(part => part === 'showcase-media');
              if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
                // Get everything after the bucket name
                const filename = urlParts.slice(bucketIndex + 1).join('/');
                await this.minioService.deleteFile(filename);
              } else {
                console.warn(`⚠️ Could not parse thumbnail URL: ${thumbnail.url}`);
              }
            } catch (error) {
              console.warn(`⚠️ Failed to delete thumbnail ${thumbnail.url}:`, error);
            }
          }
        }
      }
      
      // Delete from database
      const deleted = await this.mediaService.remove(id);
      
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => MediaDto, { name: MUTATIONS.CREATE_MEDIA })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  async createMedia(
    @Args('input') input: CreateMediaInput,
    @Context() context: any,
  ): Promise<MediaDto> {
    const user = context.req.user;
    
    // Check permissions
    await this.checkAppPermissions(input.appId, user.id, user.role);
    
    // Get app info for organization context
    const app = await this.appsService.findOne(input.appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Handle old logo replacement for logos
    if (input.type === MediaType.LOGO) {
      await this.handleOldLogoReplacement(input.appId);
    }

    // Create media record
    const media = await this.mediaService.createFromMetadata({
      appId: input.appId,
      organizationId: app.organizationId?.toString(),
      type: input.type,
      url: input.url,
      filename: input.filename,
      originalName: input.originalName,
      mimeType: input.mimeType,
      size: input.size,
      width: input.width,
      height: input.height,
      order: input.order || 0,
    }, user.id);

    // Queue image processing job for thumbnails/resizing
    await this.imageProcessingQueue.add('process-image', {
      mediaId: (media as any)._id.toString(),
      appId: input.appId,
      filePath: input.filename,
      operations: ['resize', 'optimize', 'strip'],
      mediaType: input.type,
    });

    return {
      id: (media as any)._id.toString(),
      appId: media.appId.toString(),
      organizationId: media.organizationId?.toString(),
      userId: media.userId?.toString(),
      type: media.type,
      url: media.url,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      width: media.width,
      height: media.height,
      order: media.order,
      isActive: media.isActive,
      meta: media.meta,
      uploadedBy: media.uploadedBy.toString(),
      createdBy: media.createdBy.toString(),
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    } as MediaDto;
  }

  private async validateFile(
    file: FileUpload,
    allowedTypes: string[],
    maxSize: number,
  ): Promise<void> {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
    }
  }

  private async checkAppPermissions(
    appId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    // Admin can access everything
    if (userRole === UserRole.ADMIN) {
      return;
    }

    const app = await this.appsService.findOne(appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Check if user is the app owner
    if (app.createdBy?.toString() === userId) {
      return;
    }

    // Check if user is organization admin
    if (app.organizationId) {
      const org = await this.organizationsService.findOne(app.organizationId.toString());
      if (org && org.ownerId.toString() === userId) {
        return;
      }
    }

    throw new Error('Insufficient permissions to manage this app');
  }

  private async handleOldLogoReplacement(appId: string): Promise<void> {
    const existingLogos = await this.mediaService.findByAppIdAndType(appId, MediaType.LOGO);
    
    for (const logo of existingLogos) {
      // Delete from MinIO
      await this.minioService.deleteFile(logo.filename);
      
      // Mark as inactive in database
      await this.mediaService.updateMediaMetadata((logo as any)._id.toString(), { isActive: false });
    }
  }

  private async fileUploadToMulterFile(file: FileUpload): Promise<any> {
    const { createReadStream, filename, mimetype, encoding } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          fieldname: 'file',
          originalname: filename,
          encoding,
          mimetype,
          buffer,
          size: buffer.length,
        } as any);
      });
    });
  }
}
