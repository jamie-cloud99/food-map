/**
 * 搜尋功能相關的 API 服務
 */
import axios from 'axios'
import type { Place, Location } from '@/types/place'

// 搜尋請求參數類型
export type SearchPlacesRequest = {
  address: string
  radius: number
  type: 'all' | 'restaurant' | 'cafe' | 'bar'
}

// 搜尋回應類型
export type SearchPlacesResponse = {
  location: Location
  top5: Place[]
}

// API 基礎配置 (可以考慮提取到共用配置)
const searchApi = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 響應攔截器
searchApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Search API Error:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message || '搜尋失敗'
      throw new Error(message)
    }
    
    throw error
  }
)

/**
 * 搜尋附近餐廳的 API 函數
 */
export async function searchPlaces(params: SearchPlacesRequest): Promise<SearchPlacesResponse> {
  const response = await searchApi.post<SearchPlacesResponse>('/api/search', params)
  return response.data
}

// Query Keys - 用於 React Query 的快取管理
export const searchQueryKeys = {
  all: ['search'] as const,
  places: (params: SearchPlacesRequest) => ['search', 'places', params] as const,
} as const