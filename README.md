# AOI Creation - Satellite Imagery Map Application

A single-page application for displaying satellite/drone imagery with interactive map features, built with React, TypeScript, Vite, and Leaflet.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The application will be available at `http://localhost:3000`

## 📋 Table of Contents

- [Map Library Choice](#map-library-choice)
- [Architecture Decisions](#architecture-decisions)
- [Performance Considerations](#performance-considerations)
- [Testing Strategy](#testing-strategy)
- [Tradeoffs Made](#tradeoffs-made)
- [Production Readiness](#production-readiness)
- [Time Spent](#time-spent)

## 🗺️ Map Library Choice

### Why Leaflet?

I selected **Leaflet** as the map library for this project for several key reasons:

1. **WMS Support**: Leaflet has excellent built-in support for WMS (Web Map Service) layers through `react-leaflet`, which was essential for integrating the NRW satellite imagery service.

2. **Mature Ecosystem**: Leaflet is one of the most mature and widely-used open-source mapping libraries with extensive documentation, community support, and a rich plugin ecosystem (including `leaflet-draw` for drawing tools).

3. **Lightweight**: Compared to alternatives like Mapbox GL or Google Maps, Leaflet is significantly lighter (~38KB gzipped), which improves initial load times.

4. **React Integration**: `react-leaflet` provides excellent React hooks and components that integrate seamlessly with React's component lifecycle and state management.

5. **Flexibility**: Leaflet doesn't require API keys (unlike Google Maps or Mapbox), making it ideal for open-source projects and easier deployment.

6. **Drawing Tools**: The `leaflet-draw` plugin provides robust, battle-tested drawing functionality out of the box.

### Alternatives Considered

- **MapLibre GL JS**: Modern, performant, but more complex setup and larger bundle size. Better for 3D/WebGL features, but overkill for this 2D use case.

- **OpenLayers**: Very powerful and feature-rich, but has a steeper learning curve and more complex API. Better suited for enterprise GIS applications.

- **react-map-gl (Mapbox)**: Excellent performance and modern API, but requires API keys and has usage limits. Also heavier bundle size.

- **Google Maps React**: Easy to use but requires API keys, has usage costs, and less flexible for custom styling.

**Decision**: Leaflet provided the best balance of ease of use, WMS support, drawing capabilities, and bundle size for this application.

## 🏗️ Architecture Decisions

### State Management: Zustand

I chose **Zustand** for state management because:

- **Simplicity**: Minimal boilerplate compared to Redux
- **TypeScript Support**: Excellent type inference out of the box
- **Performance**: Lightweight and performant for client-side only state
- **No Context Issues**: Avoids React Context re-render problems
- **Persistence**: Easy integration with localStorage for feature persistence

The store (`src/store/mapStore.ts`) manages:
- Map center and zoom level
- Drawn features (markers, polylines, polygons)
- WMS layer visibility
- Drawing mode state
- Selected feature

### Component Structure

```
src/
├── components/
│   ├── MapContent.tsx        # Main map container with layers
│   ├── DrawingManager.tsx    # Handles leaflet-draw integration
│   ├── FeatureLayers.tsx     # Renders drawn features on map
│   ├── Sidebar.tsx           # Layer management and feature list
│   ├── SearchBar.tsx         # Geocoding search functionality
│   └── CustomControls.tsx    # Custom zoom and fullscreen controls
├── store/
│   └── mapStore.ts           # Zustand store for global state
├── utils/
│   └── debounce.ts           # Utility for debouncing search
└── App.tsx                   # Root component
```

### Separation of Concerns

- **Map Logic**: Isolated in `MapContent`, `DrawingManager`, and `FeatureLayers`
- **UI Components**: Sidebar, SearchBar, and CustomControls are pure UI components
- **State Management**: Centralized in Zustand store
- **Utilities**: Reusable functions like debounce are separated

### Design Patterns

1. **Container/Presentational Pattern**: Map components handle Leaflet integration, UI components handle presentation
2. **Custom Hooks**: Used `useMap` and `useMapEvents` from react-leaflet for map interactions
3. **Event-Driven**: Map events (draw, edit, delete) update Zustand store, which triggers re-renders

## ⚡ Performance Considerations

### Current Implementation

1. **Debounced Search**: Geocoding API calls are debounced (300ms) to reduce unnecessary requests
2. **Lazy Layer Loading**: WMS layer only renders when `wmsLayerVisible` is true
3. **Feature Persistence**: Features are stored in localStorage to avoid re-fetching
4. **Efficient Re-renders**: Zustand ensures only components using changed state re-render

### Future Scalability (1000s of Points/Polygons)

For handling thousands of features, I would implement:

1. **Clustering**: Use `leaflet.markercluster` to group nearby markers at lower zoom levels
   ```typescript
   // Example implementation
   import MarkerClusterGroup from 'react-leaflet-cluster'
   ```

2. **Virtual Scrolling for Feature List**: Only render visible items in the sidebar using `react-window` or `react-virtualized`

3. **Spatial Indexing**: Use R-tree or similar data structure for efficient spatial queries
   ```typescript
   // Use rbush for spatial indexing
   import RBush from 'rbush'
   ```

4. **Tile-Based Rendering**: For polygons, use vector tiles (MVT) instead of rendering individual features

5. **Web Workers**: Move heavy geometry calculations to Web Workers to avoid blocking the main thread

6. **Level of Detail (LOD)**: Simplify polygon geometries at lower zoom levels using algorithms like Douglas-Peucker

7. **Request Animation Frame**: Batch DOM updates using `requestAnimationFrame` for smooth rendering

8. **Feature Culling**: Only render features visible in the current viewport

9. **Lazy Loading**: Load features progressively as user pans/zooms

10. **Memory Management**: Implement feature pooling and cleanup for removed features

### Performance Monitoring

In production, I would add:
- Performance metrics using Web Vitals
- Map render time tracking
- Feature count monitoring
- Memory usage alerts

## 🧪 Testing Strategy

### Playwright Tests

I've implemented 3 strategic Playwright tests covering:

1. **Map Functionality** (`tests/map-functionality.spec.ts`):
   - Verifies map loads correctly
   - Tests WMS layer visibility toggle
   - Tests zoom controls

2. **Drawing Tools** (`tests/drawing-tools.spec.ts`):
   - Tests marker creation
   - Verifies features appear in sidebar
   - Tests feature deletion

3. **Search Functionality** (`tests/search-functionality.spec.ts`):
   - Tests geocoding search
   - Verifies search results display
   - Tests location navigation

### Testing Philosophy

**Quality over Quantity**: Rather than aiming for 100% coverage, I focused on:
- **Critical User Flows**: Core functionality that users depend on
- **Integration Tests**: Testing how components work together
- **Accessibility**: Ensuring keyboard navigation and ARIA labels work

### What Would I Test With More Time?

1. **Unit Tests** (using Vitest):
   - Store actions and reducers
   - Utility functions (debounce, geometry calculations)
   - Component rendering with different props

2. **Visual Regression Tests**:
   - Screenshot comparisons to catch UI regressions
   - Responsive design testing across breakpoints

3. **Performance Tests**:
   - Load time with 1000+ features
   - Memory leak detection
   - Render performance benchmarks

4. **Accessibility Tests**:
   - Screen reader compatibility
   - Keyboard navigation flows
   - Color contrast validation

5. **Cross-Browser Testing**:
   - Safari, Firefox, Chrome, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

6. **Error Handling Tests**:
   - Network failures
   - Invalid WMS responses
   - localStorage quota exceeded

## 🤝 Tradeoffs Made

### 1. **Simplified Feature Editing**

**Tradeoff**: Used Leaflet Draw's built-in editing instead of custom edit UI
- **Pros**: Faster implementation, battle-tested, consistent UX
- **Cons**: Less control over edit UI styling, harder to customize
- **Reason**: Time constraints and need for reliable editing functionality

### 2. **Client-Side Only State**

**Tradeoff**: No backend persistence
- **Pros**: Simpler architecture, faster development, works offline
- **Cons**: Features lost if localStorage is cleared, no collaboration
- **Reason**: Requirement specified "client-side only"

### 3. **Basic Styling vs. Pixel-Perfect Figma Match**

**Tradeoff**: Implemented functional UI with Tailwind instead of exact Figma recreation
- **Pros**: Faster development, responsive by default, maintainable
- **Cons**: May not match Figma designs exactly
- **Reason**: Focused on functionality first; styling can be refined iteratively

### 4. **Single Map Instance**

**Tradeoff**: One map view instead of multiple views or split-screen
- **Pros**: Simpler state management, better performance
- **Cons**: Less flexibility for advanced use cases
- **Reason**: Core requirement was single-page application

### 5. **Nominatim for Geocoding**

**Tradeoff**: Free but rate-limited service
- **Pros**: No API key required, free to use
- **Cons**: Rate limits, slower than paid services, requires user-agent header
- **Reason**: Avoids API key management and costs

## 🚢 Production Readiness

### What's Missing for Production

1. **Error Handling & Monitoring**:
   - Error boundaries for React components
   - Sentry or similar for error tracking
   - User-friendly error messages

2. **Loading States**:
   - Skeleton loaders for map tiles
   - Loading indicators for search
   - Progress indicators for feature operations

3. **Optimization**:
   - Code splitting and lazy loading
   - Image optimization
   - Bundle size optimization
   - Service worker for offline support

4. **Security**:
   - Input sanitization for search queries
   - XSS prevention
   - CSP headers
   - Rate limiting for API calls

5. **Accessibility Enhancements**:
   - Full keyboard navigation
   - Screen reader announcements
   - Focus management
   - High contrast mode

6. **Documentation**:
   - API documentation
   - Component Storybook
   - User guide
   - Developer onboarding docs

7. **CI/CD**:
   - Automated testing in CI
   - Automated deployments
   - Preview deployments for PRs

8. **Analytics**:
   - User interaction tracking
   - Performance metrics
   - Feature usage analytics

9. **Internationalization**:
   - Multi-language support
   - Locale-specific formatting

10. **Backend Integration** (if needed):
    - API for feature persistence
    - User authentication
    - Feature sharing/collaboration

### Immediate Production Additions

If deploying today, I would prioritize:
1. Error boundaries
2. Loading states
3. Basic error monitoring (Sentry)
4. Environment variable configuration
5. Production build optimization

## ⏱️ Time Spent

Rough breakdown of time investment:

- **Project Setup** (15%): Vite, TypeScript, Tailwind, ESLint, Prettier configuration
- **Map Integration** (20%): Leaflet setup, WMS layer integration, base map functionality
- **State Management** (10%): Zustand store design and implementation
- **Drawing Tools** (20%): Leaflet Draw integration, feature rendering, persistence
- **UI Components** (15%): Sidebar, SearchBar, CustomControls, styling
- **Testing** (10%): Playwright test setup and test cases
- **Documentation** (5%): README and code comments
- **Bug Fixes & Refinement** (5%): Fixing issues, improving UX

**Total Estimated Time**: ~8-10 hours

## 🎯 Features Implemented

### Core Requirements ✅
- [x] React + TypeScript + Vite + Playwright + Tailwind CSS
- [x] WMS layer integration (NRW satellite imagery)
- [x] Interactive map (zoom, pan, layer toggle)
- [x] Client-side state management (Zustand)
- [x] Playwright tests (3 test suites)
- [x] Comprehensive README

### Bonus Features ✅
- [x] Interactive drawing tools (points, lines, polygons)
- [x] Layer management UI (sidebar with toggle)
- [x] Geocoding/Search integration (Nominatim)
- [x] Persistent features (localStorage)
- [x] Custom map controls (zoom, fullscreen)
- [x] Accessibility features (ARIA labels, keyboard navigation)
- [x] ESLint and Prettier configuration

## 📦 Dependencies

### Core
- `react` & `react-dom`: UI framework
- `leaflet` & `react-leaflet`: Map library
- `leaflet-draw`: Drawing tools
- `zustand`: State management
- `vite`: Build tool
- `typescript`: Type safety
- `tailwindcss`: Styling

### Development
- `@playwright/test`: E2E testing
- `eslint`: Linting
- `prettier`: Code formatting

## 📝 License

This project is created for the Unstop assignment.

## 🙏 Acknowledgments

- Leaflet team for the excellent mapping library
- NRW Geobasis for providing the WMS service
- Nominatim for geocoding services
- React Leaflet community

#   F l o w b i t - a i _ a s s e s m e n t 
 
 