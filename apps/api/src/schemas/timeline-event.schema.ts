import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimelineEventDocument = TimelineEvent & Document;

export enum EventType {
  RELEASE = 'RELEASE',
  UPDATE = 'UPDATE',
  MILESTONE = 'MILESTONE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  FEATURE = 'FEATURE',
  BUGFIX = 'BUGFIX',
}

@Schema({ timestamps: true })
export class TimelineEvent {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ 
    type: String, 
    enum: EventType, 
    default: EventType.ANNOUNCEMENT 
  })
  type: EventType;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop()
  version?: string;

  @Prop()
  url?: string;

  @Prop({ type: Object })
  metadata?: {
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const TimelineEventSchema = SchemaFactory.createForClass(TimelineEvent);

// Indexes
TimelineEventSchema.index({ appId: 1, date: -1 });
TimelineEventSchema.index({ appId: 1, type: 1 });
TimelineEventSchema.index({ isPublic: 1 });
TimelineEventSchema.index({ date: -1 });
TimelineEventSchema.index({ createdBy: 1 });
