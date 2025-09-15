/**
 * Media API Service
 * Handles media-related REST API calls
 */

import { MediaType } from '@/types';
import { apiClient } from '../api-client';

interface PresignedUrlRequest {
  contentType: string;
  filename: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  filename: string;
}

export class MediaApiService {
  /**
   * Get presigned URL for media upload
   */
  static async getPresignedUrl(
    appId: string,
    type: MediaType,
    contentType: string,
    filename: string
  ): Promise<PresignedUrlResponse> {
    const response = await apiClient.post<PresignedUrlResponse>(
      `/api/apps/${appId}/media/${type}`,
      {
        contentType,
        filename
      }
    );

    if (!response.data) {
      throw new Error('Failed to get presigned URL');
    }

    return response.data;
  }

  /**
   * Upload file to presigned URL
   */
  static async uploadFile(uploadUrl: string, file: File): Promise<void> {
    await apiClient.uploadToPresignedUrl(uploadUrl, file);
  }

  /**
   * Complete media upload process
   * 1. Get presigned URL
   * 2. Upload file to S3/MinIO
   * 3. Return upload URL and filename for GraphQL mutation
   */
  static async uploadMedia(
    appId: string,
    type: MediaType,
    file: File
  ): Promise<{ uploadUrl: string; filename: string }> {
    // Step 1: Get presigned URL
    const { uploadUrl, filename } = await this.getPresignedUrl(
      appId,
      type,
      file.type,
      file.name
    );

    // Step 2: Upload file to S3/MinIO
    await this.uploadFile(uploadUrl, file);

    // Step 3: Return data for GraphQL mutation
    return {
      uploadUrl: uploadUrl.split('?')[0], // Remove query parameters
      filename
    };
  }
}

export type { PresignedUrlRequest, PresignedUrlResponse };
