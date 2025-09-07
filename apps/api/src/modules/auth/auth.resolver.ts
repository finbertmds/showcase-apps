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
    try {
      // Create or update user from Clerk token
      const user = await this.authService.createOrUpdateUserFromClerkToken(clerkToken);
      
      // Generate JWT token
      const result = await this.authService.login(user);
      return result.access_token;
    } catch (error) {
      throw new Error(`Clerk login failed: ${error.message}`);
    }
  }
}
