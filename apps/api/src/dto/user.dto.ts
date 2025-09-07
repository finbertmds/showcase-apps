import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../schemas/user.schema';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role enum',
});

@ObjectType()
export class UserDto {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

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
