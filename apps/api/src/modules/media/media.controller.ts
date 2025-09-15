import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bullmq';
import { MediaType } from '../../dto/media.dto';
import { UserRole } from '../../schemas/user.schema';
import { MinioService } from '../../services/minio.service';
import { AppsService } from '../apps/apps.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { MediaService } from './media.service';

interface UploadRequest {
  appId: string;
  type: 'LOGO' | 'SCREENSHOT';
}

@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private minioService: MinioService,
    private appsService: AppsService,
    private organizationsService: OrganizationsService,
    private usersService: UsersService,
    @InjectQueue('image-processing') private imageProcessingQueue: Queue,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadRequest,
    @Req() req: any,
  ) {
    const user = req.user;
    const { appId, type } = body;

    // Validate file
    if (!file) {
      throw new Error('No file uploaded');
    }

    const allowedTypes = type === 'LOGO' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
    }

    // Check permissions
    const app = await this.appsService.findOne(appId);
    if (!app) {
      throw new Error('App not found');
    }

    // Check if user can manage this app
    if (user.role !== UserRole.ADMIN && app.createdBy.toString() !== user.id) {
      throw new Error('Permission denied');
    }

    // Handle old logo replacement for logos
    if (type === 'LOGO') {
      const existingLogos = await this.mediaService.findByAppIdAndType(appId, MediaType.LOGO);
      for (const logo of existingLogos) {
        await this.minioService.deleteFile(logo.filename);
        await this.mediaService.updateMediaMetadata((logo as any)._id.toString(), { isActive: false });
      }
    }

    // Upload file to MinIO
    const { url, filename } = await this.minioService.uploadFile(
      file,
      `apps/${appId}/${type}s`
    );

    // Create media record
    const media = await this.mediaService.create({
      appId,
      organizationId: app.organizationId?.toString(),
      type: type === 'LOGO' ? MediaType.LOGO : MediaType.SCREENSHOT,
      order: 0,
    }, file, user.id);

    // Update media with actual URL and filename
    await this.mediaService.updateMediaMetadata((media as any)._id.toString(), {
      url,
      filename,
    });

    // Queue image processing job
    await this.imageProcessingQueue.add('process-image', {
      mediaId: (media as any)._id.toString(),
      type: type === 'LOGO' ? MediaType.LOGO : MediaType.SCREENSHOT,
    });

    return {
      id: (media as any)._id.toString(),
      url,
      filename,
      type: type === 'LOGO' ? MediaType.LOGO : MediaType.SCREENSHOT,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
