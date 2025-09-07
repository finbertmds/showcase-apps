import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, LoginInput, RegisterInput } from '../../dto/auth.dto';
import { UserRole } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (user && user.isActive) {
      return user;
    }
    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { usernameOrEmail, password } = loginInput;

    // Find user by username or email
    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      username: user.username,
      sub: (user as any)._id.toString(),
      role: user.role,
      organizationId: user.organizationId?.toString(),
    };

    // Update last login
    await this.usersService.updateLastLogin((user as any)._id.toString());

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId?.toString(),
        isActive: user.isActive,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      },
    };
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { username, email, name, password, role } = registerInput;

    try {
      console.log('Registering user:', registerInput);
      // Create user
      const user = await this.usersService.create({
        username,
        email,
        name,
        password,
        role: role || UserRole.VIEWER,
      });

      // Generate JWT token
      const payload = {
        email: user.email,
        username: user.username,
        sub: (user as any)._id.toString(),
        role: user.role,
        organizationId: user.organizationId?.toString(),
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: (user as any)._id.toString(),
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId?.toString(),
          isActive: user.isActive,
          avatar: user.avatar,
          lastLoginAt: user.lastLoginAt,
          createdAt: (user as any).createdAt,
            updatedAt: (user as any).updatedAt,
          },
      };
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.name === 'ValidationError') {
        for (const field in error.errors) {
          console.error(`Validation error on field "${field}": ${error.errors[field].message}`);
        }
      } else if (error?.name === 'MongoServerError') {
        console.log(
          'Mongo validation error details:',
          JSON.stringify(error.errInfo.details, null, 2)
        );
    
        // Nếu muốn lấy ra list các field lỗi rõ ràng
        const details = error.errInfo.details.schemaRulesNotSatisfied;
    
        details.forEach((rule) => {
          if (rule.propertiesNotSatisfied) {
            rule.propertiesNotSatisfied.forEach((prop) => {
              console.error(
                `Invalid field: ${prop.propertyName}, reason: ${JSON.stringify(prop.details)}`
              );
            });
          }
    
          if (rule.missingProperties) {
            console.error(
              `Missing required fields: ${rule.missingProperties.join(', ')}`
            );
          }
        });
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    return this.usersService.changePassword(userId, currentPassword, newPassword);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
