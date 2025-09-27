import { Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { AppStatus, AppVisibility, Platform } from '../schemas/app.schema';
import { OrganizationDto } from './organization.dto';
import { UserDto } from './user.dto';

registerEnumType(AppStatus, {
  name: 'AppStatus',
  description: 'App status enum',
});

registerEnumType(AppVisibility, {
  name: 'AppVisibility',
  description: 'App visibility enum',
});

registerEnumType(Platform, {
  name: 'Platform',
  description: 'Platform enum',
});

@ObjectType()
export class AppDto {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  shortDesc: string;

  @Field()
  longDesc: string;

  @Field(() => AppStatus)
  status: AppStatus;

  @Field(() => AppVisibility)
  visibility: AppVisibility;

  @Field({ nullable: true })
  releaseDate?: Date;

  @Field(() => [Platform!])
  platforms: Platform[];

  @Field(() => [String!])
  languages: string[];

  @Field(() => [String!])
  tags: string[];

  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => OrganizationDto, { nullable: true })
  organization?: OrganizationDto;

  @Field(() => String)
  createdBy: string;

  @Field(() => UserDto, { nullable: true })
  createdByUser?: UserDto;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  repository?: string;

  @Field({ nullable: true })
  demoUrl?: string;

  @Field({ nullable: true })
  downloadUrl?: string;

  @Field({ nullable: true })
  appStoreUrl?: string;

  @Field({ nullable: true })
  playStoreUrl?: string;

  @Field({ nullable: true })
  viewCount?: number;

  @Field({ nullable: true })
  likeCount?: number;

  @Field({ nullable: true })
  userLiked?: boolean;

  @Field({ nullable: true })
  userViewed?: boolean;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}

@InputType()
export class CreateAppInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shortDesc: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  longDesc: string;

  @Field(() => AppStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AppStatus)
  status?: AppStatus;

  @Field(() => AppVisibility, { defaultValue: AppVisibility.PUBLIC })
  @IsEnum(AppVisibility)
  visibility: AppVisibility;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @Field(() => [Platform!], { defaultValue: [] })
  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms: Platform[];

  @Field(() => [String!], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @Field(() => [String!], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  repository?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  downloadUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  appStoreUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  playStoreUrl?: string;
}

@InputType()
export class UpdateAppInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  longDesc?: string;

  @Field(() => AppStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AppStatus)
  status?: AppStatus;

  @Field(() => AppVisibility, { nullable: true })
  @IsOptional()
  @IsEnum(AppVisibility)
  visibility?: AppVisibility;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @Field(() => [Platform!], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms?: Platform[];

  @Field(() => [String!], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @Field(() => [String!], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  repository?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  downloadUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  appStoreUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  playStoreUrl?: string;
}

@ObjectType()
export class AppsPage {
  @Field(() => [AppDto])
  items: AppDto[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
