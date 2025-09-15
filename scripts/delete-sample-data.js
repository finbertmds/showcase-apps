#!/usr/bin/env node

/**
 * Script to delete sample data from MongoDB
 * Provides two options: delete all data or delete only sample data by pattern
 */

const { deleteSampleData, deleteSampleDataByPattern, dropAllCollections } = require('./insert-sample-data');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🗑️  Sample Data Deletion Tool');
  console.log('================================\n');
  
  switch (command) {
    case 'all':
      console.log('⚠️  WARNING: This will delete ALL data from the database!');
      console.log('   This includes all users, organizations, and apps.');
      console.log('   This action cannot be undone.\n');
      
      if (args[1] !== '--confirm') {
        console.log('❌ To confirm deletion of ALL data, run:');
        console.log('   node delete-sample-data.js all --confirm');
        console.log('\n💡 For safer deletion of only sample data, run:');
        console.log('   node delete-sample-data.js sample');
        return;
      }
      
      await deleteSampleData();
      break;
      
    case 'drop':
      console.log('🚨 DANGER: This will DROP ALL COLLECTIONS from the database!');
      console.log('   This will permanently delete the entire database structure.');
      console.log('   This action cannot be undone.\n');
      
      if (args[1] !== '--confirm') {
        console.log('❌ To confirm dropping ALL collections, run:');
        console.log('   node delete-sample-data.js drop --confirm');
        console.log('\n💡 For safer deletion of only data, run:');
        console.log('   node delete-sample-data.js all --confirm');
        return;
      }
      
      await dropAllCollections();
      break;
      
    case 'sample':
      console.log('ℹ️  This will delete only sample data (users with specific email patterns).');
      console.log('   Real user data will be preserved.\n');
      await deleteSampleDataByPattern();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node delete-sample-data.js <command> [options]');
      console.log('');
      console.log('Commands:');
      console.log('  sample                    Delete only sample data (recommended)');
      console.log('  all --confirm            Delete ALL data (dangerous!)');
      console.log('  drop --confirm           Drop ALL collections (extremely dangerous!)');
      console.log('');
      console.log('Examples:');
      console.log('  node delete-sample-data.js sample');
      console.log('  node delete-sample-data.js all --confirm');
      console.log('  node delete-sample-data.js drop --confirm');
      console.log('');
      console.log('⚠️  Always backup your data before running deletion commands!');
      console.log('🚨 DROP command will permanently delete the entire database structure!');
      break;
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
