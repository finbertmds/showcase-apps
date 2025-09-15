import { registerAs } from '@nestjs/config';
import algoliasearch, { SearchClient } from 'algoliasearch';

export const algoliaConfig = registerAs('algolia', () => ({
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: process.env.ALGOLIA_INDEX_NAME || 'showcase-apps',
}));

export const createAlgoliaClient = (): SearchClient => {
  const config = algoliaConfig();
  
  if (!config.appId || !config.apiKey) {
    console.warn('Algolia configuration missing. Search functionality will be limited.');
    return null;
  }

  return algoliasearch(config.appId, config.apiKey);
};
