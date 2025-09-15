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
  id: string;

  @Field()
  appId: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field({ nullable: true })
  userId?: string;

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
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


@InputType()
export class UploadAppLogoInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  appId: string;
}

@InputType()
export class UploadAppScreenshotInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;
}

@InputType()
export class GetAppMediaInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field(() => MediaType, { nullable: true })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;
}

@InputType()
export class CreateMediaLegacyInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => MediaType)
  @IsEnum(MediaType)
  type: MediaType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;
}

@InputType()
export class CreateMediaInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field(() => MediaType)
  @IsEnum(MediaType)
  type: MediaType;

  @Field()
  @IsNotEmpty()
  @IsString()
  url: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @Field()
  @IsNumber()
  size: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  width?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  height?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;
}

// REST API DTOs
export class PresignedUrlRequestDto {
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsString()
  @IsOptional()
  filename?: string;
}

export class PresignedUrlResponseDto {
  uploadUrl: string;
  filename: string;
  expiresIn: number;
}

// File validation constants
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_SCREENSHOT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
