import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppViewDocument = AppView & Document;

@Schema({ timestamps: true })
export class AppView {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  viewedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const AppViewSchema = SchemaFactory.createForClass(AppView);

// Compound index to prevent duplicate views
AppViewSchema.index({ appId: 1, userId: 1 }, { unique: true });

// Indexes for performance
AppViewSchema.index({ appId: 1 });
AppViewSchema.index({ userId: 1 });
AppViewSchema.index({ viewedAt: -1 });
AppViewSchema.index({ createdAt: -1 });

AppViewSchema.virtual('id').get(function () {
  return this._id.toString();
});
