import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDto } from '../../dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserDto, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Context() context: any): Promise<UserDto> {
    return context.req.user;
  }

  @Mutation(() => String)
  async loginWithClerk(
    @Args('clerkToken') clerkToken: string,
  ): Promise<string> {
    // In a real implementation, you would verify the Clerk token here
    // and create/update the user accordingly
    // For now, this is a placeholder
    throw new Error('Clerk integration not implemented yet');
  }
}
