# Showcase Apps - Web Frontend

Next.js frontend application for the Showcase Apps platform.

## Features

- **Timeline View**: Vertical timeline showing apps in chronological order
- **App Detail Pages**: Comprehensive app information with screenshots and timeline
- **Admin Dashboard**: Role-based admin interface for managing apps
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: SSR/SSG with proper meta tags and Open Graph
- **Authentication**: Clerk integration for user management
- **GraphQL Integration**: Apollo Client for API communication

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── admin/             # Admin dashboard pages
│   ├── apps/              # App detail pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── app/              # App-related components
│   ├── layout/           # Layout components
│   ├── timeline/         # Timeline components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── apollo-wrapper.tsx # Apollo Client setup
│   └── graphql/          # GraphQL queries and mutations
└── types/                # TypeScript type definitions
```

## Key Components

### Timeline Components
- `TimelineView`: Main timeline container with infinite scroll
- `TimelineItem`: Individual app item in timeline

### App Components
- `AppDetailView`: Complete app detail page
- `AppScreenshots`: Image gallery with navigation
- `AppTimeline`: App-specific timeline events
- `AppActions`: Download and demo buttons
- `AppInfo`: App metadata and details

### Admin Components
- `AdminDashboard`: Overview with statistics
- `AdminAppsList`: Apps management table
- `AdminAppForm`: Create/edit app form
- `AdminSidebar`: Navigation sidebar
- `AdminHeader`: Admin header with user info

## Features

### Public Pages
- **Home Page**: Timeline view of all published apps
- **App Detail**: Individual app pages with screenshots, timeline, and actions
- **SEO**: Dynamic meta tags, Open Graph, and Twitter cards

### Admin Pages
- **Dashboard**: Statistics and recent activity
- **Apps Management**: CRUD operations for apps
- **User Management**: User roles and permissions (planned)
- **Analytics**: App performance metrics (planned)

### Authentication
- **Clerk Integration**: OAuth providers and user management
- **Role-based Access**: Admin, Developer, and Viewer roles
- **Protected Routes**: Admin pages require authentication

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable component classes
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ready for dark mode implementation

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (configured)
- **Husky**: Git hooks for quality checks (planned)

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build image
docker build -t showcase-web .

# Run container
docker run -p 3000:3000 --env-file .env.local showcase-web
```

### Environment Variables for Production
- `NEXT_PUBLIC_API_URL`: Your API endpoint
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key

## Performance

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Apollo Client caching and Next.js caching
- **SEO**: Server-side rendering for better SEO

## Future Enhancements

- [ ] Dark mode support
- [ ] Advanced search and filtering
- [ ] App categories and collections
- [ ] User favorites and bookmarks
- [ ] Social sharing features
- [ ] Progressive Web App (PWA) support
- [ ] Internationalization (i18n)
- [ ] Advanced analytics dashboard
- [ ] Bulk operations in admin
- [ ] App version management
