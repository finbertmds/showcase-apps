import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
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

  @Field({ nullable: true })
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
  appId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => EventType, { defaultValue: EventType.ANNOUNCEMENT })
  type: EventType;

  @Field()
  date: Date;

  @Field({ defaultValue: true })
  isPublic: boolean;

  @Field({ nullable: true })
  version?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  metadata?: Record<string, any>;
}

@InputType()
export class UpdateTimelineEventInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => EventType, { nullable: true })
  type?: EventType;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  version?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  metadata?: Record<string, any>;
}
