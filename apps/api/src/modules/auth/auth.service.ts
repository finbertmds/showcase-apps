import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(clerkId: string): Promise<any> {
    const user = await this.usersService.findByClerkId(clerkId);
    if (user && user.isActive) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
    };

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async createOrUpdateUser(clerkUser: {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }): Promise<any> {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new UnauthorizedException('No email found in Clerk user');
    }

    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0];

    // Check if user exists
    let user = await this.usersService.findByClerkId(clerkUser.id);
    
    if (user) {
      // Update existing user
      user = await this.usersService.update(user.id, {
        name,
        email,
        avatar: clerkUser.imageUrl,
      });
    } else {
      // Create new user
      user = await this.usersService.create({
        email,
        name,
        clerkId: clerkUser.id,
        role: UserRole.VIEWER, // Default role
        avatar: clerkUser.imageUrl,
      });
    }

    return user;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
