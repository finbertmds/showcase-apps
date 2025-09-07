import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrganizationDto {
  @Field(() => ID)
  _id: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
