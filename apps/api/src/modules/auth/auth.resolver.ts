import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthResponse, ChangePasswordInput, LoginInput, RegisterInput } from '../../dto/auth.dto';
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

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async register(@Args('input') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Args('input') changePasswordInput: ChangePasswordInput,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context.req.user._id.toString();
    return this.authService.changePassword(
      userId,
      changePasswordInput.currentPassword,
      changePasswordInput.newPassword,
    );
  }
}
