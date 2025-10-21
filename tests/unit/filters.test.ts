import { describe, it, expect } from 'vitest'
import { applyFilters, formatPriceLevel, formatPlaceType, formatFilterSummary } from '@/lib/filters'
import type { Place, FilterOptions } from '@/types/place'

// Mock 餐廳資料
const mockPlaces: Place[] = [
  {
    id: '1',
    placeId: 'place1',
    name: '高級法式餐廳',
    address: '台北市信義區',
    location: { lat: 25.033, lng: 121.565 },
    rating: 4.5,
    userRatingsTotal: 200,
    priceLevel: 4,
    types: ['restaurant', 'french_restaurant'],
    distance: 500,
    score: 0.9,
  },
  {
    id: '2',
    placeId: 'place2',
    name: '平價咖啡廳',
    address: '台北市大安區',
    location: { lat: 25.033, lng: 121.565 },
    rating: 4.0,
    userRatingsTotal: 150,
    priceLevel: 2,
    types: ['cafe'],
    distance: 300,
    score: 0.85,
  },
  {
    id: '3',
    placeId: 'place3',
    name: '中價位日式料理',
    address: '台北市中山區',
    location: { lat: 25.033, lng: 121.565 },
    rating: 3.8,
    userRatingsTotal: 100,
    priceLevel: 3,
    types: ['restaurant'],
    distance: 800,
    score: 0.75,
  },
  {
    id: '4',
    placeId: 'place4',
    name: '麵包店',
    address: '台北市松山區',
    location: { lat: 25.033, lng: 121.565 },
    rating: 4.2,
    userRatingsTotal: 80,
    priceLevel: 1,
    types: ['bakery'],
    distance: 400,
    score: 0.8,
  },
  {
    id: '5',
    placeId: 'place5',
    name: '無價格資訊餐廳',
    address: '台北市萬華區',
    location: { lat: 25.033, lng: 121.565 },
    rating: 4.8,
    userRatingsTotal: 50,
    priceLevel: undefined,
    types: ['restaurant'],
    distance: 600,
    score: 0.88,
  },
]

