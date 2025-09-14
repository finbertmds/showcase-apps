import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldError, ValidationException } from '../exceptions/validation.exception';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class UserValidationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUserUpdate(
    userId: string, 
    updateData: Partial<User>
  ): Promise<void> {
    const fieldErrors: FieldError[] = [];

    // Validate email
    if (updateData.email !== undefined) {
      const emailErrors = await this.validateEmail(updateData.email, userId);
      fieldErrors.push(...emailErrors);
    }

    // Validate username
    if (updateData.username !== undefined) {
      const usernameErrors = await this.validateUsername(updateData.username, userId);
      fieldErrors.push(...usernameErrors);
    }

    // Validate name
    if (updateData.name !== undefined) {
      const nameErrors = this.validateName(updateData.name);
      fieldErrors.push(...nameErrors);
    }

    // Validate role
    if (updateData.role !== undefined) {
      const roleErrors = this.validateRole(updateData.role);
      fieldErrors.push(...roleErrors);
    }

    // Validate organizationId
    if (updateData.organizationId !== undefined) {
      const orgErrors = this.validateOrganizationId(updateData.organizationId);
      fieldErrors.push(...orgErrors);
    }

    // Validate isActive
    if (updateData.isActive !== undefined) {
      const activeErrors = this.validateIsActive(updateData.isActive);
      fieldErrors.push(...activeErrors);
    }

    // Validate avatar
    if (updateData.avatar !== undefined) {
      const avatarErrors = this.validateAvatar(updateData.avatar);
      fieldErrors.push(...avatarErrors);
    }

    // If there are any validation errors, throw exception
    if (fieldErrors.length > 0) {
      throw new ValidationException(fieldErrors);
    }
  }

  private async validateEmail(email: string, excludeUserId?: string): Promise<FieldError[]> {
    const errors: FieldError[] = [];

    // Check email format with more specific validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Basic format check
    if (!emailRegex.test(email)) {
      // More specific error messages
      if (!email.includes('@')) {
        errors.push({
          field: 'email',
          message: 'Email must contain @ symbol',
          code: 'INVALID_EMAIL_FORMAT',
        });
      } else if (email.indexOf('@') !== email.lastIndexOf('@')) {
        errors.push({
          field: 'email',
          message: 'Email can only contain one @ symbol',
          code: 'INVALID_EMAIL_FORMAT',
        });
      } else if (!email.includes('.')) {
        errors.push({
          field: 'email',
          message: 'Email must contain a domain with extension (e.g., .com)',
          code: 'INVALID_EMAIL_FORMAT',
        });
      } else if (email.split('@')[1] && !email.split('@')[1].includes('.')) {
        errors.push({
          field: 'email',
          message: 'Domain must contain a valid extension (e.g., .com, .org)',
          code: 'INVALID_EMAIL_FORMAT',
        });
      } else if (email.split('@')[1] && email.split('@')[1].split('.').length < 2) {
        errors.push({
          field: 'email',
          message: 'Domain extension must be at least 2 characters long',
          code: 'INVALID_EMAIL_FORMAT',
        });
      } else {
        errors.push({
          field: 'email',
          message: 'Please enter a valid email address',
          code: 'INVALID_EMAIL_FORMAT',
        });
      }
    }

    // Check email length
    if (email.length > 255) {
      errors.push({
        field: 'email',
        message: 'Email must be less than 255 characters',
        code: 'EMAIL_TOO_LONG',
      });
    }

    // Check for duplicate email
    if (emailRegex.test(email)) {
      const existingUser = await this.userModel.findOne({
        email: email.toLowerCase(),
        ...(excludeUserId && { _id: { $ne: excludeUserId } }),
      });

      if (existingUser) {
        errors.push({
          field: 'email',
          message: `Email '${email}' already exists`,
          code: 'DUPLICATE_EMAIL',
        });
      }
    }

    return errors;
  }

  private async validateUsername(username: string, excludeUserId?: string): Promise<FieldError[]> {
    const errors: FieldError[] = [];

    // Check username length
    if (username.length < 3) {
      errors.push({
        field: 'username',
        message: 'Username must be at least 3 characters long',
        code: 'USERNAME_TOO_SHORT',
      });
    }

    if (username.length > 50) {
      errors.push({
        field: 'username',
        message: 'Username must be less than 50 characters',
        code: 'USERNAME_TOO_LONG',
      });
    }

    // Check username format (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      errors.push({
        field: 'username',
        message: 'Username can only contain letters, numbers, and underscores',
        code: 'INVALID_USERNAME_FORMAT',
      });
    }

    // Check for duplicate username
    if (usernameRegex.test(username) && username.length >= 3) {
      const existingUser = await this.userModel.findOne({
        username: username.toLowerCase(),
        ...(excludeUserId && { _id: { $ne: excludeUserId } }),
      });

      if (existingUser) {
        errors.push({
          field: 'username',
          message: `Username '${username}' already exists`,
          code: 'DUPLICATE_USERNAME',
        });
      }
    }

    return errors;
  }

  private validateName(name: string): FieldError[] {
    const errors: FieldError[] = [];

    // Check name length
    if (name.length < 2) {
      errors.push({
        field: 'name',
        message: 'Name must be at least 2 characters long',
        code: 'NAME_TOO_SHORT',
      });
    }

    if (name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Name must be less than 100 characters',
        code: 'NAME_TOO_LONG',
      });
    }

    return errors;
  }

  private validateRole(role: UserRole): FieldError[] {
    const errors: FieldError[] = [];

    // Check if role is valid enum value
    if (!Object.values(UserRole).includes(role)) {
      errors.push({
        field: 'role',
        message: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`,
        code: 'INVALID_ROLE',
      });
    }

    return errors;
  }

  private validateOrganizationId(organizationId: any): FieldError[] {
    const errors: FieldError[] = [];

    // Check if organizationId is valid ObjectId format
    if (organizationId && organizationId !== null) {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(organizationId.toString())) {
        errors.push({
          field: 'organizationId',
          message: 'Organization ID must be a valid MongoDB ObjectId',
          code: 'INVALID_ORGANIZATION_ID',
        });
      }
    }

    return errors;
  }

  private validateIsActive(isActive: boolean): FieldError[] {
    const errors: FieldError[] = [];

    // Check if isActive is boolean
    if (typeof isActive !== 'boolean') {
      errors.push({
        field: 'isActive',
        message: 'isActive must be a boolean value',
        code: 'INVALID_IS_ACTIVE',
      });
    }

    return errors;
  }

  private validateAvatar(avatar: string): FieldError[] {
    const errors: FieldError[] = [];

    // Check avatar URL format if provided
    if (avatar && avatar.trim() !== '') {
      try {
        new URL(avatar);
      } catch {
        errors.push({
          field: 'avatar',
          message: 'Avatar must be a valid URL',
          code: 'INVALID_AVATAR_URL',
        });
      }

      // Check avatar URL length
      if (avatar.length > 500) {
        errors.push({
          field: 'avatar',
          message: 'Avatar URL must be less than 500 characters',
          code: 'AVATAR_URL_TOO_LONG',
        });
      }
    }

    return errors;
  }
}
