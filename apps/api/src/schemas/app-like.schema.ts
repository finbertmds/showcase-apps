import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppLikeDocument = AppLike & Document;

@Schema({ timestamps: true })
export class AppLike {
  @Prop({ type: Types.ObjectId, ref: 'App', required: true })
  appId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 'like' }) // sau này có thể mở rộng: "love", "star", ...
  reaction: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AppLikeSchema = SchemaFactory.createForClass(AppLike);

// Compound index to prevent duplicate likes
AppLikeSchema.index({ appId: 1, userId: 1 }, { unique: true });

// Indexes for performance
AppLikeSchema.index({ appId: 1 });
AppLikeSchema.index({ userId: 1 });
AppLikeSchema.index({ reaction: 1 });
AppLikeSchema.index({ createdAt: -1 });

AppLikeSchema.virtual('id').get(function () {
  return this._id.toString();
});
