import type { Place } from '@/types/place'

/**
 * 評分演算法權重
 */
const RATING_WEIGHT = 0.6 // 評分權重 60%
const DISTANCE_WEIGHT = 0.4 // 距離權重 40%

/**
 * 計算綜合評分
 *
 * @param rating - Google 評分 (0-5)
 * @param distance - 距離（公尺）
 * @param maxDistance - 最大搜尋距離（公尺）
 * @returns 綜合評分 (0-1)
 */
export function calculateScore(
  rating: number | undefined,
  distance: number,
  maxDistance: number
): number {
  // 正規化評分 (0-1)
  const normalizedRating = rating ? rating / 5.0 : 0

  // 正規化距離分數 (越近分數越高)
  const normalizedDistance = 1 - Math.min(distance / maxDistance, 1)

  // 計算加權總分
  const score =
    RATING_WEIGHT * normalizedRating + DISTANCE_WEIGHT * normalizedDistance

  return score
}

/**
 * 根據綜合評分排序美食地點
 *
 * @param places - 美食地點陣列
 * @param maxDistance - 最大搜尋距離
 * @param limit - 回傳數量限制（可選）
 * @returns 排序後的美食地點陣列（包含 score 欄位）
 */
export function sortPlacesByScore(
  places: Place[],
  maxDistance: number,
  limit?: number
): Place[] {
  // 計算每個地點的綜合評分
  const placesWithScore = places.map((place) => ({
    ...place,
    score: calculateScore(place.rating, place.distance || 0, maxDistance),
  }))

  // 根據分數由高到低排序
  const sorted = placesWithScore.sort((a, b) => (b.score || 0) - (a.score || 0))

  // 如果有限制數量，則只回傳前 N 個
  return limit ? sorted.slice(0, limit) : sorted
}

/**
 * 計算兩個經緯度座標之間的距離（公尺）
 * 使用 Haversine 公式
 *
 * @param lat1 - 起點緯度
 * @param lng1 - 起點經度
 * @param lat2 - 終點緯度
 * @param lng2 - 終點經度
 * @returns 距離（公尺）
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // 地球半徑（公尺）
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}
