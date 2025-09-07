import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';
import { MediaType } from '../schemas/media.schema';

// Re-export MediaType for GraphQL
export { MediaType };

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Media type enum',
});

@ObjectType()
export class MediaDto {
  @Field(() => ID)
  _id: string;

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

  @Field(() => GraphQLJSON, { nullable: true })
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
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field(() => MediaType)
  @IsEnum(MediaType)
  type: MediaType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  meta?: Record<string, any>;
}
