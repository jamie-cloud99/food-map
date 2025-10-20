# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Food Map is a Next.js 15 application that helps users discover top-rated restaurants near a specified address using Google Places API. It features a custom scoring algorithm that ranks restaurants based on both rating (60% weight) and distance (40% weight).

## Development Commands

```bash
# Development
npm run dev                # Start dev server with Turbopack
npm run build             # Production build with Turbopack
npm start                 # Start production server

# Code Quality
npm run lint              # Run ESLint

# Testing
npm test                  # Run all tests with Vitest
npm run test:ui           # Run tests with UI interface
npm run test:coverage     # Generate coverage report

# Database (Prisma)
npx prisma generate       # Generate Prisma Client
npx prisma migrate dev    # Run migrations in development
npx prisma studio         # Open Prisma Studio GUI
npx prisma db push        # Push schema without migrations
```

## Architecture

### Core Data Flow

1. **User Input** → [app/page.tsx](app/page.tsx) - User enters address and radius
2. **API Request** → [app/api/search/route.ts](app/api/search/route.ts) - POST request with search params
3. **Geocoding** → [lib/google-places.ts](lib/google-places.ts#L19) - Convert address to lat/lng
4. **Places Search** → [lib/google-places.ts](lib/google-places.ts#L60) - Fetch nearby restaurants
5. **Scoring & Sorting** → [lib/scoring.ts](lib/scoring.ts) - Apply weighted algorithm
6. **Results Display** → [app/results/page.tsx](app/results/page.tsx) - Show top 5 with map

### Key Architectural Patterns

**API Fallback System**: All Google API calls ([lib/google-places.ts](lib/google-places.ts)) automatically fall back to mock data on failure. Set `USE_MOCK_DATA=true` in `.env` to force mock mode for development without API calls.

**Scoring Algorithm** ([lib/scoring.ts](lib/scoring.ts)):
- Normalizes rating (0-5) and distance (0-maxRadius) to 0-1 scale
- Applies 60% weight to rating, 40% to distance
- Uses Haversine formula for precise distance calculation
- Returns sorted array with computed `score` field

**Database Caching** ([prisma/schema.prisma](prisma/schema.prisma)):
- `CachedPlace` model stores Google API responses to reduce quota usage
- `SearchLog` model tracks search analytics
- Currently database operations exist in [lib/db.ts](lib/db.ts) but are not actively used in API routes (future optimization)

**Client-Side Map Rendering** ([components/MapView.tsx](components/MapView.tsx)):
- Leaflet map loaded dynamically with `next/dynamic` to avoid SSR issues
- Custom markers: blue circle for user location, numbered gold circles for restaurants
- Auto-fits bounds to show all results

### Environment Variables

Required in `.env`:
```bash
GOOGLE_PLACES_API_KEY=...        # Google Cloud API key
DATABASE_URL=mysql://...          # MySQL connection string
USE_MOCK_DATA=false              # Set to 'true' to use mock data
```

See [SETUP.md](SETUP.md) for Google API setup instructions and [SECURITY.md](SECURITY.md) for API key protection best practices.

### Type System

All shared types are in [types/place.ts](types/place.ts):
- `Place`: Core restaurant data structure
- `Location`: Lat/lng coordinates
- `SearchRequest`/`SearchResponse`: API contract
- `PlaceType`: Union type for restaurant categories

### Testing Strategy

Tests use Vitest + Testing Library. Current coverage focuses on core algorithms:
- [tests/unit/scoring.test.ts](tests/unit/scoring.test.ts) - Scoring algorithm validation
- Test setup in [tests/setup.ts](tests/setup.ts) with jsdom environment

When adding new utility functions to `lib/`, add corresponding tests in `tests/unit/`.

### Google Places API Integration

The app uses two Google APIs (both wrapped in [lib/google-places.ts](lib/google-places.ts)):
1. **Geocoding API** - Converts address to coordinates
2. **Places API Nearby Search** - Finds restaurants within radius

When `type='all'` is passed to `searchNearbyPlaces()`, it searches multiple categories (restaurant, cafe, bakery, meal_takeaway, bar) and deduplicates by `placeId`.

Photo URLs are constructed via `getPhotoUrl()` using photo references from API responses.

### UI/UX Notes

- Theme uses warm beige palette defined in [app/globals.css](app/globals.css)
- Mobile-first responsive design with Tailwind CSS v4
- Results page uses sticky positioning for map on desktop
- Loading states and error boundaries handle API failures gracefully

### Common Gotchas

1. **Leaflet SSR Issue**: MapView must be imported with `ssr: false` in dynamic import
2. **Image Domains**: Google Maps photo URLs require `remotePatterns` config in [next.config.ts](next.config.ts)
3. **Prisma Client**: Uses singleton pattern in [lib/db.ts](lib/db.ts) to avoid connection exhaustion in development
4. **Turbopack**: This project uses `--turbopack` flag for faster builds (Next.js 15 feature)

### Security Considerations

- Never commit `.env` file (already in `.gitignore`)
- API key should have HTTP referrer restrictions in production
- See [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) for full security review
- Input validation exists for address and radius in API route
