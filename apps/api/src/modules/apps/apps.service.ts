import { Organization, OrganizationDocument } from '@/schemas/organization.schema';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppDto, CreateAppInput, UpdateAppInput } from '../../dto/app.dto';
import { AppLike, AppLikeDocument } from '../../schemas/app-like.schema';
import { AppView, AppViewDocument } from '../../schemas/app-view.schema';
import { App, AppDocument } from '../../schemas/app.schema';
import { Media, MediaDocument } from '../../schemas/media.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(App.name) private appModel: Model<AppDocument>,
    @InjectModel(AppLike.name) private appLikeModel: Model<AppLikeDocument>,
    @InjectModel(AppView.name) private appViewModel: Model<AppViewDocument>,
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
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
    userId?: string,
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

    // Populate user interactions
    const appsWithUserInteractions = await this.populateUserInteractions(appsWithDetails, userId);

    return { apps: appsWithUserInteractions, total };
  }

  async findPaginated(
    filters: any = {},
    limit: number,
    offset: number,
    userId?: string,
  ): Promise<{ apps: AppDto[]; total: number }> {
    const [apps, total] = await Promise.all([
      this.appModel
        .find(filters)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.appModel.countDocuments(filters).exec(),
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

        // Get logo URL from media
        let logoUrl = null;
        try {
          const logoMedia = await this.mediaModel.findOne({
            appId: app._id,
            type: 'LOGO',
            isActive: true
          }).exec();
          
          if (logoMedia) {
            // Try to get thumbnail first, fallback to original URL
            if (logoMedia.meta?.thumbnails) {
              const smallThumbnail = logoMedia.meta.thumbnails.find(t => t.size === 'small');
              if (smallThumbnail) {
                logoUrl = smallThumbnail.url;
              } else {
                logoUrl = logoMedia.url;
              }
            } else {
              logoUrl = logoMedia.url;
            }
          }
        } catch (error) {
          console.warn(`Failed to get logo for app ${app._id}:`, error.message);
        }

        return {
          ...app.toObject(),
          id: app._id.toString(),
          createdBy: app.createdBy.toString(),
          createdByUser: user,
          organizationId: app.organizationId?.toString(),
          organization: organization,
          logoUrl: logoUrl,
        };
      })
    );

    // Populate user interactions
    const appsWithUserInteractions = await this.populateUserInteractions(appsWithDetails, userId);

    return { apps: appsWithUserInteractions, total };
  }

  async findOne(id: string, userId?: string): Promise<AppDto> {
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

    const appWithDetails = {
      ...app.toObject(),
      id: app._id.toString(),
      createdBy: app.createdBy.toString(),
      createdByUser: user,
      organizationId: app.organizationId?.toString(),
      organization: organization,
    };

    // Populate user interactions
    const [appWithUserInteractions] = await this.populateUserInteractions([appWithDetails], userId);

    return appWithUserInteractions;
  }

  async findBySlug(slug: string, userId?: string): Promise<AppDto> {
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

    const appWithDetails = {
      ...app.toObject(),
      id: app._id.toString(),
      createdBy: app.createdBy.toString(),
      createdByUser: user,
      organizationId: app.organizationId?.toString(),
      organization: organization,
    };

    // Populate user interactions
    const [appWithUserInteractions] = await this.populateUserInteractions([appWithDetails], userId);

    return appWithUserInteractions;
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

  async incrementViewCount(id: string, userId: string): Promise<boolean> {
    const app = await this.appModel.findById(id).exec();
    if (!app) {
      throw new NotFoundException('App not found');
    }

    // Check if user has already viewed this app in app_views collection
    const existingView = await this.appViewModel.findOne({
      appId: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    }).exec();

    if (existingView) {
      return false; // Already viewed, no increment
    }

    // Create new view record and increment viewCount
    await Promise.all([
      this.appViewModel.create({
        appId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        viewedAt: new Date()
      }),
      this.appModel.findByIdAndUpdate(id, {
        $inc: { viewCount: 1 }
      }).exec()
    ]);

    return true; // Successfully incremented
  }

  async incrementLikeCount(id: string, userId: string): Promise<boolean> {
    const app = await this.appModel.findById(id).exec();
    if (!app) {
      throw new NotFoundException('App not found');
    }

    // Check if user has already liked this app in app_likes collection
    const existingLike = await this.appLikeModel.findOne({
      appId: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    }).exec();

    if (existingLike) {
      return false; // Already liked, no increment
    }

    // Create new like record and increment likeCount
    await Promise.all([
      this.appLikeModel.create({
        appId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        reaction: 'like'
      }),
      this.appModel.findByIdAndUpdate(id, {
        $inc: { likeCount: 1 }
      }).exec()
    ]);

    return true; // Successfully incremented
  }

  async hasUserLikedApp(appId: string, userId: string): Promise<boolean> {
    const like = await this.appLikeModel.findOne({
      appId: new Types.ObjectId(appId),
      userId: new Types.ObjectId(userId)
    }).exec();
    
    return !!like;
  }

  async hasUserViewedApp(appId: string, userId: string): Promise<boolean> {
    const view = await this.appViewModel.findOne({
      appId: new Types.ObjectId(appId),
      userId: new Types.ObjectId(userId)
    }).exec();
    
    return !!view;
  }

  async getUserLikedApps(userId: string): Promise<string[]> {
    const likes = await this.appLikeModel.find({
      userId: new Types.ObjectId(userId)
    }).select('appId').exec();
    return likes.map(like => like.appId.toString());
  }

  async getUserViewedApps(userId: string): Promise<string[]> {
    const views = await this.appViewModel.find({
      userId: new Types.ObjectId(userId)
    }).select('appId').exec();
    
    return views.map(view => view.appId.toString());
  }

  private async populateUserInteractions(apps: AppDto[], userId?: string): Promise<AppDto[]> {
    if (!userId) {
      // If no user, set userLiked and userViewed to false
      return apps.map(app => ({
        ...app,
        userLiked: false,
        userViewed: false
      }));
    }

    const appIds = apps.map(app => app.id);
    
    // Get user's likes and views for all apps in batch
    const [userLikes, userViews] = await Promise.all([
      this.appLikeModel.find({
        appId: { $in: appIds.map(id => new Types.ObjectId(id)) },
        userId: new Types.ObjectId(userId)
      }).select('appId').exec(),
      this.appViewModel.find({
        appId: { $in: appIds.map(id => new Types.ObjectId(id)) },
        userId: new Types.ObjectId(userId)
      }).select('appId').exec()
    ]);

    const likedAppIds = new Set(userLikes.map(like => like.appId.toString()));
    const viewedAppIds = new Set(userViews.map(view => view.appId.toString()));

    return apps.map(app => ({
      ...app,
      userLiked: likedAppIds.has(app.id),
      userViewed: viewedAppIds.has(app.id)
    }));
  }

  async getTimelineApps(limit = 20, offset = 0, userId?: string): Promise<{ apps: AppDto[]; total: number }> {
    const query = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
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

        // Get logo URL from media
        let logoUrl = null;
        try {
          const logoMedia = await this.mediaModel.findOne({
            appId: app._id,
            type: 'LOGO',
            isActive: true
          }).exec();
          
          if (logoMedia) {
            // Try to get thumbnail first, fallback to original URL
            if (logoMedia.meta?.thumbnails) {
              const smallThumbnail = logoMedia.meta.thumbnails.find(t => t.size === 'small');
              if (smallThumbnail) {
                logoUrl = smallThumbnail.url;
              } else {
                logoUrl = logoMedia.url;
              }
            } else {
              logoUrl = logoMedia.url;
            }
          }
        } catch (error) {
          console.warn(`Failed to get logo for app ${app._id}:`, error.message);
        }

        return {
          ...app.toObject(),
          id: app._id.toString(),
          createdBy: app.createdBy.toString(),
          createdByUser: user,
          organizationId: app.organizationId?.toString(),
          organization: organization,
          logoUrl: logoUrl,
        } as AppDto;
      })
    );

    // Populate user interactions
    const appsWithUserInteractions = await this.populateUserInteractions(appsWithDetails, userId);

    return { apps: appsWithUserInteractions, total };
  }
}