describe('篩選功能測試', () => {
  describe('applyFilters', () => {
    it('應該正確套用價格等級篩選', () => {
      const filters: FilterOptions = {
        priceLevel: [1, 2],
      }
      const result = applyFilters(mockPlaces, filters)

      expect(result).toHaveLength(3) // 麵包店(1), 咖啡廳(2), 無價格資訊(保留)
      expect(result.some(p => p.priceLevel === 1)).toBe(true)
      expect(result.some(p => p.priceLevel === 2)).toBe(true)
      expect(result.some(p => p.priceLevel === undefined)).toBe(true)
      expect(result.some(p => p.priceLevel === 3)).toBe(false)
      expect(result.some(p => p.priceLevel === 4)).toBe(false)
    })

    it('應該正確套用餐廳類型篩選', () => {
      const filters: FilterOptions = {
        types: ['cafe'],
      }
      const result = applyFilters(mockPlaces, filters)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('平價咖啡廳')
    })

    it('應該正確套用最低評分篩選', () => {
      const filters: FilterOptions = {
        minRating: 4.0,
      }
      const result = applyFilters(mockPlaces, filters)

      expect(result).toHaveLength(4)
      expect(result.every(p => p.rating !== undefined && p.rating >= 4.0)).toBe(true)
    })

    it('應該過濾掉沒有評分的餐廳（當設定最低評分時）', () => {
      const placeWithoutRating = {
        ...mockPlaces[0],
        rating: undefined,
      } as Place
      const placesWithoutRating: Place[] = [placeWithoutRating]

      const filters: FilterOptions = {
        minRating: 4.0,
      }
      const result = applyFilters(placesWithoutRating, filters)

      expect(result).toHaveLength(0)
    })

    it('應該正確套用多個篩選條件', () => {
      const filters: FilterOptions = {
        priceLevel: [1, 2, 3],
        minRating: 4.0,
        types: ['restaurant', 'cafe'],
      }
      const result = applyFilters(mockPlaces, filters)

      // 應該有兩間符合所有條件：
      // 1. "平價咖啡廳" - 價格2, 評分4.0, 類型cafe
      // 2. "麵包店" - 價格1, 評分4.2, 類型bakery (但bakery不在篩選類型中)
      // 實際上只有平價咖啡廳符合，因為類型必須是 restaurant 或 cafe
      // 但 types 陣列會包含多個類型，所以需要檢查更仔細

      // 實際檢查：
      // - 高級法式餐廳: 價格4(X), 評分4.5(O), 類型restaurant(O) - 不符合
      // - 平價咖啡廳: 價格2(O), 評分4.0(O), 類型cafe(O) - 符合
      // - 中價位日式料理: 價格3(O), 評分3.8(X), 類型restaurant(O) - 不符合
      // - 麵包店: 價格1(O), 評分4.2(O), 類型bakery(X) - 不符合
      // - 無價格資訊餐廳: 價格undefined(O保留), 評分4.8(O), 類型restaurant(O) - 符合

      expect(result).toHaveLength(2)
      expect(result.some(p => p.name === '平價咖啡廳')).toBe(true)
      expect(result.some(p => p.name === '無價格資訊餐廳')).toBe(true)
    })

    it('當篩選條件為空時應該回傳所有餐廳', () => {
      const filters: FilterOptions = {}
      const result = applyFilters(mockPlaces, filters)

      expect(result).toHaveLength(mockPlaces.length)
    })

    it('類型包含 "all" 時不應該篩選類型', () => {
      const filters: FilterOptions = {
        types: ['all'],
      }
      const result = applyFilters(mockPlaces, filters)

      expect(result).toHaveLength(mockPlaces.length)
    })
  })

  describe('formatPriceLevel', () => {
    it('應該正確格式化價格等級', () => {
      expect(formatPriceLevel(1)).toBe('$')
      expect(formatPriceLevel(2)).toBe('$$')
      expect(formatPriceLevel(3)).toBe('$$$')
      expect(formatPriceLevel(4)).toBe('$$$$')
    })

    it('應該為 undefined 回傳「未提供」', () => {
      expect(formatPriceLevel(undefined)).toBe('未提供')
    })
  })

  describe('formatPlaceType', () => {
    it('應該正確格式化餐廳類型', () => {
      expect(formatPlaceType('restaurant')).toBe('餐廳')
      expect(formatPlaceType('cafe')).toBe('咖啡廳')
      expect(formatPlaceType('bakery')).toBe('麵包店')
      expect(formatPlaceType('meal_takeaway')).toBe('外帶')
      expect(formatPlaceType('bar')).toBe('酒吧')
      expect(formatPlaceType('all')).toBe('全部')
    })
  })

  describe('formatFilterSummary', () => {
    it('應該正確格式化價格篩選摘要', () => {
      const filters: FilterOptions = {
        priceLevel: [2, 3],
      }
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('價格：$$, $$$')
    })

    it('應該正確格式化類型篩選摘要', () => {
      const filters: FilterOptions = {
        types: ['restaurant', 'cafe'],
      }
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('類型：餐廳、咖啡廳')
    })

    it('應該正確格式化評分篩選摘要', () => {
      const filters: FilterOptions = {
        minRating: 4.5,
      }
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('評分：4.5+')
    })

    it('應該正確格式化多個篩選條件摘要', () => {
      const filters: FilterOptions = {
        priceLevel: [1, 2],
        types: ['cafe'],
        minRating: 4.0,
      }
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('價格：$, $$ ｜ 類型：咖啡廳 ｜ 評分：4.0+')
    })

    it('當包含 "all" 類型時不應該顯示類型篩選', () => {
      const filters: FilterOptions = {
        types: ['all'],
        minRating: 4.0,
      }
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('評分：4.0+')
    })

    it('當沒有篩選條件時應該回傳空字串', () => {
      const filters: FilterOptions = {}
      const summary = formatFilterSummary(filters)

      expect(summary).toBe('')
    })
  })
})
