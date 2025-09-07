import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { UserDto } from './user.dto';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  role?: UserRole;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => UserDto)
  user: UserDto;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
