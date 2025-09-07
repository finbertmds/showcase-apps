import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../schemas/user.schema';
import { OrganizationDto } from './organization.dto';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role enum',
});

@ObjectType()
export class UserDto {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => OrganizationDto, { nullable: true })
  organization?: OrganizationDto;

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
