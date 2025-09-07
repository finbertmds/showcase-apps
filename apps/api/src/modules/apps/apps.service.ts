import { Organization, OrganizationDocument } from '@/schemas/organization.schema';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppDto, CreateAppInput, UpdateAppInput } from '../../dto/app.dto';
import { App, AppDocument } from '../../schemas/app.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(App.name) private appModel: Model<AppDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(createAppInput: CreateAppInput, userId: string, organizationId: string | null): Promise<App> {
    const app = new this.appModel({
      ...createAppInput,
      createdBy: userId,
      organizationId: organizationId ? new Types.ObjectId(organizationId) : null,
    });
    return app.save();
  }

  async findAll(
    filters: {
      status?: string;
      visibility?: string;
      platforms?: string[];
      tags?: string[];
      search?: string;
      organizationId?: string;
    } = {},
    limit = 20,
    offset = 0,
  ): Promise<{ apps: AppDto[]; total: number }> {
    const query: any = {};

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.visibility) {
      query.visibility = filters.visibility;
    }
    if (filters.platforms && filters.platforms.length > 0) {
      query.platforms = { $in: filters.platforms };
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.organizationId) {
      query.organizationId = filters.organizationId ? new Types.ObjectId(filters.organizationId) : null;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const [apps, total] = await Promise.all([
      this.appModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.appModel.countDocuments(query).exec(),
    ]);

    // Populate createdByUser and organization for each app
    const appsWithDetails = await Promise.all(
      apps.map(async (app) => {
        let user = null;
        if (app.createdBy) {
          user = await this.userModel.findById(app.createdBy).exec();
        }

        let organization = null;
        if (app.organizationId) {
          organization = await this.organizationModel.findById(app.organizationId).exec();
        }

        return {
          ...app.toObject(),
          id: app._id.toString(),
          createdBy: app.createdBy.toString(),
          createdByUser: user,
          organizationId: app.organizationId?.toString(),
          organization: organization,
        };
      })
    );

    return { apps: appsWithDetails, total };
  }

  async findOne(id: string): Promise<AppDto> {
    const app = await this.appModel
      .findById(id)
      .exec();

    if (!app) {
      throw new NotFoundException('App not found');
    }

    let user = null;
    if (app.createdBy) {
      user = await this.userModel.findById(app.createdBy).exec();
    }

    let organization = null;
    if (app.organizationId) {
      organization = await this.organizationModel.findById(app.organizationId).exec();
    }

    return {
      ...app.toObject(),
      id: app._id.toString(),
      createdBy: app.createdBy.toString(),
      createdByUser: user,
      organizationId: app.organizationId?.toString(),
      organization: organization,
    };
  }

  async findBySlug(slug: string): Promise<AppDto> {
    const app = await this.appModel
      .findOne({ slug })
      .exec();

    if (!app) {
      throw new NotFoundException('App not found');
    }

    let user = null;
    if (app.createdBy) {
      user = await this.userModel.findById(app.createdBy).exec();
    }

    let organization = null;
    if (app.organizationId) {
      organization = await this.organizationModel.findById(app.organizationId).exec();
    }

    return {
      ...app.toObject(),
      id: app._id.toString(),
      createdBy: app.createdBy.toString(),
      createdByUser: user,
      organizationId: app.organizationId?.toString(),
      organization: organization,
    };
  }

  async update(
    id: string,
    updateAppInput: UpdateAppInput,
    userId: string,
    userRole: UserRole,
  ): Promise<App> {
    const app = await this.findOne(id);

    // Check permissions
    if (userRole !== UserRole.ADMIN && app.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own apps');
    }

    const updatedApp = await this.appModel
      .findByIdAndUpdate(id, updateAppInput, { new: true })
      .exec();

    return updatedApp;
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<boolean> {
    const app = await this.findOne(id);

    // Check permissions
    if (userRole !== UserRole.ADMIN && app.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own apps');
    }

    await this.appModel.findByIdAndDelete(id).exec();
    return true;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.appModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.appModel.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }).exec();
  }

  async getTimelineApps(limit = 20, offset = 0): Promise<{ apps: AppDto[]; total: number }> {
    const query = {
      status: 'published',
      visibility: 'public',
    };

    const [apps, total] = await Promise.all([
      this.appModel
        .find(query)
        .sort({ releaseDate: -1, createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.appModel.countDocuments(query).exec(),
    ]);

    // Populate createdByUser and organization for each app
    const appsWithDetails = await Promise.all(
      apps.map(async (app) => {
        let user = null;
        if (app.createdBy) {
          user = await this.userModel.findById(app.createdBy).exec();
        }

        let organization = null;
        if (app.organizationId) {
          organization = await this.organizationModel.findById(app.organizationId).exec();
        }

        return {
          ...app.toObject(),
          id: app._id.toString(),
          createdBy: app.createdBy.toString(),
          createdByUser: user,
          organizationId: app.organizationId?.toString(),
          organization: organization,
        };
      })
    );

    return { apps: appsWithDetails, total };
  }
}
