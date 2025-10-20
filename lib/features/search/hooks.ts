/**
 * 搜尋功能的 React Query Hooks
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { searchPlaces, searchQueryKeys } from './api'
import type { SearchPlacesRequest, SearchPlacesResponse } from './api'

/**
 * 搜尋餐廳的 Mutation Hook
 * 使用 mutation 而非 query，因為這是用戶觸發的操作，而非自動載入的資料
 */
export function useSearchPlaces() {
  const queryClient = useQueryClient()

  return useMutation<SearchPlacesResponse, Error, SearchPlacesRequest>({
    mutationFn: searchPlaces,
    
    // 成功後可以將結果快取起來，避免重複搜尋相同參數
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        searchQueryKeys.places(variables),
        data
      )
    },
    
    // 可以設置重試邏輯
    retry: (failureCount, error) => {
      // 網路錯誤時重試，但 4xx 錯誤不重試
      if (error.message.includes('Network Error')) {
        return failureCount < 2
      }
      return false
    },
    
    // 錯誤處理
    onError: (error) => {
      console.error('Search places failed:', error)
    },
  })
}

/**
 * 清除搜尋相關的快取
 */
export function useClearSearchCache() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ 
      queryKey: searchQueryKeys.all 
    })
  }
}

/**
 * 獲取上次搜尋結果的 Hook（如果有快取的話）
 */
export function useLastSearchResult(params?: SearchPlacesRequest) {
  const queryClient = useQueryClient()
  
  if (!params) return null
  
  return queryClient.getQueryData(searchQueryKeys.places(params))
}