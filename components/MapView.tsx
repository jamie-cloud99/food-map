'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place, Location } from '@/types/place'

// 修復 Leaflet 預設圖標問題
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MapViewProps = {
  center: Location
  places: Place[]
  onMarkerClick?: (place: Place) => void
}

export default function MapView({ center, places, onMarkerClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // 建立地圖
    const map = L.map(mapContainerRef.current).setView(
      [center.lat, center.lng],
      14
    )

    // 加入圖層
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // 清除所有標記
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // 使用者位置標記（藍色）
    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    L.marker([center.lat, center.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup('<b>您的位置</b>')

    // 餐廳標記
    places.forEach((place, index) => {
      if (!mapRef.current) return

      // 建立編號標記（金棕色）
      const placeIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #d4a574;
            border: 2px solid white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          ">${index + 1}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })

      const marker = L.marker([place.location.lat, place.location.lng], {
        icon: placeIcon,
      }).addTo(mapRef.current)

      // 彈出視窗內容
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">
            ${index + 1}. ${place.name}
          </h3>
          ${
            place.photoUrl
              ? `<img src="${place.photoUrl}" alt="${place.name}"
                 style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />`
              : ''
          }
          ${
            place.rating
              ? `<div style="margin-bottom: 4px;">
                   <span style="color: #f59e0b;">⭐</span>
                   <strong>${place.rating.toFixed(1)}</strong>
                   ${place.userRatingsTotal ? `<span style="color: #8a7f72; font-size: 12px;"> (${place.userRatingsTotal})</span>` : ''}
                 </div>`
              : ''
          }
          ${
            place.distance
              ? `<div style="font-size: 14px; color: #8a7f72;">
                   📍 ${place.distance < 1000 ? `${place.distance} 公尺` : `${(place.distance / 1000).toFixed(1)} 公里`}
                 </div>`
              : ''
          }
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 300,
      })

      // 點擊事件
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(place))
      }
    })

    // 調整視圖以包含所有標記
    if (places.length > 0) {
      const bounds = L.latLngBounds([
        [center.lat, center.lng],
        ...places.map((p) => [p.location.lat, p.location.lng] as [number, number]),
      ])
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [center, places, onMarkerClick])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg"
      style={{ zIndex: 0 }}
    />
  )
}
