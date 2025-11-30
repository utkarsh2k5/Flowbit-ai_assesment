Satellite Imagery & AOI Manager

A React-based single-page application for displaying satellite/drone imagery with interactive map features, allowing users to draw, manage, and persist Areas of Interest (AOI).

Quick Start

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build


The application will be available at http://localhost:3000

Map Library Choice

Selected Library: Leaflet (via react-leaflet)

I selected Leaflet as the core mapping engine for this project.

Why Leaflet?

WMS Support: The project required integrating NRW Geobasis satellite imagery. Leaflet has robust, native support for WMS (Web Map Service) layers, making integration seamless.

Lightweight: At ~38KB (gzipped), it is significantly lighter than competitors like Mapbox GL JS, ensuring faster initial load times.

Mature Ecosystem: It has a massive community and a rich plugin ecosystem. Specifically, leaflet-draw is the industry standard for simple vector creation tools on the web.

React Compatibility: react-leaflet provides excellent bindings, allowing us to manage map state declaratively within the React component tree.

Alternatives Considered:

Mapbox GL JS: Powerful for vector tiles and 3D terrain, but overkill for this specific 2D raster/satellite use case. It also has a heavier bundle size and strict token requirements.

OpenLayers: Extremely powerful with native WMS support, but has a steeper learning curve and more verbose API compared to Leaflet.

Architecture Decisions

The project follows a feature-based and separation-of-concerns architecture.

Directory Structure

src/
├── components/       # UI and Map logic
│   ├── MapContent.tsx    # Leaflet Map container & WMS layers
│   ├── DrawingManager.tsx# Handles drawing logic & event listeners
│   ├── FeatureLayers.tsx # Renders saved GeoJSON shapes
│   ├── Sidebar.tsx       # Feature list & layer toggles
│   └── SearchBar.tsx     # Geocoding UI
├── store/            # State Management
│   └── mapStore.ts       # Centralized Zustand store
├── utils/            # Shared logic
│   └── debounce.ts       # Search optimization
└── App.tsx           # Layout composition


Key Decisions

State Management (Zustand): I chose Zustand over Redux or Context API.

Why? It minimizes boilerplate and prevents the "Context Hell" re-render issues common with complex map state. It allows MapContent to subscribe only to layer changes, while Sidebar subscribes only to feature lists.

Component Separation:

Map Logic (DrawingManager) is decoupled from Presentation (Sidebar). The map component handles the "where" and "what" of rendering, while the sidebar handles user interaction and management.

Persistence: Feature data is synced to localStorage. This allows the app to function as a client-side tool without requiring an immediate backend, maintaining state across reloads.

Performance Considerations

Current Optimization

Debouncing: The search bar uses a custom debounce utility (300ms) to prevent excessive API calls to the geocoding service.

Lazy Rendering: The WMS layer is conditionally rendered; if the user toggles it off, it is removed from the DOM entirely to free up resources.

Future Scaling (1000s of Polygons)

If the requirements scaled to thousands of points, the current DOM-node-per-feature approach would bottleneck. Here is the strategy for scale:

Clustering: Implement leaflet.markercluster to group nearby points at low zoom levels, reducing the number of DOM elements.

Virtualization: The Sidebar list would use react-window to only render the list items currently visible in the viewport, rather than creating thousands of <li> elements.

Canvas Rendering: Switch from SVG rendering (standard Leaflet vectors) to Canvas rendering (preferCanvas: true) for the map overlay, which handles large numbers of paths significantly better.

Spatial Indexing: Implement a client-side spatial index (like RBush) to query only features inside the current map bounds, rendering only what the user can see.

Testing Strategy

Framework: Playwright

I prioritized End-to-End (E2E) testing to simulate real user behavior.

What was tested:

Map Functionality: Verifying the map loads, WMS layers toggle correctly, and zoom controls function.

Drawing Tools: simulating a user clicking the map to place markers and verifying those markers appear in the sidebar list.

Search Integration: Typing a location, waiting for results, and clicking a result to fly to that location.

With more time:

Unit Tests (Vitest): I would add unit tests for the mapStore reducers to ensure complex logic (like deleting a specific polygon by ID) is bug-free.

Visual Regression: Snapshot testing to ensure the map UI doesn't break when styles change.

Tradeoffs Made

Client-Side Storage: I used localStorage instead of a backend database.

Compromise: Data is limited to the specific browser/device.

Reason: It allowed for rapid development of a fully functional prototype without setting up a backend server/DB.

Nominatim Geocoding: I used the free OpenStreetMap Nominatim API.

Compromise: It has strict rate limits.

Reason: Zero setup cost and sufficient for an assessment demo.

Production Readiness

To make this application production-ready, I would implement:

Error Boundaries: Wrap the Map component to prevent the entire app from crashing if WebGL context is lost or a layer fails to load.

Environment Variables: Secure configuration for API endpoints.

Accessibility (a11y): Ensure full keyboard navigation for the map (e.g., panning with arrow keys) and screen reader support for the sidebar.

Dockerization: Create a Dockerfile for consistent deployment across environments.

CI/CD Pipeline: GitHub Actions to run the Playwright tests automatically on every Pull Request.

Time Spent

Project Setup & Config: 15% (Vite, TS, Tailwind, ESLint)

Map Integration: 20% (Leaflet setup, WMS layers)

State Management: 10% (Zustand store architecture)

Drawing Tools: 20% (Leaflet Draw implementation & persistence)

UI Components: 15% (Sidebar, Search, Responsive design)

Testing: 10% (Playwright setup & writing specs)

Documentation & Polish: 10%
