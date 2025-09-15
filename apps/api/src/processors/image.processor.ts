import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as sharp from 'sharp';
import { MediaService } from '../modules/media/media.service';
import { MediaType } from '../schemas/media.schema';
import { MinioService } from '../services/minio.service';

interface ImageProcessingJob {
  mediaId: string;
  appId: string;
  filePath: string;
  operations: string[];
  mediaType?: MediaType;
}

@Processor('image-processing')
export class ImageProcessor extends WorkerHost {
  constructor(
    private minioService: MinioService,
    private mediaService: MediaService,
  ) {
    super();
  }

  async process(job: Job<ImageProcessingJob>) {
    const { mediaId, appId, filePath, operations, mediaType } = job.data;

    try {
      // Get media record to get original file info
      const media = await this.mediaService.findById(mediaId);
      if (!media) {
        throw new Error(`Media not found: ${mediaId}`);
      }

      // Use media.filename if filePath is undefined
      const actualFilePath = filePath || media.filename;
      if (!actualFilePath) {
        throw new Error(`No file path available for media: ${mediaId}`);
      }

      // Download original image from MinIO
      const originalBuffer = await this.downloadFileFromMinio(actualFilePath);
      
      // Provide default operations if none specified
      const defaultOperations = operations || ['resize', 'optimize'];
      
      // Process image based on operations and media type
      let processedBuffer = await this.processImage(originalBuffer, defaultOperations, mediaType);
      
      // Generate thumbnails based on media type
      const thumbnails = await this.generateThumbnails(processedBuffer, mediaType);
      
      // Upload processed images
      const uploadPromises = thumbnails.map(async (thumbnail) => {
        const filename = `${actualFilePath}_${thumbnail.size}.jpg`;
        await this.minioService.uploadFile({
          buffer: thumbnail.buffer,
          originalname: filename,
          mimetype: 'image/jpeg',
          size: thumbnail.buffer.length,
        } as any, 'uploads', filename);
        
        return {
          size: thumbnail.size,
          url: await this.minioService.getPublicUrl(filename),
        };
      });

      const uploadedThumbnails = await Promise.all(uploadPromises);
      
      // Update media record with thumbnail URLs and dimensions
      const imageInfo = await sharp(processedBuffer).metadata();
      await this.mediaService.updateMediaMetadata(mediaId, {
        thumbnails: uploadedThumbnails,
        processed: true,
        width: imageInfo.width,
        height: imageInfo.height,
      });
    } catch (error) {
      console.error(`Image processing failed for media ${mediaId}:`, error);
      throw error;
    }
  }

  private async processImage(
    buffer: Buffer,
    operations: string[],
    mediaType?: MediaType,
  ): Promise<Buffer> {
    let image = sharp(buffer);

    // Ensure operations is an array
    const ops = Array.isArray(operations) ? operations : ['resize', 'optimize'];

    for (const operation of ops) {
      switch (operation) {
        case 'resize':
          if (mediaType === MediaType.LOGO) {
            // App logos: resize to 512x512 max, maintain aspect ratio
            image = image.resize(512, 512, {
              fit: 'inside',
              withoutEnlargement: true,
            });
          } else if (mediaType === MediaType.SCREENSHOT) {
            // Screenshots: resize to 1200x800 max, maintain aspect ratio
            image = image.resize(1200, 800, {
              fit: 'inside',
              withoutEnlargement: true,
            });
          } else {
            // Default resize
            image = image.resize(1200, 800, {
              fit: 'inside',
              withoutEnlargement: true,
            });
          }
          break;
        case 'optimize':
          image = image.jpeg({ quality: 85, progressive: true });
          break;
        case 'strip':
          // Remove EXIF data
          image = image.withMetadata();
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

  private async generateThumbnails(buffer: Buffer, mediaType?: MediaType) {
    let sizes: Array<{ size: string; width: number; height: number }>;

    if (mediaType === MediaType.LOGO) {
      // App logo thumbnails: square formats
      sizes = [
        { size: 'small', width: 128, height: 128 },
        { size: 'medium', width: 256, height: 256 },
        { size: 'large', width: 512, height: 512 },
      ];
    } else if (mediaType === MediaType.SCREENSHOT) {
      // Screenshot thumbnails: maintain aspect ratio
      sizes = [
        { size: 'small', width: 300, height: 200 },
        { size: 'medium', width: 600, height: 400 },
        { size: 'large', width: 1200, height: 800 },
      ];
    } else {
      // Default thumbnails
      sizes = [
        { size: 'small', width: 300, height: 200 },
        { size: 'medium', width: 600, height: 400 },
        { size: 'large', width: 1200, height: 800 },
      ];
    }

    const thumbnails = await Promise.all(
      sizes.map(async ({ size, width, height }) => {
        const thumbnailBuffer = await sharp(buffer)
          .resize(width, height, {
            fit: mediaType === MediaType.LOGO ? 'cover' : 'cover',
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

  private async downloadFileFromMinio(filePath: string): Promise<Buffer> {
    try {
      // Get file stream from MinIO
      const stream = await this.minioService['client'].getObject(
        this.minioService['bucketName'],
        filePath
      );

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      console.error('Error downloading file from MinIO:', error);
      throw new Error('Failed to download file from MinIO');
    }
  }
}
