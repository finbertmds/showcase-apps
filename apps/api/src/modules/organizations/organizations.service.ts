import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationInput, OrganizationDto, UpdateOrganizationInput } from '../../dto/organization.dto';
import { ValidationException } from '../../exceptions/validation.exception';
import { App, AppDocument } from '../../schemas/app.schema';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { OrganizationValidationService } from '../../services/organization-validation.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(App.name) private appModel: Model<AppDocument>,
    private readonly validationService: OrganizationValidationService,
  ) {}

  async create(input: CreateOrganizationInput, ownerId: string): Promise<OrganizationDto> {
    // Validate input data
    await this.validationService.validateOrganizationCreate(input);

    try {
      const organization = new this.organizationModel({
        ...input,
        ownerId,
        isActive: input.isActive ?? true,
      });
      const savedOrganization = await organization.save();

      let owner = null;
      if (savedOrganization.ownerId) {
        owner = await this.userModel.findById(savedOrganization.ownerId).exec();
      }

      return {
        ...savedOrganization.toObject(),
        id: savedOrganization._id.toString(),
        ownerId: savedOrganization.ownerId.toString(),
        owner: owner,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error (fallback for race conditions)
        const field = Object.keys(error.keyPattern)[0];
        throw ValidationException.duplicateField(field, error.keyValue[field]);
      }
      throw error;
    }
  }

  async findAll(): Promise<OrganizationDto[]> {
    const organizations = await this.organizationModel.find().exec();
    
    const organizationsWithDetails = await Promise.all(
      organizations.map(async (org) => {
        let owner = null;
        if (org.ownerId) {
          owner = await this.userModel.findById(org.ownerId).exec();
        }

        return {
          ...org.toObject(),
          id: org._id.toString(),
          ownerId: org.ownerId.toString(),
          owner: owner,
        };
      })
    );

    return organizationsWithDetails;
  }

  async findOne(id: string): Promise<OrganizationDto> {
    const organization = await this.organizationModel.findById(id).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    let owner = null;
    if (organization.ownerId) {
      owner = await this.userModel.findById(organization.ownerId).exec();
    }

    return {
      ...organization.toObject(),
      id: organization._id.toString(),
      ownerId: organization.ownerId.toString(),
      owner: owner,
    };
  }

  async findBySlug(slug: string): Promise<OrganizationDto> {
    const organization = await this.organizationModel.findOne({ slug }).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    let owner = null;
    if (organization.ownerId) {
      owner = await this.userModel.findById(organization.ownerId).exec();
    }

    return {
      ...organization.toObject(),
      id: organization._id.toString(),
      ownerId: organization.ownerId.toString(),
      owner: owner,
    };
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<OrganizationDto> {
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

      let owner = null;
      if (organization.ownerId) {
        owner = await this.userModel.findById(organization.ownerId).exec();
      }

      return {
        ...organization.toObject(),
        id: organization._id.toString(),
        ownerId: organization.ownerId.toString(),
        owner: owner,
      };
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
    // Check if organization exists
    const organization = await this.organizationModel.findById(id).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Get all users belonging to this organization
    const users = await this.userModel.find({ organizationId: id }).exec();
    
    // Delete all apps created by these users
    for (const user of users) {
      await this.appModel.deleteMany({ createdBy: user._id }).exec();
    }

    // Delete all users belonging to this organization
    await this.userModel.deleteMany({ organizationId: id }).exec();

    // Delete the organization
    await this.organizationModel.findByIdAndDelete(id).exec();
    
    return true;
  }
}
