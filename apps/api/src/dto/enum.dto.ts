import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

@ObjectType()
export class EnumOptionDto {
  @Field()
  id: string;

  @Field()
  value: string;

  @Field()
  label: string;
}

@ObjectType()
export class EnumDto {
  @Field()
  id: string;

  @Field()
  key: string;

  @Field(() => [EnumOptionDto])
  options: EnumOptionDto[];

  @Field()
  updatedAt: Date;
}

@InputType()
export class EnumOptionInput {
  @Field({ nullable: true })
  @IsString()
  id?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  label: string;
}

@InputType()
export class CreateEnumInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  key: string;

  @Field(() => [EnumOptionInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumOptionInput)
  options: EnumOptionInput[];
}

@InputType()
export class UpdateEnumInput {
  @Field(() => [EnumOptionInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumOptionInput)
  options: EnumOptionInput[];
}

@InputType()
export class AddEnumOptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  label: string;
}

@InputType()
export class UpdateEnumOptionInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  label: string;
}
