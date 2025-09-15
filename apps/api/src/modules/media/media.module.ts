import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageProcessor } from '../../processors/image.processor';
import { Media, MediaSchema } from '../../schemas/media.schema';
import { MinioService } from '../../services/minio.service';
import { AppsModule } from '../apps/apps.module';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { MediaRestController } from './media-rest.controller';
import { MediaController } from './media.controller';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
    ]),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
    AppsModule,
    OrganizationsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [MediaController, MediaRestController],
  providers: [MediaResolver, MediaService, MinioService, ImageProcessor],
  exports: [MediaService],
})
export class MediaModule {}
