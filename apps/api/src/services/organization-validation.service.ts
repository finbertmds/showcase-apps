import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldError, ValidationException } from '../exceptions/validation.exception';
import { Organization, OrganizationDocument } from '../schemas/organization.schema';

@Injectable()
export class OrganizationValidationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
  ) {}

  async validateOrganizationUpdate(
    organizationId: string,
    updateData: Partial<Organization>
  ): Promise<void> {
    const fieldErrors: FieldError[] = [];

    // Validate name
    if (updateData.name !== undefined) {
      const nameErrors = await this.validateName(updateData.name, organizationId);
      fieldErrors.push(...nameErrors);
    }

    // Validate slug
    if (updateData.slug !== undefined) {
      const slugErrors = await this.validateSlug(updateData.slug, organizationId);
      fieldErrors.push(...slugErrors);
    }

    // Validate description
    if (updateData.description !== undefined) {
      const descriptionErrors = this.validateDescription(updateData.description);
      fieldErrors.push(...descriptionErrors);
    }

    // Validate website
    if (updateData.website !== undefined) {
      const websiteErrors = this.validateWebsite(updateData.website);
      fieldErrors.push(...websiteErrors);
    }

    // Validate logo
    if (updateData.logo !== undefined) {
      const logoErrors = this.validateLogo(updateData.logo);
      fieldErrors.push(...logoErrors);
    }

    // Validate isActive
    if (updateData.isActive !== undefined) {
      const isActiveErrors = this.validateIsActive(updateData.isActive);
      fieldErrors.push(...isActiveErrors);
    }

    if (fieldErrors.length > 0) {
      throw new ValidationException(fieldErrors);
    }
  }

  async validateOrganizationCreate(createData: Partial<Organization>): Promise<void> {
    const fieldErrors: FieldError[] = [];

    // Validate name (required for create)
    if (createData.name !== undefined) {
      const nameErrors = await this.validateName(createData.name);
      fieldErrors.push(...nameErrors);
    } else {
      fieldErrors.push({
        field: 'name',
        message: 'Organization name is required',
        code: 'REQUIRED_FIELD',
      });
    }

    // Validate slug (required for create)
    if (createData.slug !== undefined) {
      const slugErrors = await this.validateSlug(createData.slug);
      fieldErrors.push(...slugErrors);
    } else {
      fieldErrors.push({
        field: 'slug',
        message: 'Organization slug is required',
        code: 'REQUIRED_FIELD',
      });
    }

    // Validate description
    if (createData.description !== undefined) {
      const descriptionErrors = this.validateDescription(createData.description);
      fieldErrors.push(...descriptionErrors);
    }

    // Validate website
    if (createData.website !== undefined) {
      const websiteErrors = this.validateWebsite(createData.website);
      fieldErrors.push(...websiteErrors);
    }

    // Validate logo
    if (createData.logo !== undefined) {
      const logoErrors = this.validateLogo(createData.logo);
      fieldErrors.push(...logoErrors);
    }

    // Validate isActive
    if (createData.isActive !== undefined) {
      const isActiveErrors = this.validateIsActive(createData.isActive);
      fieldErrors.push(...isActiveErrors);
    }

    if (fieldErrors.length > 0) {
      throw new ValidationException(fieldErrors);
    }
  }

  private async validateName(name: string, excludeOrganizationId?: string): Promise<FieldError[]> {
    const errors: FieldError[] = [];

    // Check name length
    if (!name || name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Organization name is required',
        code: 'REQUIRED_FIELD',
      });
      return errors;
    }

    if (name.length < 2) {
      errors.push({
        field: 'name',
        message: 'Organization name must be at least 2 characters long',
        code: 'NAME_TOO_SHORT',
      });
    }

    if (name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Organization name must be less than 100 characters',
        code: 'NAME_TOO_LONG',
      });
    }

    // Check for duplicate name
    const existingOrganization = await this.organizationModel.findOne({
      name: name.trim(),
      ...(excludeOrganizationId && { _id: { $ne: excludeOrganizationId } }),
    });

    if (existingOrganization) {
      errors.push({
        field: 'name',
        message: `Organization name '${name}' already exists`,
        code: 'DUPLICATE_NAME',
      });
    }

    return errors;
  }

  private async validateSlug(slug: string, excludeOrganizationId?: string): Promise<FieldError[]> {
    const errors: FieldError[] = [];

    // Check slug length
    if (!slug || slug.trim().length === 0) {
      errors.push({
        field: 'slug',
        message: 'Organization slug is required',
        code: 'REQUIRED_FIELD',
      });
      return errors;
    }

    // Check slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      errors.push({
        field: 'slug',
        message: 'Slug can only contain lowercase letters, numbers, hyphens, and underscores',
        code: 'INVALID_SLUG_FORMAT',
      });
    }

    if (slug.length < 2) {
      errors.push({
        field: 'slug',
        message: 'Slug must be at least 2 characters long',
        code: 'SLUG_TOO_SHORT',
      });
    }

    if (slug.length > 50) {
      errors.push({
        field: 'slug',
        message: 'Slug must be less than 50 characters',
        code: 'SLUG_TOO_LONG',
      });
    }

    // Check for duplicate slug
    const existingOrganization = await this.organizationModel.findOne({
      slug: slug.toLowerCase(),
      ...(excludeOrganizationId && { _id: { $ne: excludeOrganizationId } }),
    });

    if (existingOrganization) {
      errors.push({
        field: 'slug',
        message: `Slug '${slug}' already exists`,
        code: 'DUPLICATE_SLUG',
      });
    }

    return errors;
  }

  private validateDescription(description: string): FieldError[] {
    const errors: FieldError[] = [];

    if (description && description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must be less than 500 characters',
        code: 'DESCRIPTION_TOO_LONG',
      });
    }

    return errors;
  }

  private validateWebsite(website: string): FieldError[] {
    const errors: FieldError[] = [];

    if (website && website.trim().length > 0) {
      // Check URL format
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(website)) {
        errors.push({
          field: 'website',
          message: 'Please enter a valid website URL (e.g., https://example.com)',
          code: 'INVALID_WEBSITE_FORMAT',
        });
      }

      if (website.length > 255) {
        errors.push({
          field: 'website',
          message: 'Website URL must be less than 255 characters',
          code: 'WEBSITE_TOO_LONG',
        });
      }
    }

    return errors;
  }

  private validateLogo(logo: string): FieldError[] {
    const errors: FieldError[] = [];

    if (logo && logo.trim().length > 0) {
      // Check URL format
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(logo)) {
        errors.push({
          field: 'logo',
          message: 'Please enter a valid logo URL (e.g., https://example.com/logo.png)',
          code: 'INVALID_LOGO_FORMAT',
        });
      }

      if (logo.length > 255) {
        errors.push({
          field: 'logo',
          message: 'Logo URL must be less than 255 characters',
          code: 'LOGO_TOO_LONG',
        });
      }

      // Check if it's an image URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      const hasImageExtension = imageExtensions.some(ext => 
        logo.toLowerCase().includes(ext)
      );
      
      if (!hasImageExtension) {
        errors.push({
          field: 'logo',
          message: 'Logo URL should point to an image file (.jpg, .png, .gif, .svg, .webp)',
          code: 'INVALID_IMAGE_FORMAT',
        });
      }
    }

    return errors;
  }

  private validateIsActive(isActive: boolean): FieldError[] {
    const errors: FieldError[] = [];

    if (typeof isActive !== 'boolean') {
      errors.push({
        field: 'isActive',
        message: 'isActive must be a boolean value',
        code: 'INVALID_BOOLEAN',
      });
    }

    return errors;
  }
}
