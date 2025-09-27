import { MUTATIONS, QUERIES } from '@/constants';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddEnumOptionInput, CreateEnumInput, EnumDto, UpdateEnumInput, UpdateEnumOptionInput } from '../../dto/enum.dto';
import { UserRole } from '../../schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EnumService } from './enum.service';

@Resolver(() => EnumDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnumResolver {
  constructor(private readonly enumService: EnumService) {}

  @Query(() => [EnumDto], { name: QUERIES.ENUMS })
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<EnumDto[]> {
    const enums = await this.enumService.findAll();
    const enumsDto = enums.map(enumDoc => ({
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    }));
    return enumsDto;
  }

  @Query(() => EnumDto, { name: QUERIES.ENUM })
  @Roles(UserRole.ADMIN)
  async findByKey(@Args('key') key: string): Promise<EnumDto> {
    const enumDoc = await this.enumService.findByKey(key);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.CREATE_ENUM })
  @Roles(UserRole.ADMIN)
  async create(@Args('input') createEnumInput: CreateEnumInput): Promise<EnumDto> {
    const enumDoc = await this.enumService.create(createEnumInput);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.UPDATE_ENUM })
  @Roles(UserRole.ADMIN)
  async update(
    @Args('key') key: string,
    @Args('input') updateEnumInput: UpdateEnumInput,
  ): Promise<EnumDto> {
    const enumDoc = await this.enumService.update(key, updateEnumInput);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.ADD_ENUM_OPTION })
  @Roles(UserRole.ADMIN)
  async addOption(
    @Args('key') key: string,
    @Args('input') addOptionInput: AddEnumOptionInput,
  ): Promise<EnumDto> {
    const enumDoc = await this.enumService.addOption(key, addOptionInput);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.UPDATE_ENUM_OPTION })
  @Roles(UserRole.ADMIN)
  async updateOption(
    @Args('key') key: string,
    @Args('input') updateOptionInput: UpdateEnumOptionInput,
  ): Promise<EnumDto> {
    const enumDoc = await this.enumService.updateOption(key, updateOptionInput.id, updateOptionInput);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.REMOVE_ENUM_OPTION })
  @Roles(UserRole.ADMIN)
  async removeOption(
    @Args('id') id: string,
    @Args('key') key: string,
  ): Promise<EnumDto> {
    const enumDoc = await this.enumService.removeOption(key, id);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => Boolean, { name: MUTATIONS.DELETE_ENUM })
  @Roles(UserRole.ADMIN)
  async delete(@Args('key') key: string): Promise<boolean> {
    return this.enumService.delete(key);
  }

  @Mutation(() => EnumDto, { name: MUTATIONS.RESET_ENUM_TO_DEFAULT })
  @Roles(UserRole.ADMIN)
  async resetToDefault(@Args('key') key: string): Promise<EnumDto> {
    const enumDoc = await this.enumService.resetToDefault(key);
    return {
      id: enumDoc.id,
      key: enumDoc.key,
      options: enumDoc.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      updatedAt: enumDoc.updatedAt,
    };
  }

  @Mutation(() => Boolean, { name: MUTATIONS.RESET_ALL_ENUMS_TO_DEFAULT })
  @Roles(UserRole.ADMIN)
  async resetAllToDefault(): Promise<boolean> {
    await this.enumService.resetAllToDefault();
    return true;
  }

  @Query(() => String, { name: QUERIES.DEBUG_ENUM_USAGE })
  @Roles(UserRole.ADMIN)
  async debugEnumUsage(@Args('key') key: string): Promise<string> {
    const result = await this.enumService.debugEnumUsage(key);
    return JSON.stringify(result, null, 2);
  }
}
