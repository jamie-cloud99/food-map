import { describe, it, expect } from 'vitest'
import { calculateScore, sortPlacesByScore } from '@/lib/scoring'
import type { Place } from '@/types/place'

describe('評分演算法', () => {
  describe('calculateScore', () => {
    it('應該根據評分和距離計算綜合分數', () => {
      // 評分 4.5, 距離 500m (最大距離 1000m)
      // score = 0.6 × (4.5/5) + 0.4 × (1 - 500/1000)
      // score = 0.6 × 0.9 + 0.4 × 0.5 = 0.54 + 0.2 = 0.74
      const score = calculateScore(4.5, 500, 1000)
      expect(score).toBeCloseTo(0.74, 2)
    })

    it('評分 5.0 且距離 0m 應該得到滿分', () => {
      const score = calculateScore(5.0, 0, 1000)
      expect(score).toBeCloseTo(1.0, 2)
    })

    it('評分 0 且距離等於最大距離應該得到最低分', () => {
      const score = calculateScore(0, 1000, 1000)
      expect(score).toBeCloseTo(0.0, 2)
    })

    it('沒有評分時應該只計算距離分數', () => {
      // score = 0.4 × (1 - 300/1000) = 0.4 × 0.7 = 0.28
      const score = calculateScore(undefined, 300, 1000)
      expect(score).toBeCloseTo(0.28, 2)
    })

    it('評分較高但距離較遠的店家應該得到合理分數', () => {
      // 評分 4.8, 距離 900m
      // score = 0.6 × (4.8/5) + 0.4 × (1 - 900/1000)
      // score = 0.6 × 0.96 + 0.4 × 0.1 = 0.576 + 0.04 = 0.616
      const score = calculateScore(4.8, 900, 1000)
      expect(score).toBeCloseTo(0.616, 2)
    })
  })

  describe('sortPlacesByScore', () => {
    const mockPlaces: Place[] = [
      {
        id: '1',
        placeId: 'place1',
        name: '餐廳 A',
        address: 'Address A',
        location: { lat: 25.033, lng: 121.565 },
        rating: 4.5,
        userRatingsTotal: 100,
        distance: 500,
        types: ['restaurant'],
      },
      {
        id: '2',
        placeId: 'place2',
        name: '餐廳 B',
        address: 'Address B',
        location: { lat: 25.034, lng: 121.566 },
        rating: 4.0,
        userRatingsTotal: 50,
        distance: 200,
        types: ['restaurant'],
      },
      {
        id: '3',
        placeId: 'place3',
        name: '餐廳 C',
        address: 'Address C',
        location: { lat: 25.035, lng: 121.567 },
        rating: 4.8,
        userRatingsTotal: 200,
        distance: 800,
        types: ['restaurant'],
      },
    ]

    it('應該根據綜合分數由高到低排序', () => {
      const sorted = sortPlacesByScore(mockPlaces, 1000)

      // 檢查分數是否已計算
      expect(sorted[0]?.score).toBeDefined()
      expect(sorted[1]?.score).toBeDefined()
      expect(sorted[2]?.score).toBeDefined()

      // 檢查排序是否正確（分數由高到低）
      expect(sorted[0]?.score ?? 0).toBeGreaterThanOrEqual(sorted[1]?.score ?? 0)
      expect(sorted[1]?.score ?? 0).toBeGreaterThanOrEqual(sorted[2]?.score ?? 0)
    })

    it('應該回傳前 N 個結果', () => {
      const top2 = sortPlacesByScore(mockPlaces, 1000, 2)
      expect(top2).toHaveLength(2)
    })

    it('空陣列應該回傳空陣列', () => {
      const sorted = sortPlacesByScore([], 1000)
      expect(sorted).toEqual([])
    })
  })
})
