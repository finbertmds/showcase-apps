import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationInput, OrganizationDto, UpdateOrganizationInput } from '../../dto/organization.dto';
import { ValidationExceptionFilter } from '../../filters/validation-exception.filter';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
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

  @Mutation(() => OrganizationDto, { name: 'createOrganization' })
  @UseGuards(JwtAuthGuard)
  @UseFilters(ValidationExceptionFilter)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
    @CurrentUser() user: any
  ): Promise<OrganizationDto> {
    return this.organizationsService.create(input, user.id) as any;
  }

  @Mutation(() => OrganizationDto, { name: 'updateOrganization' })
  @UseGuards(JwtAuthGuard)
  @UseFilters(ValidationExceptionFilter)
  async updateOrganization(
    @Args('id') id: string,
    @Args('input') input: UpdateOrganizationInput
  ): Promise<OrganizationDto> {
    return this.organizationsService.update(id, input) as any;
  }

  @Mutation(() => Boolean, { name: 'removeOrganization' })
  @UseGuards(JwtAuthGuard)
  async removeOrganization(@Args('id') id: string): Promise<boolean> {
    return this.organizationsService.remove(id);
  }
}
