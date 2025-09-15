#!/usr/bin/env node

/**
 * Script to drop all collections in the database
 * WARNING: This will permanently delete ALL data and collections from the database!
 */

const { dropAllCollections } = require('./insert-sample-data');

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🚨 DROP ALL COLLECTIONS TOOL');
  console.log('============================\n');
  
  console.log('⚠️  WARNING: This will DROP ALL COLLECTIONS from the database!');
  console.log('   This will permanently delete:');
  console.log('   - All data in all collections');
  console.log('   - All collection structures');
  console.log('   - All indexes and constraints');
  console.log('   This action cannot be undone!\n');
  
  if (args[0] !== '--confirm') {
    console.log('❌ To confirm dropping ALL collections, run:');
    console.log('   node drop-all-collections.js --confirm');
    console.log('\n💡 Alternative commands:');
    console.log('   node delete-sample-data.js sample     (delete only sample data)');
    console.log('   node delete-sample-data.js all --confirm (delete all data but keep collections)');
    console.log('   node delete-sample-data.js drop --confirm (same as this script)');
    console.log('\n🚨 Always backup your data before running this command!');
    return;
  }
  
  try {
    await dropAllCollections();
    console.log('\n✅ All collections have been dropped successfully!');
    console.log('💡 You can now run "node insert-sample-data.js" to create fresh sample data.');
  } catch (error) {
    console.error('\n❌ Failed to drop collections:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { main };
