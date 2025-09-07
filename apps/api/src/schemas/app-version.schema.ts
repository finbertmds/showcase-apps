import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppVersionDocument = AppVersion & Document;

@Schema({ timestamps: true })
export class AppVersion {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

  @Prop({ required: true })
  version: string;

  @Prop()
  changelog?: string;

  @Prop({ type: Date, default: Date.now })
  releasedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  releasedBy: Types.ObjectId;

  @Prop({ default: false })
  isLatest: boolean;

  @Prop()
  downloadUrl?: string;

  @Prop()
  releaseNotes?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);

// Indexes
AppVersionSchema.index({ appId: 1, version: 1 }, { unique: true });
AppVersionSchema.index({ appId: 1, releasedAt: -1 });
AppVersionSchema.index({ isLatest: 1 });
