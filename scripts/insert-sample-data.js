#!/usr/bin/env node

/**
 * Script to insert sample data directly into MongoDB
 * Creates 10 users, 10 organizations, and 10 apps with proper relationships
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = 'mongodb://admin:password@localhost:27017/showcase?authSource=admin';

// Sample data
const sampleUsers = [
  {
    email: 'john.doe@techcorp.com',
    name: 'John Doe',
    username: 'johndoe',
    password: 'password123',
    role: 'ADMIN',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    email: 'jane.smith@innovatelab.io',
    name: 'Jane Smith',
    username: 'janesmith',
    password: 'password123',
    role: 'DEVELOPER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
  },
  {
    email: 'mike.johnson@dataflow.com',
    name: 'Mike Johnson',
    username: 'mikejohnson',
    password: 'password123',
    role: 'DEVELOPER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  },
  {
    email: 'sarah.wilson@cloudtech.com',
    name: 'Sarah Wilson',
    username: 'sarahwilson',
    password: 'password123',
    role: 'VIEWER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    email: 'david.brown@mobilefirst.app',
    name: 'David Brown',
    username: 'davidbrown',
    password: 'password123',
    role: 'DEVELOPER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
  {
    email: 'lisa.garcia@aidynamics.com',
    name: 'Lisa Garcia',
    username: 'lisagarcia',
    password: 'password123',
    role: 'ADMIN',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
  },
  {
    email: 'alex.martinez@devtools.co',
    name: 'Alex Martinez',
    username: 'alexmartinez',
    password: 'password123',
    role: 'DEVELOPER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
  {
    email: 'emma.davis@startupx.io',
    name: 'Emma Davis',
    username: 'emmadavis',
    password: 'password123',
    role: 'VIEWER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
  },
  {
    email: 'ryan.taylor@enterprise.com',
    name: 'Ryan Taylor',
    username: 'ryantaylor',
    password: 'password123',
    role: 'ADMIN',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan',
  },
  {
    email: 'olivia.anderson@techstart.io',
    name: 'Olivia Anderson',
    username: 'oliviaanderson',
    password: 'password123',
    role: 'DEVELOPER',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
  },
  {
    email: 'test@example.com',
    name: 'Admin',
    username: 'admin',
    password: 'password123',
    role: 'ADMIN',
    isActive: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
];

const sampleOrganizations = [
  {
    name: 'TechCorp Solutions',
    slug: 'techcorp-solutions',
    description: 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.',
    website: 'https://techcorp.com',
    logo: 'https://img.logo.dev/techcorp.com?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'InnovateLab',
    slug: 'innovatelab',
    description: 'Innovation laboratory for cutting-edge products and breakthrough technologies.',
    website: 'https://innovatelab.io',
    logo: 'https://img.logo.dev/innovatelab.io?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'DataFlow Systems',
    slug: 'dataflow-systems',
    description: 'Data processing and analytics company focused on big data solutions.',
    website: 'https://dataflow.com',
    logo: 'https://img.logo.dev/dataflow.com?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'CloudTech Inc',
    slug: 'cloudtech-inc',
    description: 'Cloud infrastructure and services provider for modern applications.',
    website: 'https://cloudtech.com',
    logo: 'https://img.logo.dev/cloudtech.com?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'MobileFirst',
    slug: 'mobilefirst',
    description: 'Mobile application development company creating innovative mobile solutions.',
    website: 'https://mobilefirst.app',
    logo: 'https://img.logo.dev/mobilefirst.app?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'AI Dynamics',
    slug: 'ai-dynamics',
    description: 'Artificial intelligence and machine learning solutions for businesses.',
    website: 'https://aidynamics.com',
    logo: 'https://img.logo.dev/aidynamics.com?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'DevTools Co',
    slug: 'devtools-co',
    description: 'Developer tools and productivity software for modern development teams.',
    website: 'https://devtools.co',
    logo: 'https://img.logo.dev/devtools.co?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'StartupX',
    slug: 'startupx',
    description: 'Startup accelerator and venture capital firm supporting innovative ideas.',
    website: 'https://startupx.io',
    logo: 'https://img.logo.dev/startupx.io?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'Enterprise Solutions',
    slug: 'enterprise-solutions',
    description: 'Enterprise-grade software solutions for large organizations.',
    website: 'https://enterprise.com',
    logo: 'https://img.logo.dev/enterprise.com?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
  {
    name: 'TechStart',
    slug: 'techstart',
    description: 'Technology startup incubator and innovation hub.',
    website: 'https://techstart.io',
    logo: 'https://img.logo.dev/techstart.io?token=pk_NjXq50oIR86YA2iWg3LJMw&retina=true',
    isActive: true,
  },
];

const sampleApps = [
  {
    title: 'ProjectManager Pro',
    slug: 'projectmanager-pro',
    shortDesc: 'Advanced project management tool for teams',
    longDesc: 'A comprehensive project management solution that helps teams organize, track, and deliver projects on time. Features include task management, team collaboration, time tracking, and detailed reporting.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-01-15'),
    platforms: ['WEB', 'DESKTOP'],
    languages: ['JavaScript', 'TypeScript', 'React'],
    tags: ['productivity', 'project-management', 'collaboration'],
    website: 'https://projectmanager-pro.com',
    repository: 'https://github.com/techcorp/projectmanager-pro',
    demoUrl: 'https://demo.projectmanager-pro.com',
    downloadUrl: 'https://download.projectmanager-pro.com',
    viewCount: 1250,
    likeCount: 89,
  },
  {
    title: 'DataViz Studio',
    slug: 'dataviz-studio',
    shortDesc: 'Interactive data visualization platform',
    longDesc: 'Create stunning interactive charts, graphs, and dashboards from your data. Supports multiple data sources, real-time updates, and customizable visualizations for business intelligence.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-02-20'),
    platforms: ['WEB', 'DESKTOP'],
    languages: ['Python', 'JavaScript', 'D3.js'],
    tags: ['data-visualization', 'analytics', 'business-intelligence'],
    website: 'https://dataviz-studio.io',
    repository: 'https://github.com/innovatelab/dataviz-studio',
    demoUrl: 'https://demo.dataviz-studio.io',
    viewCount: 2100,
    likeCount: 156,
  },
  {
    title: 'CloudSync Manager',
    slug: 'cloudsync-manager',
    shortDesc: 'Multi-cloud file synchronization tool',
    longDesc: 'Seamlessly sync files across multiple cloud providers including AWS S3, Google Drive, Dropbox, and OneDrive. Features automatic backup, version control, and conflict resolution.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-03-10'),
    platforms: ['DESKTOP', 'MOBILE'],
    languages: ['Go', 'React Native', 'TypeScript'],
    tags: ['cloud-storage', 'file-sync', 'backup'],
    website: 'https://cloudsync-manager.com',
    repository: 'https://github.com/dataflow/cloudsync-manager',
    downloadUrl: 'https://download.cloudsync-manager.com',
    viewCount: 890,
    likeCount: 67,
  },
  {
    title: 'AI Chat Assistant',
    slug: 'ai-chat-assistant',
    shortDesc: 'Intelligent chatbot with natural language processing',
    longDesc: 'Advanced AI-powered chatbot that can understand context, provide intelligent responses, and integrate with various business systems. Supports multiple languages and custom training.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-04-05'),
    platforms: ['WEB', 'MOBILE'],
    languages: ['Python', 'JavaScript', 'TensorFlow'],
    tags: ['ai', 'chatbot', 'nlp', 'automation'],
    website: 'https://ai-chat-assistant.com',
    repository: 'https://github.com/cloudtech/ai-chat-assistant',
    demoUrl: 'https://demo.ai-chat-assistant.com',
    viewCount: 3200,
    likeCount: 234,
  },
  {
    title: 'Mobile Task Tracker',
    slug: 'mobile-task-tracker',
    shortDesc: 'Simple and intuitive task management app',
    longDesc: 'Clean and simple task management app designed for mobile users. Features include quick task creation, due date reminders, priority levels, and offline synchronization.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-05-12'),
    platforms: ['MOBILE'],
    languages: ['React Native', 'TypeScript'],
    tags: ['mobile', 'task-management', 'productivity'],
    appStoreUrl: 'https://apps.apple.com/app/mobile-task-tracker',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mobilefirst.tasktracker',
    viewCount: 1500,
    likeCount: 112,
  },
  {
    title: 'ML Model Builder',
    slug: 'ml-model-builder',
    shortDesc: 'No-code machine learning model creation tool',
    longDesc: 'Drag-and-drop interface for creating machine learning models without coding. Supports various algorithms, data preprocessing, model training, and deployment to cloud platforms.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-06-18'),
    platforms: ['WEB'],
    languages: ['Python', 'JavaScript', 'TensorFlow'],
    tags: ['machine-learning', 'no-code', 'ai', 'data-science'],
    website: 'https://ml-model-builder.com',
    repository: 'https://github.com/aidynamics/ml-model-builder',
    demoUrl: 'https://demo.ml-model-builder.com',
    viewCount: 2800,
    likeCount: 198,
  },
  {
    title: 'Code Review Assistant',
    slug: 'code-review-assistant',
    shortDesc: 'Automated code review and quality analysis tool',
    longDesc: 'AI-powered code review tool that analyzes code quality, suggests improvements, detects bugs, and enforces coding standards. Integrates with popular version control systems.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-07-25'),
    platforms: ['WEB', 'DESKTOP'],
    languages: ['TypeScript', 'Python', 'Go'],
    tags: ['code-review', 'quality-assurance', 'developer-tools'],
    website: 'https://code-review-assistant.com',
    repository: 'https://github.com/devtools/code-review-assistant',
    demoUrl: 'https://demo.code-review-assistant.com',
    viewCount: 1900,
    likeCount: 145,
  },
  {
    title: 'Startup Dashboard',
    slug: 'startup-dashboard',
    shortDesc: 'Comprehensive startup metrics and analytics dashboard',
    longDesc: 'All-in-one dashboard for startups to track key metrics, user engagement, revenue, and growth. Features real-time analytics, custom reports, and investor-ready presentations.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-08-30'),
    platforms: ['WEB'],
    languages: ['React', 'Node.js', 'PostgreSQL'],
    tags: ['startup', 'analytics', 'metrics', 'dashboard'],
    website: 'https://startup-dashboard.io',
    repository: 'https://github.com/startupx/startup-dashboard',
    demoUrl: 'https://demo.startup-dashboard.io',
    viewCount: 1100,
    likeCount: 78,
  },
  {
    title: 'Enterprise Security Suite',
    slug: 'enterprise-security-suite',
    shortDesc: 'Comprehensive enterprise security and compliance platform',
    longDesc: 'Enterprise-grade security platform providing threat detection, compliance monitoring, access control, and security analytics. Designed for large organizations with complex security requirements.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-09-15'),
    platforms: ['WEB', 'DESKTOP'],
    languages: ['Java', 'React', 'Spring Boot'],
    tags: ['security', 'enterprise', 'compliance', 'monitoring'],
    website: 'https://enterprise-security-suite.com',
    repository: 'https://github.com/enterprise/security-suite',
    viewCount: 750,
    likeCount: 45,
  },
  {
    title: 'TechStart Hub',
    slug: 'techstart-hub',
    shortDesc: 'Innovation platform for tech startups and entrepreneurs',
    longDesc: 'Platform connecting tech startups with investors, mentors, and resources. Features include startup profiles, funding opportunities, mentorship matching, and resource sharing.',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    releaseDate: new Date('2024-10-22'),
    platforms: ['WEB', 'MOBILE'],
    languages: ['Vue.js', 'Node.js', 'MongoDB'],
    tags: ['startup', 'networking', 'funding', 'mentorship'],
    website: 'https://techstart-hub.io',
    repository: 'https://github.com/techstart/hub',
    demoUrl: 'https://demo.techstart-hub.io',
    viewCount: 1650,
    likeCount: 123,
  },
];

// Hash password function
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Insert users
async function insertUsers(db) {
  console.log('👥 Creating users...');
  const usersCollection = db.collection('users');
  
  const users = [];
  for (const userData of sampleUsers) {
    const hashedPassword = await hashPassword(userData.password);
    const user = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
  }
  
  const result = await usersCollection.insertMany(users);
  console.log(`✅ Created ${result.insertedCount} users`);
  return users;
}

// Insert organizations
async function insertOrganizations(db, users) {
  console.log('🏢 Creating organizations...');
  const organizationsCollection = db.collection('organizations');
  
  const organizations = [];
  for (let i = 0; i < sampleOrganizations.length; i++) {
    const orgData = sampleOrganizations[i];
    const owner = users[i]; // Assign each user as owner of an organization
    
    const organization = {
      ...orgData,
      ownerId: owner._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    organizations.push(organization);
  }
  
  const result = await organizationsCollection.insertMany(organizations);
  console.log(`✅ Created ${result.insertedCount} organizations`);
  return organizations;
}

// Insert apps
async function insertApps(db, users, organizations) {
  console.log('📱 Creating apps...');
  const appsCollection = db.collection('apps');
  
  const apps = [];
  for (let i = 0; i < sampleApps.length; i++) {
    const appData = sampleApps[i];
    const creator = users[i];
    const organization = organizations[i];
    
    const app = {
      ...appData,
      createdBy: creator._id,
      organizationId: organization._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    apps.push(app);
  }
  
  const result = await appsCollection.insertMany(apps);
  console.log(`✅ Created ${result.insertedCount} apps`);
  return apps;
}

// Update users with organization references
async function updateUsersWithOrganizations(db, users, organizations) {
  console.log('🔗 Linking users to organizations...');
  const usersCollection = db.collection('users');
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (organizations[i] && user) {
      const organization = organizations[i];
      
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            organizationId: organization._id,
            updatedAt: new Date()
          }
        }
      );
    }
  }
  
  console.log('✅ Updated users with organization references');
}

// Main function
async function main() {
  console.log('🚀 Starting sample data insertion...\n');
  
  let client;
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data (optional - uncomment if you want to start fresh)
    // console.log('🧹 Clearing existing data...');
    // await db.collection('users').deleteMany({});
    // await db.collection('organizations').deleteMany({});
    // await db.collection('apps').deleteMany({});
    // console.log('✅ Cleared existing data');
    
    // Insert data
    const users = await insertUsers(db);
    const organizations = await insertOrganizations(db, users);
    const apps = await insertApps(db, users, organizations);
    await updateUsersWithOrganizations(db, users, organizations);
    
    console.log('\n✅ Sample data insertion completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Organizations: ${organizations.length}`);
    console.log(`   - Apps: ${apps.length}`);
    
    console.log('\n🔐 Login credentials:');
    console.log('   All users have password: password123');
    console.log('   Admin users: john.doe@techcorp.com, lisa.garcia@aidynamics.com, ryan.taylor@enterprise.com');
    console.log('   Editor users: jane.smith@innovatelab.io, mike.johnson@dataflow.com, david.brown@mobilefirst.app, alex.martinez@devtools.co, olivia.anderson@techstart.io');
    console.log('   Viewer users: sarah.wilson@cloudtech.com, emma.davis@startupx.io');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the script
if (require.main === module) {
  main();
}

/**
 * Delete all sample data from the database
 */
