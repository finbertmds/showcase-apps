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
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; filename: string }> {
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${folder}/${uuidv4()}.${fileExtension}`;

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

      const url = await this.getFileUrl(filename);
      return { url, filename };
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, filename);
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      throw new Error('Failed to delete file');
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
}
