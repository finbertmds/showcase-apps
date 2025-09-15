import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMediaLegacyInput } from '../../dto/media.dto';
import { Media, MediaDocument, MediaType, MediaTypePriority } from '../../schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async create(createMediaInput: CreateMediaLegacyInput, file: any, userId: string): Promise<Media> {
    const media = new this.mediaModel({
      ...createMediaInput,
      appId: new Types.ObjectId(createMediaInput.appId),
      organizationId: createMediaInput.organizationId ? new Types.ObjectId(createMediaInput.organizationId) : undefined,
      userId: createMediaInput.userId ? new Types.ObjectId(createMediaInput.userId) : undefined,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
    });
    return media.save();
  }

  async createFromMetadata(metadata: any, userId: string): Promise<Media> {
    // Validate required fields
    if (!metadata.url) {
      throw new Error('URL is required for media creation');
    }
    if (!metadata.filename) {
      throw new Error('Filename is required for media creation');
    }
    if (!metadata.originalName) {
      throw new Error('Original name is required for media creation');
    }
    if (!metadata.mimeType) {
      throw new Error('MIME type is required for media creation');
    }
    if (!metadata.size) {
      throw new Error('File size is required for media creation');
    }

    const media = new this.mediaModel({
      appId: new Types.ObjectId(metadata.appId),
      organizationId: metadata.organizationId ? new Types.ObjectId(metadata.organizationId) : undefined,
      userId: new Types.ObjectId(userId), // Set userId field
      type: metadata.type,
      url: metadata.url,
      filename: metadata.filename,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      size: metadata.size,
      width: metadata.width,
      height: metadata.height,
      order: metadata.order || 0,
      uploadedBy: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
    });
    return media.save();
  }

  async findByAppId(appId: string): Promise<Media[]> {
    // Try both string and ObjectId queries
    const stringQuery = { appId, isActive: true };
    const objectIdQuery = { appId: new Types.ObjectId(appId), isActive: true };
    
    // First try with string
    let result = await this.mediaModel
      .find(stringQuery)
      .sort({ order: 1, createdAt: 1 })
      .exec();
    
    
    // If no results, try with ObjectId
    if (result.length === 0) {
      result = await this.mediaModel
        .find(objectIdQuery)
        .sort({ order: 1, createdAt: 1 })
        .exec();
    }
    
    // Sort by MediaType priority: LOGO, SCREENSHOT, COVER, ICON, VIDEO, DOCUMENT
    return this.sortByMediaTypePriority(result);
  }

  async findByAppIdAndType(appId: string, type: MediaType): Promise<Media[]> {
    // Try both string and ObjectId queries
    const stringQuery = { appId, type, isActive: true };
    const objectIdQuery = { appId: new Types.ObjectId(appId), type, isActive: true };
    
    // First try with string
    let result = await this.mediaModel
      .find(stringQuery)
      .sort({ order: 1, createdAt: 1 })
      .exec();
    
    // If no results, try with ObjectId
    if (result.length === 0) {
      result = await this.mediaModel
        .find(objectIdQuery)
        .sort({ order: 1, createdAt: 1 })
        .exec();
    }
    
    // Sort by MediaType priority (though all items are same type, still sort by order and date)
    return this.sortByMediaTypePriority(result);
  }

  async updateMediaMetadata(id: string, metadata: Record<string, any>): Promise<Media> {
    return this.mediaModel.findByIdAndUpdate(
      id,
      { 
        $set: {
          ...metadata,
          'meta.thumbnails': metadata.thumbnails,
          'meta.processed': metadata.processed,
          'meta.width': metadata.width,
          'meta.height': metadata.height,
        }
      },
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.mediaModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findById(id: string): Promise<Media | null> {
    return this.mediaModel.findById(id).exec();
  }

  async deleteByAppIdAndType(appId: string, type: MediaType): Promise<void> {
    await this.mediaModel.updateMany(
      { appId, type },
      { isActive: false }
    ).exec();
  }

  /**
   * Sort media by MediaType priority: LOGO, SCREENSHOT, COVER, ICON, VIDEO, DOCUMENT
   */
  private sortByMediaTypePriority(mediaList: Media[]): Media[] {
    return mediaList.sort((a, b) => {
      const priorityA = MediaTypePriority[a.type] || 999;
      const priorityB = MediaTypePriority[b.type] || 999;
      
      // First sort by type priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Then sort by order within same type
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      
      // Finally sort by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
}
