import type { Place, FilterOptions, PlaceType } from '@/types/place'

/**
 * 套用所有篩選條件到餐廳清單
 *
 * @param places - 餐廳清單
 * @param filters - 篩選條件
 * @returns 篩選後的餐廳清單
 */
export function applyFilters(
  places: Place[],
  filters: FilterOptions
): Place[] {
  let filtered = [...places]

  // 1. 價格等級篩選
  if (filters.priceLevel && filters.priceLevel.length > 0) {
    const priceLevels = filters.priceLevel
    filtered = filtered.filter((place) => {
      // 如果餐廳沒有價格資訊，保留它（顯示為「未提供」）
      if (!place.priceLevel) {
        return true
      }
      return priceLevels.includes(place.priceLevel)
    })
  }

  // 2. 餐廳類型篩選
  if (filters.types && filters.types.length > 0) {
    // 如果包含 'all'，則不篩選類型
    if (!filters.types.includes('all')) {
      const selectedTypes = filters.types
      filtered = filtered.filter((place) => {
        // 檢查餐廳的任一類型是否在篩選條件中
        return place.types.some((type) =>
          selectedTypes.includes(type as PlaceType)
        )
      })
    }
  }

  // 3. 最低評分篩選
  if (filters.minRating !== undefined && filters.minRating > 0) {
    const minRating = filters.minRating
    filtered = filtered.filter((place) => {
      // 如果餐廳沒有評分，不顯示
      if (place.rating === undefined) {
        return false
      }
      return place.rating >= minRating
    })
  }

  return filtered
}

/**
 * 將價格等級數字轉換為符號顯示
 */
export function formatPriceLevel(priceLevel: number | undefined): string {
  if (priceLevel === undefined) {
    return '未提供'
  }
  return '$'.repeat(priceLevel)
}

/**
 * 將餐廳類型轉換為中文顯示
 */
export function formatPlaceType(type: PlaceType): string {
  const typeMap: Record<PlaceType, string> = {
    restaurant: '餐廳',
    cafe: '咖啡廳',
    bakery: '麵包店',
    meal_takeaway: '外帶',
    bar: '酒吧',
    all: '全部'
  }
  return typeMap[type] || type
}

/**
 * 格式化篩選條件摘要文字
 */
export function formatFilterSummary(filters: FilterOptions): string {
  const parts: string[] = []

  // 價格
  if (filters.priceLevel && filters.priceLevel.length > 0) {
    const priceLevels = filters.priceLevel
      .sort((a, b) => a - b)
      .map(level => formatPriceLevel(level))
    parts.push(`價格：${priceLevels.join(', ')}`)
  }

  // 類型
  if (filters.types && filters.types.length > 0 && !filters.types.includes('all')) {
    const types = filters.types.map(formatPlaceType)
    parts.push(`類型：${types.join('、')}`)
  }

  // 評分
  if (filters.minRating !== undefined && filters.minRating > 0) {
    parts.push(`評分：${filters.minRating.toFixed(1)}+`)
  }

  return parts.join(' ｜ ')
}
