# Media Management API Documentation

## Overview

The Showcase Apps backend now supports media management using REST API + presigned S3 URLs for efficient file uploads. This approach allows clients to upload files directly to S3/MinIO storage while maintaining proper permissions and metadata management.

## Architecture

### Flow
1. **Client requests presigned URL** → REST API validates permissions and returns presigned URL
2. **Client uploads file directly** → File goes directly to S3/MinIO storage
3. **Client saves metadata** → GraphQL mutation saves file metadata to MongoDB
4. **Background processing** → BullMQ job processes image for thumbnails/resizing

## REST API Endpoints

### 1. Get Presigned URL for Logo Upload

**Endpoint:** `POST /api/apps/:appId/media/logo`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contentType": "image/png",
  "filename": "optional-custom-filename.png"
}
```

**Response:**
```json
{
  "uploadUrl": "https://minio.example.com/bucket/apps/123/logos/uuid.png?X-Amz-Algorithm=...",
  "filename": "apps/123/logos/uuid.png",
  "expiresIn": 3600
}
```

**Validation:**
- File type: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- Max size: 5MB
- Permissions: App owner or admin only

### 2. Get Presigned URL for Screenshot Upload

**Endpoint:** `POST /api/apps/:appId/media/screenshot`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contentType": "image/png",
  "filename": "optional-custom-filename.png"
}
```

**Response:**
```json
{
  "uploadUrl": "https://minio.example.com/bucket/apps/123/screenshots/uuid.png?X-Amz-Algorithm=...",
  "filename": "apps/123/screenshots/uuid.png",
  "expiresIn": 3600
}
```

## GraphQL Mutations

### Create Media Metadata

**Mutation:** `createMedia`

**Input:**
```graphql
input CreateMediaInput {
  appId: ID!
  organizationId: String
  userId: String
  type: MediaType!
  url: String!
  filename: String!
  originalName: String!
  mimeType: String!
  size: Int!
  width: Int
  height: Int
  order: Int
}
```

**Example:**
```graphql
mutation CreateMedia($input: CreateMediaInput!) {
  createMedia(input: $input) {
    id
    url
    filename
    type
    size
    mimeType
    width
    height
    order
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "appId": "507f1f77bcf86cd799439011",
    "type": "LOGO",
    "url": "https://minio.example.com/bucket/apps/123/logos/uuid.png",
    "filename": "apps/123/logos/uuid.png",
    "originalName": "my-logo.png",
    "mimeType": "image/png",
    "size": 1024,
    "width": 512,
    "height": 512,
    "order": 0
  }
}
```

## Media Schema

```typescript
interface Media {
  id: string;
  appId: string;
  organizationId?: string;
  userId?: string;
  type: MediaType; // 'LOGO' | 'SCREENSHOT' | 'COVER' | 'ICON' | 'VIDEO' | 'DOCUMENT'
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  order: number;
  isActive: boolean;
  meta?: {
    alt?: string;
    caption?: string;
    colors?: string[];
    dominantColor?: string;
    thumbnails?: Array<{
      size: string;
      url: string;
    }>;
    processed?: boolean;
  };
  uploadedBy: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Permissions

### Access Control
- **App Owner**: Can manage media for their own apps
- **Organization Admin**: Can manage media for apps in their organization
- **System Admin**: Can manage media for any app

### Permission Checks
1. **REST API**: Validates permissions before generating presigned URLs
2. **GraphQL**: Validates permissions before saving metadata
3. **File Access**: S3/MinIO bucket policies control file access

## File Processing

### Background Jobs
After metadata is saved, a BullMQ job is queued for image processing:

```typescript
await imageProcessingQueue.add('process-image', {
  mediaId: mediaId,
  type: 'LOGO' | 'SCREENSHOT'
});
```

### Processing Tasks
- **Thumbnail Generation**: Multiple sizes (128x128, 256x256, 512x512)
- **Image Optimization**: Compression and format conversion
- **Metadata Extraction**: Colors, dimensions, etc.

## Error Handling

### Common Errors

**403 Forbidden:**
```json
{
  "message": "Permission denied. Only app owner or admin can manage media."
}
```

**400 Bad Request:**
```json
{
  "message": "Invalid file type. Allowed: image/jpeg, image/jpg, image/png, image/webp"
}
```

**404 Not Found:**
```json
{
  "message": "App not found"
}
```

## Usage Examples

### Frontend Implementation

```typescript
// 1. Get presigned URL
const presignedResponse = await fetch(`/api/apps/${appId}/media/logo`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: file.type,
    filename: file.name
  })
});

const { uploadUrl, filename } = await presignedResponse.json();

// 2. Upload file directly to S3
const uploadResponse = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type
  }
});

// 3. Save metadata via GraphQL
const metadataMutation = `
  mutation CreateMedia($input: CreateMediaInput!) {
    createMedia(input: $input) {
      id
      url
      filename
      type
    }
  }
`;

const metadataResponse = await apolloClient.mutate({
  mutation: gql(metadataMutation),
  variables: {
    input: {
      appId,
      type: 'LOGO',
      url: uploadUrl.split('?')[0], // Remove query params
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      width: imageWidth,
      height: imageHeight
    }
  }
});
```

## Benefits

### Performance
- **Direct Upload**: Files go directly to S3/MinIO, reducing server load
- **Parallel Processing**: Upload and metadata saving can happen in parallel
- **CDN Ready**: Files are immediately available via CDN

### Security
- **Presigned URLs**: Time-limited, permission-scoped upload URLs
- **Validation**: File type and size validation before upload
- **Access Control**: Proper permission checks at every step

### Scalability
- **Serverless**: No file processing on application servers
- **Background Jobs**: Image processing happens asynchronously
- **Storage**: Unlimited storage capacity with S3/MinIO

## Migration from Direct Upload

The old direct upload endpoints are still available for backward compatibility:

- `POST /api/media/upload` (legacy)
- GraphQL mutations: `uploadAppLogo`, `uploadAppScreenshot` (legacy)

New implementations should use the presigned URL approach for better performance and scalability.
