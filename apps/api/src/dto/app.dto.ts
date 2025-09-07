import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AppStatus, AppVisibility, Platform } from '../schemas/app.schema';

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
  _id: string;

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

  @Field()
  organizationId: string;

  @Field()
  createdBy: string;

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

  @Field()
  viewCount: number;

  @Field()
  likeCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateAppInput {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  shortDesc: string;

  @Field()
  longDesc: string;

  @Field(() => AppVisibility, { defaultValue: AppVisibility.PUBLIC })
  visibility: AppVisibility;

  @Field({ nullable: true })
  releaseDate?: Date;

  @Field(() => [Platform!], { defaultValue: [] })
  platforms: Platform[];

  @Field(() => [String!], { defaultValue: [] })
  languages: string[];

  @Field(() => [String!], { defaultValue: [] })
  tags: string[];

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
}

@InputType()
export class UpdateAppInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  shortDesc?: string;

  @Field({ nullable: true })
  longDesc?: string;

  @Field(() => AppStatus, { nullable: true })
  status?: AppStatus;

  @Field(() => AppVisibility, { nullable: true })
  visibility?: AppVisibility;

  @Field({ nullable: true })
  releaseDate?: Date;

  @Field(() => [Platform!], { nullable: true })
  platforms?: Platform[];

  @Field(() => [String!], { nullable: true })
  languages?: string[];

  @Field(() => [String!], { nullable: true })
  tags?: string[];

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
}
