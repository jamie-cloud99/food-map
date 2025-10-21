/**
 * Google Places API 型別定義
 */

// 地理位置
export type Location = {
  lat: number
  lng: number
}

// 美食地點基本資訊
export type Place = {
  id: string
  placeId: string // Google Places ID
  name: string
  address: string
  location: Location
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number // 1-4
  types: string[]
  photoReference?: string
  photoUrl?: string
  vicinity?: string
  isOpen?: boolean
  distance?: number // 距離使用者位置（公尺）
  score?: number // 綜合評分（用於排序）
}

// 美食地點詳細資訊
export type PlaceDetail = {
  formattedAddress: string
  phoneNumber?: string
  website?: string
  openingHours?: {
    openNow: boolean
    weekdayText: string[]
  }
  reviews?: Review[]
  photos?: PlacePhoto[]
} & Place

// 評論
export type Review = {
  authorName: string
  rating: number
  text: string
  time: number
  relativeTime: string
}

// 照片
export type PlacePhoto = {
  photoReference: string
  height: number
  width: number
  url?: string
}

// 搜尋請求
export type SearchRequest = {
  address: string
  radius?: number // 預設 1000m
  type?: PlaceType
  filters?: FilterOptions // 篩選條件
}

// 搜尋回應
export type SearchResponse = {
  location: Location
  places: Place[]
  top5: Place[]
}

// 美食類型
export type PlaceType =
  | 'restaurant'
  | 'cafe'
  | 'bakery'
  | 'meal_takeaway'
  | 'bar'
  | 'all'

// 排序方式
export type SortBy =
  | 'recommended' // 推薦（綜合評分）
  | 'rating'      // 評分
  | 'distance'    // 距離
  | 'reviews'     // 評論數

/**
 * 篩選選項
 * 價格等級：1-4
 * 類型：餐廳、咖啡廳、酒吧等
 * 最低評分：3.5、4.0、4.5
 */
export type FilterOptions = {
  priceLevel?: number[] // [1, 2, 3, 4]
  types?: PlaceType[]
  minRating?: number // 3.5, 4.0, 4.5
}
