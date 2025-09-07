import { OrganizationDto } from '@/dto/organization.dto';
import { Field } from '@nestjs/graphql';
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
  @Field(() => String)
  id: string; 
  
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.VIEWER 
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  organizationId?: Types.ObjectId;

  @Field(() => OrganizationDto, { nullable: true })
  organization?: OrganizationDto;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ role: 1 });

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});
