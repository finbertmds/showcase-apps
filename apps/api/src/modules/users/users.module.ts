import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../../schemas/organization.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { ValidationService } from '../../services/validation.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [UsersResolver, UsersService, ValidationService],
  exports: [UsersService],
})
export class UsersModule {}
