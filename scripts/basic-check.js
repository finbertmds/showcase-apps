#!/usr/bin/env node

/**
 * Basic check script to verify sample data
 */

const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = 'mongodb://admin:password@localhost:27017/showcase?authSource=admin';

// Main function
async function main() {
  console.log('🔍 Basic data check...\n');
  
  let client;
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // List collections
    console.log('\n📁 Collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n✅ Basic check completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
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
