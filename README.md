# Showcase Apps - Full Stack Application

A modern showcase platform for displaying apps with timeline view, admin management, and mobile support.

## Architecture

- **Frontend**: Next.js + Tailwind CSS with SSR/SSG
- **Admin UI**: Integrated Next.js admin panel with role-based auth
- **Mobile**: React Native app
- **Backend**: NestJS + GraphQL + TypeScript
- **Database**: MongoDB
- **File Storage**: S3-compatible storage
- **Search**: Algolia integration
- **Auth**: Clerk for OAuth + role-based access
- **Queue**: BullMQ for background jobs
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + healthchecks

## Project Structure

```
showcase-apps/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── mobile/              # React Native app
│   └── api/                 # NestJS backend
├── packages/
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared UI components
├── docker-compose.yml       # Local development setup
├── .github/                 # GitHub Actions workflows
└── docs/                    # Documentation
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development environment**:
   ```bash
   docker-compose up -d
   npm run dev
   ```

3. **Access applications**:
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - API: http://localhost:4000/graphql
   - Mobile: Run with React Native CLI

## Features

- ✅ Public timeline view of apps
- ✅ App detail pages with screenshots
- ✅ Admin CRUD interface
- ✅ Role-based authentication
- ✅ Multi-platform support
- ✅ Media upload and management
- ✅ Search and filtering
- ✅ Mobile app integration

## Development

See individual app READMEs for specific setup instructions:
- [Web App](./apps/web/README.md)
- [Mobile App](./apps/mobile/README.md)
- [API](./apps/api/README.md)
