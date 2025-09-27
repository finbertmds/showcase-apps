import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from '../../schemas/app.schema';
import { Enum, EnumSchema } from '../../schemas/enum.schema';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { EnumResolver } from './enum.resolver';
import { EnumService } from './enum.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enum.name, schema: EnumSchema },
      { name: App.name, schema: AppSchema },
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [EnumService, EnumResolver],
  exports: [EnumService],
})
export class EnumModule {}
