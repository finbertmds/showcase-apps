import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppDocument = App & Document;

export enum AppStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AppVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

export enum Platform {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  DESKTOP = 'DESKTOP',
  API = 'API',
}

@Schema({ timestamps: true })
export class App {
  @Field(() => String)
  id: string; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  shortDesc: string;

  @Prop({ required: true })
  longDesc: string;

  @Prop({ 
    type: String, 
    enum: AppStatus, 
    default: AppStatus.DRAFT 
  })
  status: AppStatus;

  @Prop({ 
    type: String, 
    enum: AppVisibility, 
    default: AppVisibility.PUBLIC 
  })
  visibility: AppVisibility;

  @Prop({ type: Date })
  releaseDate?: Date;

  @Prop({ type: [String], enum: Platform, default: [] })
  platforms: Platform[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  organizationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  website?: string;

  @Prop()
  repository?: string;

  @Prop()
  demoUrl?: string;

  @Prop()
  downloadUrl?: string;

  @Prop()
  appStoreUrl?: string;

  @Prop()
  playStoreUrl?: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const AppSchema = SchemaFactory.createForClass(App);

// Indexes
AppSchema.index({ slug: 1 });
AppSchema.index({ organizationId: 1 });
AppSchema.index({ createdBy: 1 });
AppSchema.index({ status: 1 });
AppSchema.index({ visibility: 1 });
AppSchema.index({ platforms: 1 });
AppSchema.index({ tags: 1 });
AppSchema.index({ releaseDate: -1 });
AppSchema.index({ createdAt: -1 });
AppSchema.index({ viewCount: -1 });
AppSchema.index({ likeCount: -1 });

// Text search index
AppSchema.index({
  title: 'text',
  shortDesc: 'text',
  longDesc: 'text',
  tags: 'text',
});

AppSchema.virtual('id').get(function () {
  return this._id.toString();
});
