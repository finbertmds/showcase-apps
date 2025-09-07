import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';
import { EventType } from '../schemas/timeline-event.schema';

registerEnumType(EventType, {
  name: 'EventType',
  description: 'Timeline event type enum',
});

@ObjectType()
export class TimelineEventDto {
  @Field(() => ID)
  id: string;

  @Field()
  appId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => EventType)
  type: EventType;

  @Field()
  date: Date;

  @Field()
  isPublic: boolean;

  @Field({ nullable: true })
  version?: string;

  @Field({ nullable: true })
  url?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateTimelineEventInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  appId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => EventType, { defaultValue: EventType.ANNOUNCEMENT })
  @IsEnum(EventType)
  type: EventType;

  @Field()
  @IsDateString()
  date: Date;

  @Field({ defaultValue: true })
  @IsBoolean()
  isPublic: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

@InputType()
export class UpdateTimelineEventInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => EventType, { nullable: true })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;
}
