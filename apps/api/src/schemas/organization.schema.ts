import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop()
  website?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;

  ownerIdString?: string; // Virtual field for GraphQL

  id: string; // Virtual field for GraphQL
  createdAt: Date;
  updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Indexes
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ ownerId: 1 });
OrganizationSchema.set('toJSON', { virtuals: true });
OrganizationSchema.set('toObject', { virtuals: true });
OrganizationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
OrganizationSchema.virtual('ownerIdString').get(function () {
  return this.ownerId?.toString();
});