async function deleteSampleData() {
  let client;
  
  try {
    console.log('🗑️  Starting to delete sample data...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('showcase');
    
    // Delete all apps first (due to foreign key constraints)
    const appsResult = await db.collection('apps').deleteMany({});
    console.log(`🗑️  Deleted ${appsResult.deletedCount} apps`);

    // Delete all app views, app likes
    const appViewsResult = await db.collection('appviews').deleteMany({});
    console.log(`🗑️  Deleted ${appViewsResult.deletedCount} app views`);
    const appLikesResult = await db.collection('applikes').deleteMany({});
    console.log(`🗑️  Deleted ${appLikesResult.deletedCount} app likes`);

    // Delete all media
    const mediaResult = await db.collection('media').deleteMany({});
    console.log(`🗑️  Deleted ${mediaResult.deletedCount} media`);

    // Delete all timeline events
    const timelineEventsResult = await db.collection('timelineevents').deleteMany({});
    console.log(`🗑️  Deleted ${timelineEventsResult.deletedCount} timeline events`);
    
    // Delete all organizations
    const orgsResult = await db.collection('organizations').deleteMany({});
    console.log(`🗑️  Deleted ${orgsResult.deletedCount} organizations`);

    // Delete all users
    const usersResult = await db.collection('users').deleteMany({});
    console.log(`🗑️  Deleted ${usersResult.deletedCount} users`);
    
    console.log('\n✅ Sample data deletion completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Apps deleted: ${appsResult.deletedCount}`);
    console.log(`   App views deleted: ${appViewsResult.deletedCount}`);
    console.log(`   App likes deleted: ${appLikesResult.deletedCount}`);
    console.log(`   Media deleted: ${mediaResult.deletedCount}`);
    console.log(`   Timeline events deleted: ${timelineEventsResult.deletedCount}`);
    console.log(`   Organizations deleted: ${orgsResult.deletedCount}`);
    console.log(`   Users deleted: ${usersResult.deletedCount}`);
    
  } catch (error) {
    console.error('❌ Error deleting sample data:', error.message);
    console.error(error.stack);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

/**
 * Delete specific sample data by email patterns
 */
async function deleteSampleDataByPattern() {
  let client;
  
  try {
    console.log('🗑️  Starting to delete sample data by pattern...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('showcase');
    
    // Define email patterns for sample data
    const sampleEmailPatterns = [
      'john.doe@techcorp.com',
      'jane.smith@innovatelab.io',
      'mike.johnson@dataflow.com',
      'sarah.wilson@cloudtech.com',
      'david.brown@mobilefirst.app',
      'emma.davis@startupx.io',
      'alex.martinez@devtools.co',
      'olivia.anderson@techstart.io',
      'admin@showcase.com',
      'demo@showcase.com'
    ];
    
    // Find users with sample email patterns
    const sampleUsers = await db.collection('users').find({
      email: { $in: sampleEmailPatterns }
    }).toArray();
    
    if (sampleUsers.length === 0) {
      console.log('ℹ️  No sample users found to delete');
      return;
    }
    
    const sampleUserIds = sampleUsers.map(user => user._id);
    const sampleOrgIds = sampleUsers
      .filter(user => user.organizationId)
      .map(user => user.organizationId);
    
    // Delete apps created by sample users
    const appsResult = await db.collection('apps').deleteMany({
      createdBy: { $in: sampleUserIds }
    });
    console.log(`🗑️  Deleted ${appsResult.deletedCount} apps created by sample users`);
    
    // Delete organizations owned by sample users
    const orgsResult = await db.collection('organizations').deleteMany({
      ownerId: { $in: sampleUserIds }
    });
    console.log(`🗑️  Deleted ${orgsResult.deletedCount} organizations owned by sample users`);
    
    // Delete sample users
    const usersResult = await db.collection('users').deleteMany({
      email: { $in: sampleEmailPatterns }
    });
    console.log(`🗑️  Deleted ${usersResult.deletedCount} sample users`);
    
    console.log('\n✅ Sample data deletion by pattern completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Apps deleted: ${appsResult.deletedCount}`);
    console.log(`   Organizations deleted: ${orgsResult.deletedCount}`);
    console.log(`   Users deleted: ${usersResult.deletedCount}`);
    
  } catch (error) {
    console.error('❌ Error deleting sample data by pattern:', error.message);
    console.error(error.stack);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

/**
 * Drop all collections in the database
 * WARNING: This will permanently delete ALL data from the database!
 */
async function dropAllCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('showcase');
    
    // Get all collection names
    const collections = await db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections to drop`);
    
    if (collections.length === 0) {
      console.log('ℹ️  No collections found in database');
      return;
    }
    
    // List all collections that will be dropped
    console.log('\n📝 Collections that will be dropped:');
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    // Drop each collection
    let droppedCount = 0;
    for (const collection of collections) {
      try {
        await db.collection(collection.name).drop();
        console.log(`✅ Dropped collection: ${collection.name}`);
        droppedCount++;
      } catch (error) {
        console.log(`⚠️  Failed to drop collection ${collection.name}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Successfully dropped ${droppedCount} out of ${collections.length} collections`);
    
  } catch (error) {
    console.error('❌ Error dropping collections:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

module.exports = { 
  insertUsers, 
  insertOrganizations, 
  insertApps, 
  deleteSampleData,
  deleteSampleDataByPattern,
  dropAllCollections,
  sampleUsers, 
  sampleOrganizations, 
  sampleApps 
};
