import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MediaType } from '../schemas/media.schema';

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Media type enum',
});

@ObjectType()
export class MediaDto {
  @Field(() => ID)
  id: string;

  @Field()
  appId: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  originalName: string;

  @Field()
  mimeType: string;

  @Field()
  size: number;

  @Field({ nullable: true })
  width?: number;

  @Field({ nullable: true })
  height?: number;

  @Field()
  order: number;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  meta?: Record<string, any>;

  @Field()
  uploadedBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateMediaInput {
  @Field()
  appId: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  meta?: Record<string, any>;
}
