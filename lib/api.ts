import axios from 'axios'
import type { Place, Location } from '@/types/place'

// API 基礎配置
const api = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 可以在這裡添加認證 token 等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 統一錯誤處理
    console.error('API Error:', error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message || 'API 請求失敗'
      throw new Error(message)
    }
    
    throw error
  }
)

// API 服務類型定義
export type SearchRequest = {
  address: string
  radius: number
  type: 'all' | 'restaurant' | 'cafe' | 'bar'
}

export type SearchResponse = {
  location: Location
  top5: Place[]
}

// API 服務函數
export const apiService = {
  /**
   * 搜尋附近的餐廳
   */
  async searchPlaces(params: SearchRequest): Promise<SearchResponse> {
    const response = await api.post<SearchResponse>('/api/search', params)
    return response.data
  },
}

export default apiService