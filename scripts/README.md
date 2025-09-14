# Sample Data Management Scripts

This directory contains scripts for managing sample data in the Showcase Apps database.

## Available Scripts

### 1. Insert Sample Data
```bash
# Insert sample data (10 users, 10 organizations, 10 apps)
npm run insert-sample
# or
node insert-sample-data.js
```

### 2. Delete Sample Data (Recommended)
```bash
# Delete only sample data (preserves real user data)
npm run delete-sample
# or
node delete-sample-data.js sample
```

### 3. Delete All Data (Dangerous!)
```bash
# Delete ALL data from database (use with caution!)
npm run delete-all
# or
node delete-sample-data.js all --confirm
```

## Sample Data Details

### Users Created
- **Admin users**: john.doe@techcorp.com, admin@showcase.com
- **Developer users**: jane.smith@innovatelab.io, mike.johnson@dataflow.com, david.brown@mobilefirst.app, alex.martinez@devtools.co, olivia.anderson@techstart.io
- **Editor users**: sarah.wilson@cloudtech.com, emma.davis@startupx.io
- **Demo user**: demo@showcase.com

### Organizations Created
- TechCorp Solutions, InnovateLab, DataFlow Systems, CloudTech, MobileFirst, StartupX, DevTools, TechStart

### Apps Created
- 10 sample apps with various platforms, categories, and relationships

## Safety Features

### Pattern-Based Deletion
The `delete-sample` command only deletes data with specific email patterns, preserving any real user data you may have added.

### Confirmation Required
The `delete-all` command requires explicit confirmation with `--confirm` flag to prevent accidental deletion.

### Cascade Deletion
Both deletion methods properly handle foreign key relationships:
1. Delete apps first (createdBy references)
2. Delete organizations (ownerId references)
3. Delete users last

## Database Connection

The scripts connect to MongoDB using:
- **URI**: `mongodb://admin:password@localhost:27017/showcase?authSource=admin`
- **Database**: `showcase`
- **Collections**: `users`, `organizations`, `apps`

## Usage Examples

### Development Workflow
```bash
# 1. Insert sample data for testing
npm run insert-sample

# 2. Test your application with sample data

# 3. Clean up sample data when done
npm run delete-sample
```

### Production Reset
```bash
# ⚠️ WARNING: This deletes ALL data!
npm run delete-all
```

### Manual Commands
```bash
# Show help
node delete-sample-data.js

# Delete only sample data
node delete-sample-data.js sample

# Delete all data (requires confirmation)
node delete-sample-data.js all --confirm
```

## Error Handling

All scripts include comprehensive error handling:
- Connection failures
- Database operation errors
- Graceful cleanup on exit
- Detailed error messages and stack traces

## Logging

Scripts provide detailed logging:
- ✅ Success operations
- ❌ Error conditions
- 📊 Summary statistics
- 🔌 Connection status
- 🗑️ Deletion progress

## Requirements

- Node.js
- MongoDB running on localhost:27017
- Database user: `admin` with password: `password`
- Database: `showcase` with collections: `users`, `organizations`, `apps`

## Dependencies

- `mongodb`: MongoDB driver
- `bcryptjs`: Password hashing
- `node-fetch`: HTTP requests (if needed)

## Security Notes

- Scripts use hardcoded credentials for development
- In production, use environment variables for database credentials
- Always backup your data before running deletion scripts
- The `delete-all` command is irreversible
