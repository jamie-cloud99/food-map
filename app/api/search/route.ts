import { NextRequest, NextResponse } from 'next/server'
import { geocodeAddress, searchNearbyPlaces } from '@/lib/google-places'
import { sortPlacesByScore } from '@/lib/scoring'
import type { SearchRequest, SearchResponse } from '@/types/place'

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { address, radius = 1000, type = 'restaurant' } = body

    // 驗證必要參數
    if (!address) {
      return NextResponse.json(
        { error: '請提供地址' },
        { status: 400 }
      )
    }

    // 1. 將地址轉換為座標
    const location = await geocodeAddress(address)

    // 2. 搜尋附近美食
    const places = await searchNearbyPlaces(location, radius, type)

    // 3. 計算評分並排序
    const sortedPlaces = sortPlacesByScore(places, radius)

    // 4. 取得 Top 5
    const top5 = sortedPlaces.slice(0, 5)

    const response: SearchResponse = {
      location,
      places: sortedPlaces,
      top5,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Search API error:', error)

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    // Check if it's an Axios error
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as any
      console.error('API Response Status:', axiosError.response?.status)
      console.error('API Response Data:', axiosError.response?.data)
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '搜尋失敗',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
