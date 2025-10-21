'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useSearchPlaces } from '@/lib/features/search'
import { formatFilterSummary } from '@/lib/filters'
import PlaceCard from '@/components/PlaceCard'
import type { Place, Location, FilterOptions, PlaceType } from '@/types/place'

// 動態載入地圖元件（避免 SSR 問題）
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted">載入地圖中...</p>
    </div>
  ),
})

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [location, setLocation] = useState<Location | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const { mutate: searchPlaces, isPending: isLoading, error } = useSearchPlaces()

  const address = searchParams.get('address')
  const radius = parseInt(searchParams.get('radius') || '1000')

  // 解析篩選條件從 URL
  const filters: FilterOptions | undefined = (() => {
    const result: FilterOptions = {}

    const priceLevelParam = searchParams.get('priceLevel')
    if (priceLevelParam) {
      result.priceLevel = priceLevelParam.split(',').map(Number)
    }

    const typesParam = searchParams.get('types')
    if (typesParam) {
      result.types = typesParam.split(',') as PlaceType[]
    }

    const minRatingParam = searchParams.get('minRating')
    if (minRatingParam) {
      result.minRating = parseFloat(minRatingParam)
    }

    // 如果沒有任何篩選條件，回傳 undefined
    return Object.keys(result).length > 0 ? result : undefined
  })()

  const filterSummary = filters ? formatFilterSummary(filters) : ''

  useEffect(() => {
    if (!address) {
      router.push('/')
      return
    }

    // 使用 mutate 進行搜尋，結果會在 onSuccess 回調中處理
    searchPlaces({
      address,
      radius,
      type: 'all',
      filters,
    }, {
      onSuccess: (data) => {
        setLocation(data.location)
        setPlaces(data.top5)
      },
      onError: (err) => {
        console.error('Search error:', err)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, radius, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🔍</div>
          <p className="text-lg text-foreground">搜尋附近美食中...</p>
          <p className="text-sm text-muted">{address}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold text-foreground">搜尋失敗</h2>
          <p className="text-muted">{error?.message}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg
                      hover:bg-primary/90 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    )
  }

  if (!location || places.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🍽️</div>
          <h2 className="text-2xl font-bold text-foreground">找不到餐廳</h2>
          <p className="text-muted">
            在「{address}」附近 {radius} 公尺內沒有找到餐廳
          </p>
          <p className="text-sm text-muted">
            建議：擴大搜尋範圍或更換搜尋地點
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg
                      hover:bg-primary/90 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/')}
              className="text-primary hover:text-primary/80 font-medium text-sm mb-1"
            >
              ← 返回搜尋
            </button>
            <h1 className="text-xl font-bold text-foreground">
              📍 {address}
            </h1>
            <p className="text-sm text-muted">
              找到 {places.length} 間推薦餐廳（半徑 {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}）
            </p>
            {filterSummary && (
              <p className="text-xs text-primary mt-1 font-medium">
                🔍 篩選條件：{filterSummary}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：餐廳列表（手機版在上方） */}
          <div className="space-y-4 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              🏆 Top {places.length} 推薦
            </h2>
            {places.map((place, index) => (
              <PlaceCard
                key={place.placeId}
                place={place}
                rank={index + 1}
                onClick={() => setSelectedPlace(place)}
              />
            ))}
          </div>

          {/* 右側：地圖（手機版在下方） */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-[400px] lg:h-[calc(100vh-120px)]">
            <MapView
              center={location}
              places={places}
              onMarkerClick={setSelectedPlace}
            />
          </div>
        </div>
      </main>

      {/* Selected Place Modal (可選) */}
      {selectedPlace && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className="bg-card rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-0 right-2 text-muted hover:text-foreground text-2xl"
            >
              ×
            </button>
            <PlaceCard place={selectedPlace} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">載入中...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
