import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput, UserDto } from '../../dto/user.dto';
import { ValidationExceptionFilter } from '../../filters/validation-exception.filter';
import { UserRole } from '../../schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserDto], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll() as any;
  }

  @Query(() => UserDto, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(id) as any;
  }

  @Query(() => UserDto, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Context() context: any): Promise<UserDto> {
    const user = context.req.user;
    return this.usersService.findOne(user._id.toString()) as any;
  }

  @Mutation(() => UserDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(ValidationExceptionFilter)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserDto> {
    const updateData: any = {};
    
    // Only include fields that are provided (not undefined)
    if (input.email !== undefined) updateData.email = input.email;
    if (input.name !== undefined) updateData.name = input.name;
    if (input.username !== undefined) updateData.username = input.username;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.organizationId !== undefined) updateData.organizationId = input.organizationId;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.avatar !== undefined) updateData.avatar = input.avatar;
    
    return this.usersService.update(id, updateData) as any;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
