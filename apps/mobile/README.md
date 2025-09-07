# Showcase Apps - Mobile App

React Native mobile application for the Showcase Apps platform.

## Features

- **Timeline View**: Vertical timeline showing apps in chronological order
- **App Detail Pages**: Comprehensive app information with screenshots and timeline
- **Search & Filter**: Search apps by name, description, and filter by platform
- **Dark Mode**: Theme switching with persistent storage
- **Responsive Design**: Optimized for both iOS and Android
- **GraphQL Integration**: Apollo Client for API communication
- **Navigation**: Tab-based navigation with stack navigation

## Quick Start

### Prerequisites

- Node.js 16+
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **iOS Setup**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start Metro bundler**:
   ```bash
   npm start
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

5. **Run on Android**:
   ```bash
   npm run android
   ```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppCard.tsx      # App card component for lists
│   ├── AppScreenshots.tsx # Image gallery component
│   ├── AppTimeline.tsx  # Timeline events component
│   └── LoadingSpinner.tsx # Loading indicator
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Theme management
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation setup
├── screens/            # Screen components
│   ├── TimelineScreen.tsx # Main timeline view
│   ├── AppDetailScreen.tsx # App detail page
│   ├── SearchScreen.tsx # Search and filter
│   └── ProfileScreen.tsx # User profile
├── services/           # API and external services
│   ├── apollo.ts       # Apollo Client setup
│   └── queries.ts      # GraphQL queries
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── App.tsx             # Root component
```

## Key Features

### Timeline Screen
- Infinite scroll with pagination
- Pull-to-refresh functionality
- App cards with platform icons and stats
- Timeline indicators for visual flow

### App Detail Screen
- Full-screen image gallery with pagination
- Platform and tag information
- Action buttons for demo, download, etc.
- Timeline of app events and updates

### Search Screen
- Real-time search with debouncing
- Platform filtering
- Empty states and loading indicators

### Profile Screen
- Theme switching (light/dark mode)
- User authentication placeholder
- Settings and preferences

## Styling & Theming

The app uses a custom theme system with:
- Light and dark mode support
- Consistent color palette
- Responsive spacing and typography
- Platform-specific styling

### Theme Colors
- Primary: Blue (#3b82f6)
- Secondary: Gray (#6b7280)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

## Navigation

### Tab Navigation
- **Timeline**: Main app discovery
- **Search**: Find specific apps
- **Profile**: User settings and preferences

### Stack Navigation
- Timeline → App Detail
- Search → App Detail
- Profile → Settings (planned)

## API Integration

### GraphQL Queries
- `GET_TIMELINE_APPS`: Fetch apps for timeline
- `GET_APPS`: Search and filter apps
- `GET_APP_BY_SLUG`: Get specific app details
- `GET_MEDIA_BY_APP`: Fetch app screenshots
- `GET_TIMELINE_EVENTS_BY_APP`: Get app timeline

### Apollo Client Configuration
- Automatic token management
- Error handling and retry logic
- Cache management
- Offline support (planned)

## Development

### Available Scripts
- `npm start`: Start Metro bundler
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks (planned)

## Platform-Specific Features

### iOS
- Native navigation animations
- iOS-specific UI components
- App Store integration
- Push notifications (planned)

### Android
- Material Design components
- Android-specific navigation
- Google Play Store integration
- Android notifications (planned)

## Performance Optimizations

- **Image Optimization**: Lazy loading and caching
- **List Performance**: FlatList with optimized rendering
- **Memory Management**: Proper component cleanup
- **Bundle Size**: Code splitting and tree shaking

## Future Enhancements

- [ ] User authentication with Clerk
- [ ] Offline support with Apollo Cache
- [ ] Push notifications
- [ ] App favorites and bookmarks
- [ ] Social sharing
- [ ] In-app purchases
- [ ] Analytics integration
- [ ] Deep linking
- [ ] App shortcuts
- [ ] Widget support (iOS)

## Deployment

### iOS App Store
1. Configure app signing
2. Build release version
3. Upload to App Store Connect
4. Submit for review

### Google Play Store
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

### Environment Configuration
- Development: Local API endpoint
- Staging: Staging API endpoint
- Production: Production API endpoint

## Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build issues**: Clean and rebuild with `cd ios && xcodebuild clean`
3. **Android build issues**: Clean gradle with `cd android && ./gradlew clean`
4. **Dependency issues**: Delete node_modules and reinstall

### Debug Tools
- React Native Debugger
- Flipper
- Chrome DevTools
- Xcode/Android Studio debuggers
