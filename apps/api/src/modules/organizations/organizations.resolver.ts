import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrganizationDto } from '../../dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@Resolver(() => OrganizationDto)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query(() => [OrganizationDto], { name: 'organizations' })
  async findAll(): Promise<OrganizationDto[]> {
    return this.organizationsService.findAll();
  }

  @Query(() => OrganizationDto, { name: 'organization' })
  async findOne(@Args('id') id: string): Promise<OrganizationDto> {
    return this.organizationsService.findOne(id);
  }

  @Query(() => OrganizationDto, { name: 'organizationBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<OrganizationDto> {
    return this.organizationsService.findBySlug(slug);
  }
}
