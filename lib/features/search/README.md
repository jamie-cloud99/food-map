# 搜尋功能模組

這個模組使用 React Query (TanStack Query) 來管理餐廳搜尋功能的狀態。

## 📁 檔案結構

```
lib/features/search/
├── api.ts          # API 函數和類型定義
├── hooks.ts        # React Query Hooks
└── index.ts        # 統一導出
```

## 🚀 使用方式

### 基本搜尋

```tsx
import { useSearchPlaces } from '@/lib/features/search'

function SearchComponent() {
  const { mutate: searchPlaces, isPending, error, data } = useSearchPlaces()

  const handleSearch = () => {
    searchPlaces({
      address: '台北101',
      radius: 1000,
      type: 'all'
    }, {
      onSuccess: (data) => {
        console.log('搜尋成功:', data)
        // 處理成功結果
      },
      onError: (error) => {
        console.error('搜尋失敗:', error)
        // 處理錯誤
      }
    })
  }

  return (
    <div>
      <button onClick={handleSearch} disabled={isPending}>
        {isPending ? '搜尋中...' : '搜尋餐廳'}
      </button>
      
      {error && <p>錯誤: {error.message}</p>}
    </div>
  )
}
```

### 清除快取

```tsx
import { useClearSearchCache } from '@/lib/features/search'

function AdminComponent() {
  const clearCache = useClearSearchCache()
  
  return (
    <button onClick={clearCache}>
      清除搜尋快取
    </button>
  )
}
```

### 獲取上次搜尋結果

```tsx
import { useLastSearchResult } from '@/lib/features/search'

function Component() {
  const lastResult = useLastSearchResult({
    address: '台北101',
    radius: 1000,
    type: 'all'
  })
  
  if (lastResult) {
    console.log('有快取的結果:', lastResult)
  }
}
```

## 🎯 主要特色

### 1. **類型安全**
- 完整的 TypeScript 支援
- 強型別的請求和回應參數

### 2. **自動快取**
- React Query 自動管理快取
- 避免重複的 API 請求
- 智能的背景更新

### 3. **錯誤處理**
- 統一的錯誤處理邏輯
- 網路錯誤自動重試
- 4xx 錯誤不重試避免浪費資源

### 4. **效能優化**
- 請求去重
- 背景重新驗證
- 樂觀更新支援

### 5. **開發體驗**
- React Query DevTools 支援 (需安裝額外套件)
- 清晰的 loading 和 error 狀態
- 易於測試的架構

## ⚙️ 配置選項

Query Client 在 `components/Providers.tsx` 中配置：

- **staleTime**: 5 分鐘 - 資料被視為新鮮的時間
- **gcTime**: 10 分鐘 - 快取資料的垃圾回收時間
- **retry**: 網路錯誤重試 2 次，其他錯誤不重試
- **refetchOnWindowFocus**: 關閉 - 視窗聚焦時不自動重新獲取

## 📦 依賴項目

- `@tanstack/react-query` - 狀態管理和資料獲取
- `axios` - HTTP 客戶端
- `react` - React Hooks

## 🔄 未來擴展

這個架構可以輕鬆擴展更多搜尋相關功能：

```tsx
// 可以添加更多搜尋類型
export function useSearchByCategory() { ... }
export function useNearbyPlaces() { ... }
export function usePlaceDetails() { ... }
export function useFavoritePlaces() { ... }
```