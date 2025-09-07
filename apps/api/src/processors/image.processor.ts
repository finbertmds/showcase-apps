import { Process, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as sharp from 'sharp';
import { MediaService } from '../modules/media/media.service';
import { MinioService } from '../services/minio.service';

interface ImageProcessingJob {
  mediaId: string;
  appId: string;
  filePath: string;
  operations: string[];
}

@Processor('image-processing')
export class ImageProcessor {
  constructor(
    private minioService: MinioService,
    private mediaService: MediaService,
  ) {}

  @Process('process-image')
  async handleImageProcessing(job: Job<ImageProcessingJob>) {
    const { mediaId, appId, filePath, operations } = job.data;

    try {
      // Download original image
      const originalBuffer = await this.minioService.getFileInfo(filePath);
      
      // Process image based on operations
      let processedBuffer = await this.processImage(originalBuffer, operations);
      
      // Generate thumbnails
      const thumbnails = await this.generateThumbnails(processedBuffer);
      
      // Upload processed images
      const uploadPromises = thumbnails.map(async (thumbnail) => {
        const filename = `${filePath}_${thumbnail.size}.jpg`;
        await this.minioService.uploadFile({
          buffer: thumbnail.buffer,
          originalname: filename,
          mimetype: 'image/jpeg',
          size: thumbnail.buffer.length,
        } as Express.Multer.File);
        
        return {
          size: thumbnail.size,
          url: await this.minioService.getFileUrl(filename),
        };
      });

      const uploadedThumbnails = await Promise.all(uploadPromises);
      
      // Update media record with thumbnail URLs
      await this.mediaService.updateMediaMetadata(mediaId, {
        thumbnails: uploadedThumbnails,
        processed: true,
      });

      console.log(`Image processing completed for media ${mediaId}`);
    } catch (error) {
      console.error(`Image processing failed for media ${mediaId}:`, error);
      throw error;
    }
  }

  private async processImage(
    buffer: Buffer,
    operations: string[],
  ): Promise<Buffer> {
    let image = sharp(buffer);

    for (const operation of operations) {
      switch (operation) {
        case 'resize':
          image = image.resize(1200, 800, {
            fit: 'inside',
            withoutEnlargement: true,
          });
          break;
        case 'optimize':
          image = image.jpeg({ quality: 85, progressive: true });
          break;
        case 'strip':
          image = image.strip();
          break;
        case 'normalize':
          image = image.normalize();
          break;
        default:
          console.warn(`Unknown image operation: ${operation}`);
      }
    }

    return image.toBuffer();
  }

  private async generateThumbnails(buffer: Buffer) {
    const sizes = [
      { size: 'small', width: 300, height: 200 },
      { size: 'medium', width: 600, height: 400 },
      { size: 'large', width: 1200, height: 800 },
    ];

    const thumbnails = await Promise.all(
      sizes.map(async ({ size, width, height }) => {
        const thumbnailBuffer = await sharp(buffer)
          .resize(width, height, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        return {
          size,
          buffer: thumbnailBuffer,
        };
      }),
    );

    return thumbnails;
  }
}
