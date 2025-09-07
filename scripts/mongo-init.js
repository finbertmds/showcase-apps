// MongoDB initialization script for Docker
// This script sets up the initial database and collections

// Switch to the showcase database
db = db.getSiblingDB('showcase');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'clerkId'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          description: 'Name is required'
        },
        clerkId: {
          bsonType: 'string',
          minLength: 1,
          description: 'Clerk ID is required'
        },
        role: {
          enum: ['admin', 'developer', 'viewer'],
          description: 'Role must be one of: admin, developer, viewer'
        }
      }
    }
  }
});

db.createCollection('organizations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug', 'ownerId'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          description: 'Organization name is required'
        },
        slug: {
          bsonType: 'string',
          pattern: '^[a-z0-9-]+$',
          description: 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
      }
    }
  }
});

db.createCollection('apps', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'slug', 'shortDesc', 'longDesc', 'organizationId', 'createdBy'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          description: 'App title is required'
        },
        slug: {
          bsonType: 'string',
          pattern: '^[a-z0-9-]+$',
          description: 'Slug must contain only lowercase letters, numbers, and hyphens'
        },
        status: {
          enum: ['draft', 'published', 'archived'],
          description: 'Status must be one of: draft, published, archived'
        },
        visibility: {
          enum: ['public', 'private', 'unlisted'],
          description: 'Visibility must be one of: public, private, unlisted'
        }
      }
    }
  }
});

db.createCollection('appversions');
db.createCollection('media');
db.createCollection('timelineevents');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ clerkId: 1 }, { unique: true });
db.users.createIndex({ organizationId: 1 });
db.users.createIndex({ role: 1 });

db.organizations.createIndex({ slug: 1 }, { unique: true });
db.organizations.createIndex({ name: 1 });
db.organizations.createIndex({ ownerId: 1 });

db.apps.createIndex({ slug: 1 }, { unique: true });
db.apps.createIndex({ organizationId: 1 });
db.apps.createIndex({ createdBy: 1 });
db.apps.createIndex({ status: 1 });
db.apps.createIndex({ visibility: 1 });
db.apps.createIndex({ platforms: 1 });
db.apps.createIndex({ tags: 1 });
db.apps.createIndex({ releaseDate: -1 });
db.apps.createIndex({ createdAt: -1 });
db.apps.createIndex({ viewCount: -1 });
db.apps.createIndex({ likeCount: -1 });

// Text search index for apps
db.apps.createIndex({
  title: 'text',
  shortDesc: 'text',
  longDesc: 'text',
  tags: 'text'
});

db.appversions.createIndex({ appId: 1, version: 1 }, { unique: true });
db.appversions.createIndex({ appId: 1, releasedAt: -1 });
db.appversions.createIndex({ isLatest: 1 });

db.media.createIndex({ appId: 1, type: 1 });
db.media.createIndex({ appId: 1, order: 1 });
db.media.createIndex({ uploadedBy: 1 });
db.media.createIndex({ isActive: 1 });

db.timelineevents.createIndex({ appId: 1, date: -1 });
db.timelineevents.createIndex({ appId: 1, type: 1 });
db.timelineevents.createIndex({ isPublic: 1 });
db.timelineevents.createIndex({ date: -1 });
db.timelineevents.createIndex({ createdBy: 1 });

// Insert sample data for development
if (process.env.NODE_ENV === 'development') {
  // Create sample organization
  const sampleOrg = db.organizations.insertOne({
    name: 'Showcase Team',
    slug: 'showcase-team',
    description: 'The team behind Showcase Apps',
    website: 'https://showcase-apps.com',
    isActive: true,
    ownerId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Create sample user
  const sampleUser = db.users.insertOne({
    email: 'admin@showcase-apps.com',
    name: 'Admin User',
    clerkId: 'sample-clerk-id',
    role: 'admin',
    organizationId: sampleOrg.insertedId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Create sample app
  const sampleApp = db.apps.insertOne({
    title: 'Sample App',
    slug: 'sample-app',
    shortDesc: 'A sample application to demonstrate the platform',
    longDesc: 'This is a comprehensive description of the sample application. It showcases all the features and capabilities of the Showcase Apps platform.',
    status: 'published',
    visibility: 'public',
    releaseDate: new Date(),
    platforms: ['web', 'ios', 'android'],
    languages: ['JavaScript', 'TypeScript', 'React'],
    tags: ['demo', 'sample', 'showcase'],
    organizationId: sampleOrg.insertedId,
    createdBy: sampleUser.insertedId,
    website: 'https://sample-app.com',
    repository: 'https://github.com/sample/sample-app',
    demoUrl: 'https://demo.sample-app.com',
    downloadUrl: 'https://download.sample-app.com',
    viewCount: 0,
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Create sample timeline event
  db.timelineevents.insertOne({
    appId: sampleApp.insertedId,
    title: 'Initial Release',
    description: 'First version of the sample app',
    type: 'release',
    date: new Date(),
    isPublic: true,
    version: '1.0.0',
    createdBy: sampleUser.insertedId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  print('Sample data inserted successfully');
}

print('Database initialization completed');
