import { UserDto } from '@/dto/user.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { ValidationException } from '../../exceptions/validation.exception';
import { App, AppDocument } from '../../schemas/app.schema';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { UserValidationService } from '../../services/user-validation.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    @InjectModel(App.name) private appModel: Model<AppDocument>,
    private validationService: UserValidationService,
  ) {}

  async create(userData: {
    email: string;
    name: string;
    username: string;
    password: string;
    role?: UserRole;
    organizationId?: string;
    avatar?: string;
  }): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        throw new ConflictException('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      return user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        const duplicateField = this.extractDuplicateField(error.message);
        if (duplicateField) {
          throw ValidationException.duplicateField(duplicateField, userData[duplicateField]);
        }
      }
      
      if (error.name === 'ValidationError') {
        // Trường hợp fail validate trong Mongoose schema
        for (const field in error.errors) {
          console.error(`Validation error on field "${field}": ${error.errors[field].message}`);
        }
      } else if (error?.name === 'MongoServerError') {
        console.error('Mongo validation error:', error.errInfo?.details ?? error);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    
    // Get organization information for each user
    const usersWithOrganizations = await Promise.all(
      users.map(async (user) => {
        let organization = null;
        if (user.organizationId) {
          organization = await this.organizationModel.findById(user.organizationId).exec();
        }

        return {
          ...user.toObject(),
          id: user._id.toString(),
          organizationId: user.organizationId?.toString(),
          organization: organization,
        };
      })
    );

    return usersWithOrganizations as UserDto[];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    }).exec();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await this.validatePassword(user, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedNewPassword }).exec();
    return true;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    // Validate all fields before attempting update
    await this.validationService.validateUserUpdate(id, updateData);

    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      // If validation passed but MongoDB still throws duplicate key error,
      // it means there's a race condition - handle it gracefully
      if (error.code === 11000) {
        const duplicateField = this.extractDuplicateField(error.message);
        if (duplicateField) {
          throw ValidationException.duplicateField(duplicateField, updateData[duplicateField] as string);
        }
      }
      throw error;
    }
  }

  private extractDuplicateField(errorMessage: string): string | null {
    // Extract field name from MongoDB duplicate key error
    // Example: "E11000 duplicate key error collection: showcase.users index: username_1 dup key: { username: \"testuser\" }"
    const match = errorMessage.match(/index: (\w+)_\d+/);
    if (match) {
      return match[1];
    }
    return null;
  }

  async remove(id: string): Promise<boolean> {
    // Check if user exists
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete all apps created by this user
    await this.appModel.deleteMany({ createdBy: id }).exec();

    // Delete the user
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }

  async findPaginated(filters: any, limit: number, offset: number): Promise<{ users: UserDto[]; total: number }> {
    // Build the query
    const query = this.userModel.find(filters);
    
    // Get total count
    const total = await this.userModel.countDocuments(filters);
    
    // Apply pagination and populate organization
    const users = await query
      .populate('organizationId', 'name slug logo website isActive')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    // Transform to DTO format
    const usersWithOrganizations = users.map((user) => {
      const userObj = user.toObject();
      const populatedOrg = userObj.organizationId as any;
      
      return {
        ...userObj,
        id: user._id.toString(),
        organizationId: populatedOrg?._id?.toString(),
        organization: populatedOrg ? {
          id: populatedOrg._id.toString(),
          name: populatedOrg.name,
          slug: populatedOrg.slug,
          description: populatedOrg.description,
          logo: populatedOrg.logo,
          website: populatedOrg.website,
          isActive: populatedOrg.isActive,
          ownerId: populatedOrg.ownerId?.toString(),
          owner: null, // We don't need owner info for user list
          createdAt: populatedOrg.createdAt,
          updatedAt: populatedOrg.updatedAt,
        } : null,
      };
    });

    return {
      users: usersWithOrganizations as UserDto[],
      total,
    };
  }
}
