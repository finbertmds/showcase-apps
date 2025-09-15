import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLike, AppLikeSchema } from '../../schemas/app-like.schema';
import { AppView, AppViewSchema } from '../../schemas/app-view.schema';
import { App, AppSchema } from '../../schemas/app.schema';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { AppsResolver } from './apps.resolver';
import { AppsService } from './apps.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: App.name, schema: AppSchema },
      { name: AppLike.name, schema: AppLikeSchema },
      { name: AppView.name, schema: AppViewSchema },
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [AppsResolver, AppsService],
  exports: [AppsService],
})
export class AppsModule {}
