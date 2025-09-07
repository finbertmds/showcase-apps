import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
      console.log('Creating user with data:', user);
      return user.save();
    } catch (error) {
      console.error('Error creating user:', error);
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

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('organizationId', 'name slug')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('organizationId', 'name slug')
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
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('organizationId', 'name slug')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }
}
