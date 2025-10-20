/**
 * Google Places API 類型定義
 * 用於替代 any 類型，提供完整的類型安全
 */

// Geocoding API Response Types
export type GoogleGeocodeResponse = {
  results: GoogleGeocodeResult[]
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'
  error_message?: string
}

export type GoogleGeocodeResult = {
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
    location_type: string
    viewport: {
      northeast: { lat: number; lng: number }
      southwest: { lat: number; lng: number }
    }
  }
  place_id: string
  types: string[]
  address_components?: GoogleAddressComponent[]
}

export type GoogleAddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

// Places API Nearby Search Response Types
export type GooglePlacesNearbyResponse = {
  results: GooglePlaceResult[]
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST'
  error_message?: string
  next_page_token?: string
}

export type GooglePlaceResult = {
  place_id: string
  name: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  vicinity?: string
  formatted_address?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  types: string[]
  photos?: GooglePlacePhoto[]
  opening_hours?: {
    open_now?: boolean
  }
  business_status?: string
}

export type GooglePlacePhoto = {
  photo_reference: string
  height: number
  width: number
  html_attributions: string[]
}

// Place Details API Response Types
export type GooglePlaceDetailsResponse = {
  result: GooglePlaceDetails
  status: 'OK' | 'ZERO_RESULTS' | 'NOT_FOUND' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR'
  error_message?: string
}

export type GooglePlaceDetails = {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
    periods?: GoogleOpeningPeriod[]
  }
  reviews?: GooglePlaceReview[]
  photos?: GooglePlacePhoto[]
  types: string[]
}

export type GoogleOpeningPeriod = {
  open: {
    day: number
    time: string
  }
  close?: {
    day: number
    time: string
  }
}

export type GooglePlaceReview = {
  author_name: string
  author_url?: string
  language: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

// Axios Error Type
export type AxiosErrorResponse = {
  response?: {
    status: number
    data: unknown
  }
  message: string
  name: string
}
