import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

export enum MediaType {
  ALL = 'ALL',
  LOGO = 'LOGO',
  SCREENSHOT = 'SCREENSHOT',
  COVER = 'COVER',
  ICON = 'ICON',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export const MediaTypePriority = {
  [MediaType.LOGO]: 1,
  [MediaType.SCREENSHOT]: 2,
  [MediaType.COVER]: 3,
  [MediaType.ICON]: 4,
  [MediaType.VIDEO]: 5,
  [MediaType.DOCUMENT]: 6,
};

@Schema({ timestamps: true })
export class Media {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  organizationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: MediaType, 
    required: true 
  })
  type: MediaType;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
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
    [key: string]: any;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

// Indexes
MediaSchema.index({ appId: 1, type: 1 });
MediaSchema.index({ appId: 1, order: 1 });
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ isActive: 1 });
