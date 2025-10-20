import type { Place } from '@/types/place'
import Image from 'next/image'

interface PlaceCardProps {
  place: Place
  rank?: number
  onClick?: () => void
}

export default function PlaceCard({ place, rank, onClick }: PlaceCardProps) {
  const {
    name,
    vicinity,
    rating,
    userRatingsTotal,
    priceLevel,
    distance,
    score,
    photoUrl,
    isOpen,
  } = place

  // 格式化距離
  const formatDistance = (meters?: number) => {
    if (!meters) return '-'
    if (meters < 1000) return `${meters} 公尺`
    return `${(meters / 1000).toFixed(1)} 公里`
  }

  // 價格等級顯示
  const renderPriceLevel = (level?: number) => {
    if (!level) return <span className="text-muted">未提供</span>
    return (
      <span className="text-accent">
        {'$'.repeat(level)}
        <span className="text-muted">{'$'.repeat(4 - level)}</span>
      </span>
    )
  }

  // 評分星星
  const renderStars = (rating?: number) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`star-${i}`} className="text-accent text-lg">
            ⭐
          </span>
        ))}
        {hasHalfStar && <span key="half-star" className="text-accent text-lg">⭐</span>}
        <span className="ml-1 text-sm font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
        {userRatingsTotal && (
          <span className="text-xs text-muted">
            ({userRatingsTotal.toLocaleString()})
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-200
                 overflow-hidden cursor-pointer border border-primary/10
                 hover:border-primary/30 relative"
    >
      {/* Rank Badge */}
      {rank && (
        <div className="absolute top-2 left-2 bg-primary text-white
                       rounded-full w-8 h-8 flex items-center justify-center
                       font-bold text-sm shadow-md z-10">
          {rank}
        </div>
      )}

      {/* Photo */}
      <div className="relative w-full h-48 bg-muted">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}

        {/* Open/Closed Badge */}
        {isOpen !== undefined && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
              isOpen
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {isOpen ? '營業中' : '已打烊'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="text-lg font-bold text-foreground truncate">
          {name}
        </h3>

        {/* Rating */}
        {renderStars(rating)}

        {/* Info Grid */}
        <div className="space-y-2 text-sm">
          {/* Price & Distance */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-muted mr-2">價格</span>
              {renderPriceLevel(priceLevel)}
            </div>
            <div>
              <span className="text-muted mr-2">距離</span>
              <span className="font-medium text-foreground">
                {formatDistance(distance)}
              </span>
            </div>
          </div>

          {/* Address */}
          {vicinity && (
            <div className="text-muted text-xs line-clamp-1">
              📍 {vicinity}
            </div>
          )}

          {/* Score */}
          {score !== undefined && (
            <div className="pt-2 border-t border-primary/10">
              <span className="text-xs text-muted">綜合評分：</span>
              <span className="text-sm font-semibold text-primary ml-1">
                {(score * 100).toFixed(0)}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
