import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrganizationDto } from '../../dto/organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';

@Resolver(() => OrganizationDto)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query(() => [OrganizationDto], { name: 'organizations' })
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<OrganizationDto[]> {
    return this.organizationsService.findAll() as any;
  }

  @Query(() => OrganizationDto, { name: 'organization' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id') id: string): Promise<OrganizationDto> {
    return this.organizationsService.findOne(id) as any;
  }

  @Query(() => OrganizationDto, { name: 'organizationBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<OrganizationDto> {
    return this.organizationsService.findBySlug(slug) as any;
  }
}
