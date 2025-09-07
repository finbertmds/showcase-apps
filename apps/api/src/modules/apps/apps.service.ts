import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppInput, UpdateAppInput } from '../../dto/app.dto';
import { App, AppDocument } from '../../schemas/app.schema';
import { UserRole } from '../../schemas/user.schema';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(App.name) private appModel: Model<AppDocument>,
  ) {}

  async create(createAppInput: CreateAppInput, userId: string, organizationId: string): Promise<App> {
    const app = new this.appModel({
      ...createAppInput,
      createdBy: userId,
      organizationId,
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
  ): Promise<{ apps: App[]; total: number }> {
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
      query.organizationId = filters.organizationId;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const [apps, total] = await Promise.all([
      this.appModel
        .find(query)
        .populate('createdBy', 'name email')
        .populate('organizationId', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.appModel.countDocuments(query).exec(),
    ]);

    return { apps, total };
  }

  async findOne(id: string): Promise<App> {
    const app = await this.appModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('organizationId', 'name slug')
      .exec();

    if (!app) {
      throw new NotFoundException('App not found');
    }

    return app;
  }

  async findBySlug(slug: string): Promise<App> {
    const app = await this.appModel
      .findOne({ slug })
      .populate('createdBy', 'name email')
      .populate('organizationId', 'name slug')
      .exec();

    if (!app) {
      throw new NotFoundException('App not found');
    }

    return app;
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
      .populate('createdBy', 'name email')
      .populate('organizationId', 'name slug')
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

  async getTimelineApps(limit = 20, offset = 0): Promise<{ apps: App[]; total: number }> {
    const query = {
      status: 'published',
      visibility: 'public',
    };

    const [apps, total] = await Promise.all([
      this.appModel
        .find(query)
        .populate('createdBy', 'name email')
        .populate('organizationId', 'name slug')
        .sort({ releaseDate: -1, createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.appModel.countDocuments(query).exec(),
    ]);

    return { apps, total };
  }
}
