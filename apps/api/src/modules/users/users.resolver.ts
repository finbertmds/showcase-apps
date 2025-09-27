import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MUTATIONS, QUERIES } from '../../constants/graphql-operations';
import { UpdateUserInput, UserDto, UsersPage } from '../../dto/user.dto';
import { ValidationExceptionFilter } from '../../filters/validation-exception.filter';
import { UserRole } from '../../schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserDto], { name: QUERIES.USERS })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll() as any;
  }

  @Query(() => UserDto, { name: QUERIES.USER })
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(id) as any;
  }

  @Query(() => UserDto, { name: QUERIES.ME })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Context() context: any): Promise<UserDto> {
    const user = context.req.user;
    return this.usersService.findOne(user._id.toString()) as any;
  }

  @Query(() => UsersPage, { name: 'usersPaginated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findPaginated(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('role', { nullable: true }) role?: string,
    @Args('status', { nullable: true }) status?: string,
  ): Promise<UsersPage> {
    const filters: any = {};
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role && role !== 'all') {
      filters.role = role;
    }
    
    if (status && status !== 'all') {
      if (status === 'active') {
        filters.isActive = true;
      } else if (status === 'inactive') {
        filters.isActive = false;
      }
    }

    const { users, total } = await this.usersService.findPaginated(filters, limit, offset);
    
    return {
      items: users as any,
      totalCount: total,
      limit,
      offset,
    };
  }

  @Mutation(() => UserDto, { name: MUTATIONS.UPDATE_USER })
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

  @Mutation(() => Boolean, { name: MUTATIONS.REMOVE_USER })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
