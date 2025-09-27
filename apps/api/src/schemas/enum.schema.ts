import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnumDocument = Enum & Document;
export type EnumOptionDocument = EnumOption & Document;

@Schema({ timestamps: true })
export class EnumOption {
  @Field(() => String)
  id: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  label: string;
}

export const EnumOptionSchema = SchemaFactory.createForClass(EnumOption);

@Schema({ timestamps: true })
export class Enum {
  @Field(() => String)
  id: string;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: [EnumOptionSchema], required: true })
  options: EnumOption[];

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EnumSchema = SchemaFactory.createForClass(Enum);

EnumSchema.virtual('id').get(function () {
  return this._id.toString();
});
