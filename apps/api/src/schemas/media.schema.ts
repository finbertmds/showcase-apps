import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

export enum MediaType {
  SCREENSHOT = 'screenshot',
  LOGO = 'logo',
  COVER = 'cover',
  ICON = 'icon',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Schema({ timestamps: true })
export class Media {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

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
    [key: string]: any;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

// Indexes
MediaSchema.index({ appId: 1, type: 1 });
MediaSchema.index({ appId: 1, order: 1 });
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ isActive: 1 });
