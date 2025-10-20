import axios from 'axios'
import type { Location, Place, PlaceType } from '@/types/place'
import type {
  GoogleGeocodeResponse,
  GooglePlacesNearbyResponse,
  GooglePlaceResult,
  GooglePlaceDetailsResponse,
} from '@/types/google-places'
import { calculateDistance } from './scoring'
import { mockGeocodeAddress, mockSearchNearbyPlaces } from './mock-data'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || ''
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true'
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const PLACES_NEARBY_API_URL =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const PLACE_DETAILS_API_URL =
  'https://maps.googleapis.com/maps/api/place/details/json'
const PLACE_PHOTO_API_URL =
  'https://maps.googleapis.com/maps/api/place/photo'

/**
 * 將地址轉換為經緯度座標
 */
export async function geocodeAddress(address: string): Promise<Location> {
  // Use mock data in development mode or when API is not configured
  if (USE_MOCK_DATA || !GOOGLE_PLACES_API_KEY) {
    console.log('🎭 Using MOCK geocoding data for:', address)
    return mockGeocodeAddress(address)
  }

  try {
    console.log('Geocoding address:', address)
    console.log('API Key exists:', !!GOOGLE_PLACES_API_KEY)

    const response = await axios.get<GoogleGeocodeResponse>(GEOCODING_API_URL, {
      params: {
        address,
        key: GOOGLE_PLACES_API_KEY,
        language: 'zh-TW',
      },
    })

    console.log('Geocoding API response status:', response.data.status)

    if (response.data.status !== 'OK' || !response.data.results.length) {
      console.warn(`❌ Geocoding API failed: ${response.data.status}`)
      console.warn(`Error message: ${response.data.error_message ?? 'Unknown error'}`)
      console.warn('⚠️  Falling back to MOCK data')
      return mockGeocodeAddress(address)
    }

    const firstResult = response.data.results[0]
    if (!firstResult) {
      console.warn('⚠️  No results found, falling back to MOCK data')
      return mockGeocodeAddress(address)
    }

    const { lat, lng } = firstResult.geometry.location
    console.log('✅ Geocoded location:', { lat, lng })
    return { lat, lng }
  } catch (error) {
    console.error('Geocoding error:', error)
    console.warn('⚠️  Falling back to MOCK data')
    return mockGeocodeAddress(address)
  }
}

/**
 * 搜尋附近的美食地點
 */
export async function searchNearbyPlaces(
  location: Location,
  radius: number = 1000,
  type: PlaceType = 'restaurant'
): Promise<Place[]> {
  // Use mock data in development mode or when API is not configured
  if (USE_MOCK_DATA || !GOOGLE_PLACES_API_KEY) {
    console.warn('🎭 Using MOCK nearby places data for location:', location)
    return mockSearchNearbyPlaces(location, radius)
  }

  try {
    // Google Places API 的類型參數
    const types =
      type === 'all'
        ? ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'bar']
        : [type]

    const allPlaces: Place[] = []

    // 對每個類型進行搜尋
    for (const placeType of types) {
      const response = await axios.get<GooglePlacesNearbyResponse>(PLACES_NEARBY_API_URL, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type: placeType,
          key: GOOGLE_PLACES_API_KEY,
          language: 'zh-TW',
        },
      })

      if (response.data.status === 'OK' && response.data.results) {
        const places = response.data.results.map((result) =>
          mapGooglePlaceToPlace(result, location)
        )
        allPlaces.push(...places)
      }
    }

    // 去除重複的地點（根據 placeId）
    const uniquePlaces = Array.from(
      new Map(allPlaces.map((place) => [place.placeId, place])).values()
    )

    return uniquePlaces
  } catch (error) {
    console.error('Nearby search error:', error)
    console.warn('⚠️  Falling back to MOCK data')
    return mockSearchNearbyPlaces(location, radius)
  }
}

/**
 * 取得地點詳細資訊
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsResponse['result']> {
  try {
    const response = await axios.get<GooglePlaceDetailsResponse>(PLACE_DETAILS_API_URL, {
      params: {
        place_id: placeId,
        fields:
          'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,reviews,photos,price_level,geometry,types',
        key: GOOGLE_PLACES_API_KEY,
        language: 'zh-TW',
      },
    })

    if (response.data.status !== 'OK') {
      throw new Error(`無法取得地點詳情: ${placeId}`)
    }

    return response.data.result
  } catch (error) {
    console.error('Place details error:', error)
    throw new Error('取得地點詳情失敗')
  }
}

/**
 * 取得照片 URL
 */
export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  return `${PLACE_PHOTO_API_URL}?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

/**
 * 將 Google Places API 回應轉換為我們的 Place 型別
 */
function mapGooglePlaceToPlace(
  googlePlace: GooglePlaceResult,
  userLocation: Location
): Place {
  const placeLocation: Location = {
    lat: googlePlace.geometry.location.lat,
    lng: googlePlace.geometry.location.lng,
  }

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    placeLocation.lat,
    placeLocation.lng
  )

  return {
    id: googlePlace.place_id,
    placeId: googlePlace.place_id,
    name: googlePlace.name,
    address: googlePlace.vicinity || googlePlace.formatted_address || '',
    location: placeLocation,
    rating: googlePlace.rating,
    userRatingsTotal: googlePlace.user_ratings_total,
    priceLevel: googlePlace.price_level,
    types: googlePlace.types || [],
    photoReference: googlePlace.photos?.[0]?.photo_reference,
    photoUrl: googlePlace.photos?.[0]?.photo_reference
      ? getPhotoUrl(googlePlace.photos[0].photo_reference)
      : undefined,
    vicinity: googlePlace.vicinity,
    isOpen: googlePlace.opening_hours?.open_now,
    distance,
  }
}
