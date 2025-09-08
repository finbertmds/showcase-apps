import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationInput, UpdateOrganizationInput } from '../../dto/organization.dto';
import { ValidationException } from '../../exceptions/validation.exception';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { OrganizationValidationService } from '../../services/organization-validation.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    private readonly validationService: OrganizationValidationService,
  ) {}

  async create(input: CreateOrganizationInput, ownerId: string): Promise<Organization> {
    // Validate input data
    await this.validationService.validateOrganizationCreate(input);

    try {
      const organization = new this.organizationModel({
        ...input,
        ownerId,
        isActive: input.isActive ?? true,
      });
      return organization.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error (fallback for race conditions)
        const field = Object.keys(error.keyPattern)[0];
        throw ValidationException.duplicateField(field, error.keyValue[field]);
      }
      throw error;
    }
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().exec();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationModel.findById(id).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async findBySlug(slug: string): Promise<Organization> {
    const organization = await this.organizationModel.findOne({ slug }).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<Organization> {
    // Validate input data
    await this.validationService.validateOrganizationUpdate(id, input);

    try {
      const organization = await this.organizationModel.findByIdAndUpdate(
        id,
        { ...input },
        { new: true, runValidators: true }
      ).exec();

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      return organization;
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error (fallback for race conditions)
        const field = Object.keys(error.keyPattern)[0];
        throw ValidationException.duplicateField(field, error.keyValue[field]);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.organizationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Organization not found');
    }
    return true;
  }
}
