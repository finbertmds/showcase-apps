import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from '../../schemas/app.schema';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserValidationService } from '../../services/user-validation.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: App.name, schema: AppSchema },
    ]),
  ],
  providers: [UsersResolver, UsersService, UserValidationService],
  exports: [UsersService],
})
export class UsersModule {}
