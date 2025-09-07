import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMediaInput } from '../../dto/media.dto';
import { Media, MediaDocument, MediaType } from '../../schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async create(createMediaInput: CreateMediaInput, file: Express.Multer.File, userId: string): Promise<Media> {
    const media = new this.mediaModel({
      ...createMediaInput,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: userId,
    });
    return media.save();
  }

  async findByAppId(appId: string): Promise<Media[]> {
    return this.mediaModel
      .find({ appId, isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  async findByAppIdAndType(appId: string, type: MediaType): Promise<Media[]> {
    return this.mediaModel
      .find({ appId, type, isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .exec();
  }

  async updateMediaMetadata(id: string, metadata: Record<string, any>): Promise<Media> {
    return this.mediaModel.findByIdAndUpdate(
      id,
      { meta: metadata },
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.mediaModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
