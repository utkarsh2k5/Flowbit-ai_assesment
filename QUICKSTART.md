# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm test:ui
```

## Building

```bash
npm run build
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Features

- ✅ Interactive map with WMS satellite imagery
- ✅ Drawing tools (points, lines, polygons)
- ✅ Layer management sidebar
- ✅ Geocoding search
- ✅ Feature persistence (localStorage)
- ✅ Custom map controls
- ✅ Accessibility features
- ✅ Playwright tests

## Project Structure

```
src/
├── components/     # React components
├── store/         # Zustand state management
├── utils/         # Utility functions
└── App.tsx        # Root component

tests/              # Playwright E2E tests
```

For detailed documentation, see [README.md](./README.md)

