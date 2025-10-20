import type { Location, Place } from '@/types/place'

/**
 * Mock geocoding for development
 */
export function mockGeocodeAddress(address: string): Location {
  // Default to Taipei 101 area
  const mockLocations: Record<string, Location> = {
    '台北101': { lat: 25.0330, lng: 121.5654 },
    '台北車站': { lat: 25.0478, lng: 121.5170 },
    '西門町': { lat: 25.0424, lng: 121.5067 },
    '信義區': { lat: 25.0330, lng: 121.5654 },
  }

  // Try to find a matching location
  for (const [key, location] of Object.entries(mockLocations)) {
    if (address.includes(key)) {
      return location
    }
  }

  // Default location (Taipei 101)
  return { lat: 25.0330, lng: 121.5654 }
}

/**
 * Mock nearby places search for development
 */
export function mockSearchNearbyPlaces(
  _location: Location,
  radius: number
): Place[] {
  const mockPlaces: Place[] = [
    {
      id: 'mock-1',
      placeId: 'ChIJmock1',
      name: '鼎泰豐',
      address: '台北市信義區市府路45號',
      location: { lat: 25.0336, lng: 121.5650 },
      rating: 4.5,
      userRatingsTotal: 15234,
      priceLevel: 2,
      types: ['restaurant', 'food'],
      photoReference: 'mock-photo-1',
      vicinity: '信義區市府路45號',
      isOpen: true,
      distance: 120,
      score: 0.92,
    },
    {
      id: 'mock-2',
      placeId: 'ChIJmock2',
      name: '添好運點心專門店',
      address: '台北市信義區松仁路97號',
      location: { lat: 25.0325, lng: 121.5665 },
      rating: 4.3,
      userRatingsTotal: 8567,
      priceLevel: 1,
      types: ['restaurant', 'food'],
      photoReference: 'mock-photo-2',
      vicinity: '信義區松仁路97號',
      isOpen: true,
      distance: 180,
      score: 0.88,
    },
    {
      id: 'mock-3',
      placeId: 'ChIJmock3',
      name: '誠品信義店美食街',
      address: '台北市信義區松高路11號',
      location: { lat: 25.0360, lng: 121.5687 },
      rating: 4.1,
      userRatingsTotal: 5423,
      priceLevel: 2,
      types: ['restaurant', 'food', 'meal_takeaway'],
      photoReference: 'mock-photo-3',
      vicinity: '信義區松高路11號',
      isOpen: true,
      distance: 250,
      score: 0.85,
    },
    {
      id: 'mock-4',
      placeId: 'ChIJmock4',
      name: '饗食天堂',
      address: '台北市信義區松仁路28號',
      location: { lat: 25.0310, lng: 121.5645 },
      rating: 4.2,
      userRatingsTotal: 12456,
      priceLevel: 3,
      types: ['restaurant', 'food'],
      photoReference: 'mock-photo-4',
      vicinity: '信義區松仁路28號',
      isOpen: true,
      distance: 300,
      score: 0.83,
    },
    {
      id: 'mock-5',
      placeId: 'ChIJmock5',
      name: '瓦城泰國料理',
      address: '台北市信義區松壽路12號',
      location: { lat: 25.0355, lng: 121.5670 },
      rating: 4.4,
      userRatingsTotal: 9876,
      priceLevel: 2,
      types: ['restaurant', 'food'],
      photoReference: 'mock-photo-5',
      vicinity: '信義區松壽路12號',
      isOpen: false,
      distance: 350,
      score: 0.81,
    },
    {
      id: 'mock-6',
      placeId: 'ChIJmock6',
      name: '欣葉台菜',
      address: '台北市信義區松高路19號',
      location: { lat: 25.0365, lng: 121.5695 },
      rating: 4.6,
      userRatingsTotal: 11234,
      priceLevel: 3,
      types: ['restaurant', 'food'],
      photoReference: 'mock-photo-6',
      vicinity: '信義區松高路19號',
      isOpen: true,
      distance: 420,
      score: 0.79,
    },
  ]

  // Filter by radius
  return mockPlaces.filter((place) => (place.distance || 0) <= radius)
}
