import { Injectable, OnModuleInit } from '@nestjs/common';
import { getAlgoliaIndex } from '../config/algolia.config';
import { App } from '../schemas/app.schema';

@Injectable()
export class AlgoliaService implements OnModuleInit {
  private index: any;

  async onModuleInit() {
    this.index = getAlgoliaIndex();
    
    if (this.index) {
      // Configure index settings
      await this.index.setSettings({
        searchableAttributes: [
          'title',
          'shortDesc',
          'longDesc',
          'tags',
          'platforms',
          'languages',
        ],
        attributesForFaceting: [
          'searchable(platforms)',
          'searchable(tags)',
          'searchable(languages)',
          'searchable(status)',
          'searchable(visibility)',
        ],
        customRanking: [
          'desc(viewCount)',
          'desc(likeCount)',
          'desc(createdAt)',
        ],
        hitsPerPage: 20,
        maxValuesPerFacet: 100,
      });
    }
  }

  async indexApp(app: App): Promise<void> {
    if (!this.index) return;

    try {
      const algoliaObject = {
        objectID: app._id.toString(),
        title: app.title,
        slug: app.slug,
        shortDesc: app.shortDesc,
        longDesc: app.longDesc,
        status: app.status,
        visibility: app.visibility,
        platforms: app.platforms,
        languages: app.languages,
        tags: app.tags,
        viewCount: app.viewCount,
        likeCount: app.likeCount,
        createdAt: app.createdAt.getTime(),
        releaseDate: app.releaseDate?.getTime(),
        organizationId: app.organizationId.toString(),
        createdBy: app.createdBy.toString(),
      };

      await this.index.saveObject(algoliaObject);
    } catch (error) {
      console.error('Error indexing app to Algolia:', error);
    }
  }

  async updateApp(app: App): Promise<void> {
    await this.indexApp(app);
  }

  async deleteApp(appId: string): Promise<void> {
    if (!this.index) return;

    try {
      await this.index.deleteObject(appId);
    } catch (error) {
      console.error('Error deleting app from Algolia:', error);
    }
  }

  async searchApps(query: string, filters: any = {}): Promise<any> {
    if (!this.index) {
      throw new Error('Algolia not configured');
    }

    try {
      const searchParams: any = {
        query,
        hitsPerPage: filters.limit || 20,
        page: filters.offset ? Math.floor(filters.offset / (filters.limit || 20)) : 0,
      };

      // Add filters
      if (filters.platforms && filters.platforms.length > 0) {
        searchParams.facetFilters = [
          ...(searchParams.facetFilters || []),
          `platforms:${filters.platforms.join(',platforms:')}`,
        ];
      }

      if (filters.tags && filters.tags.length > 0) {
        searchParams.facetFilters = [
          ...(searchParams.facetFilters || []),
          `tags:${filters.tags.join(',tags:')}`,
        ];
      }

      if (filters.status) {
        searchParams.facetFilters = [
          ...(searchParams.facetFilters || []),
          `status:${filters.status}`,
        ];
      }

      if (filters.visibility) {
        searchParams.facetFilters = [
          ...(searchParams.facetFilters || []),
          `visibility:${filters.visibility}`,
        ];
      }

      const result = await this.index.search(searchParams);
      return result;
    } catch (error) {
      console.error('Error searching apps in Algolia:', error);
      throw error;
    }
  }

  async getFacets(): Promise<any> {
    if (!this.index) {
      throw new Error('Algolia not configured');
    }

    try {
      const result = await this.index.search('', {
        facets: ['platforms', 'tags', 'languages', 'status', 'visibility'],
        hitsPerPage: 0,
      });

      return result.facets;
    } catch (error) {
      console.error('Error getting facets from Algolia:', error);
      throw error;
    }
  }
}
