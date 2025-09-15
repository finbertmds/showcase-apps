import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const config = this.configService.get('minio');
    
    this.client = new Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });

    this.bucketName = config.bucket;

    // Ensure bucket exists
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Created bucket: ${this.bucketName}`);
      }
      
      // Set CORS policy for the bucket
      await this.setBucketCorsPolicy();
      
      // Set bucket policy for public read access
      await this.setPublicReadPolicy();
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  private async setBucketCorsPolicy(): Promise<void> {
    try {
      // Note: MinIO client doesn't have setBucketCors method
      // CORS is typically configured at the MinIO server level
      console.log(`ℹ️ CORS policy should be configured at MinIO server level for bucket: ${this.bucketName}`);
    } catch (error) {
      console.error('Error setting CORS policy:', error);
    }
  }

  private async setPublicReadPolicy(): Promise<void> {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${this.bucketName}/*`,
          },
        ],
      };

      await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
      console.log(`✅ Public read policy set for bucket: ${this.bucketName}`);
    } catch (error) {
      console.error('Error setting public read policy:', error);
    }
  }

  async uploadFile(
    file: any,
    folder: string = 'uploads',
    customFilename?: string,
  ): Promise<{ url: string; filename: string }> {
    // Use custom filename if provided, otherwise generate new one
    const filename = customFilename || `${folder}/${uuidv4()}.${file.originalname.split('.').pop()}`;

    try {
      await this.client.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Original-Name': file.originalname,
        },
      );

      const url = await this.getPublicUrl(filename);
      return { url, filename };
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw new Error('Failed to upload file');
    }
  }


  async getFileUrl(filename: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        filename,
        expiresIn,
      );
      return url;
    } catch (error) {
      console.error('Error getting file URL from MinIO:', error);
      throw new Error('Failed to get file URL');
    }
  }

  // Get public URL for file (no expiration)
  async getPublicUrl(filename: string): Promise<string> {
    try {
      // For public access, we'll use the direct URL format
      // This assumes the bucket is configured for public read access
      const protocol = this.configService.get('minio.useSSL') ? 'https' : 'http';
      const endPoint = this.configService.get('minio.endPoint');
      const port = this.configService.get('minio.port');
      
      // If port is 80/443, don't include it in URL
      const portSuffix = (port === 80 || port === 443) ? '' : `:${port}`;
      
      return `${protocol}://${endPoint}${portSuffix}/${this.bucketName}/${filename}`;
    } catch (error) {
      console.error('Error getting public URL from MinIO:', error);
      throw new Error('Failed to get public URL');
    }
  }

  async listFiles(prefix: string = '', recursive: boolean = true): Promise<any[]> {
    try {
      const objectsList: any[] = [];
      const stream = this.client.listObjects(this.bucketName, prefix, recursive);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => objectsList.push(obj));
        stream.on('error', reject);
        stream.on('end', () => resolve(objectsList));
      });
    } catch (error) {
      console.error('Error listing files from MinIO:', error);
      throw new Error('Failed to list files');
    }
  }

  async getFileInfo(filename: string): Promise<any> {
    try {
      const stat = await this.client.statObject(this.bucketName, filename);
      return stat;
    } catch (error) {
      console.error('Error getting file info from MinIO:', error);
      throw new Error('Failed to get file info');
    }
  }

  // Generate presigned URL for direct upload from client
  async getPresignedUploadUrl(
    filename: string,
    contentType: string,
    expiresIn: number = 60 * 60, // 1 hour
  ): Promise<string> {
    try {
      const url = await this.client.presignedPutObject(
        this.bucketName,
        filename,
        expiresIn,
      );
      return url;
    } catch (error) {
      console.error('Error getting presigned upload URL from MinIO:', error);
      throw new Error('Failed to get presigned upload URL');
    }
  }

  // Copy file within the same bucket
  async copyFile(sourceFilename: string, destFilename: string): Promise<void> {
    try {
      await this.client.copyObject(
        this.bucketName,
        destFilename,
        `/${this.bucketName}/${sourceFilename}`,
        new (require('minio').CopyConditions)()
      );
    } catch (error) {
      console.error('Error copying file in MinIO:', error);
      throw new Error('Failed to copy file');
    }
  }

  // Get bucket policy
  async getBucketPolicy(): Promise<string> {
    try {
      const policy = await this.client.getBucketPolicy(this.bucketName);
      return policy;
    } catch (error) {
      console.error('Error getting bucket policy from MinIO:', error);
      throw new Error('Failed to get bucket policy');
    }
  }

  // Set bucket policy
  async setBucketPolicy(policy: string): Promise<void> {
    try {
      await this.client.setBucketPolicy(this.bucketName, policy);
    } catch (error) {
      console.error('Error setting bucket policy in MinIO:', error);
      throw new Error('Failed to set bucket policy');
    }
  }

  // Delete file
  async deleteFile(filename: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, filename);
      console.log(`✅ Deleted file: ${filename}`);
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      throw new Error('Failed to delete file from storage');
    }
  }
}
