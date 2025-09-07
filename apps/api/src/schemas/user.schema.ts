import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  clerkId: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.VIEWER 
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId?: Types.ObjectId;

  organizationIdString?: string; // Virtual field for GraphQL

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  lastLoginAt?: Date;

  id: string; // Virtual field for GraphQL
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ clerkId: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ role: 1 });

// Transform _id to id
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
UserSchema.virtual('organizationIdString').get(function () {
  return this.organizationId?.toString();
});
