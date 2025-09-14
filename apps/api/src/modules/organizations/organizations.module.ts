import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from '../../schemas/app.schema';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { OrganizationValidationService } from '../../services/organization-validation.service';
import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
      { name: App.name, schema: AppSchema },
    ]),
  ],
  providers: [OrganizationsResolver, OrganizationsService, OrganizationValidationService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
