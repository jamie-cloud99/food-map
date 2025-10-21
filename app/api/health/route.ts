import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // 檢查資料庫連線
    await prisma.$queryRaw`SELECT 1`
    
    // 檢查資料表
    const placeCount = await prisma.cachedPlace.count()
    
    // 檢查環境變數
    const hasGoogleApi = !!process.env.GOOGLE_PLACES_API_KEY
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        cachedPlaces: placeCount
      },
      api: {
        googlePlaces: hasGoogleApi
      },
      environment: process.env.NODE_ENV
    }
    
    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}