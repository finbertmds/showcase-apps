import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

@ObjectType()
export class OwnerDto {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class OrganizationDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  isActive: boolean;

  @Field()
  ownerId: string;

  @Field(() => OwnerDto, { nullable: true })
  owner?: OwnerDto;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateOrganizationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
