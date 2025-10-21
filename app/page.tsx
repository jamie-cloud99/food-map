'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PlaceType } from '@/types/place';

export default function Home() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);

  // 篩選條件
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<PlaceType[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  const router = useRouter();

  // 處理價格等級選擇
  const togglePriceLevel = (level: number) => {
    setSelectedPriceLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  // 處理餐廳類型選擇
  const toggleType = (type: PlaceType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) return;

    setIsLoading(true);

    // 建立搜尋參數
    const params = new URLSearchParams({
      address: address.trim(),
      radius: radius,
    });

    // 加入篩選條件到 URL
    if (selectedPriceLevels.length > 0) {
      params.set('priceLevel', selectedPriceLevels.join(','));
    }
    if (selectedTypes.length > 0) {
      params.set('types', selectedTypes.join(','));
    }
    if (minRating > 0) {
      params.set('minRating', minRating.toString());
    }

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
          🍽️ 美食地圖
        </h1>
        <p className="text-lg text-muted">探索您附近最美味的餐廳</p>
      </header>

      {/* Search Form */}
      <main className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Address Input */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground mb-2"
            >
              輸入地址或地點
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="例如：台北101、台北市信義區信義路五段7號"
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/30
                        focus:border-primary focus:outline-none transition-colors
                        bg-card text-foreground placeholder:text-muted"
              disabled={isLoading}
            />
          </div>

          {/* Radius Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              搜尋半徑
            </label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="radius"
                  value="500"
                  checked={radius === '500'}
                  onChange={(e) => setRadius(e.target.value)}
                  className="mr-2 w-4 h-4 text-primary accent-primary"
                  disabled={isLoading}
                />
                <span className="text-foreground">500 公尺</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="radius"
                  value="1000"
                  checked={radius === '1000'}
                  onChange={(e) => setRadius(e.target.value)}
                  className="mr-2 w-4 h-4 text-primary accent-primary"
                  disabled={isLoading}
                />
                <span className="text-foreground">1 公里</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="radius"
                  value="2000"
                  checked={radius === '2000'}
                  onChange={(e) => setRadius(e.target.value)}
                  className="mr-2 w-4 h-4 text-primary accent-primary"
                  disabled={isLoading}
                />
                <span className="text-foreground">2 公里</span>
              </label>
            </div>
          </div>

          {/* Price Level Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              價格等級（可多選）
            </label>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => togglePriceLevel(level)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-medium
                    ${selectedPriceLevels.includes(level)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card text-foreground border-primary/30 hover:border-primary/60'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {'$'.repeat(level)}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">
              未選擇表示不限價格
            </p>
          </div>

          {/* Restaurant Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              餐廳類型（可多選）
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: 'restaurant' as PlaceType, label: '🍽️ 餐廳' },
                { value: 'cafe' as PlaceType, label: '☕ 咖啡廳' },
                { value: 'bakery' as PlaceType, label: '🥖 麵包店' },
                { value: 'meal_takeaway' as PlaceType, label: '🥡 外帶' },
                { value: 'bar' as PlaceType, label: '🍺 酒吧' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleType(value)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm
                    ${selectedTypes.includes(value)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card text-foreground border-primary/30 hover:border-primary/60'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">
              未選擇表示搜尋所有類型
            </p>
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              最低評分
            </label>
            <div className="flex gap-3 justify-center flex-wrap">
              {[
                { value: 0, label: '不限' },
                { value: 3.5, label: '3.5+' },
                { value: 4.0, label: '4.0+' },
                { value: 4.5, label: '4.5+' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    value={value}
                    checked={minRating === value}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="mr-2 w-4 h-4 text-primary accent-primary"
                    disabled={isLoading}
                  />
                  <span className="text-foreground font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !address.trim()}
            className="w-full py-4 bg-primary hover:bg-primary/90
                      disabled:bg-muted disabled:cursor-not-allowed
                      text-white font-semibold rounded-lg
                      transition-all duration-200
                      shadow-md hover:shadow-lg"
          >
            {isLoading ? '搜尋中...' : '🔍 搜尋美食'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted">
          <p>找到您附近評價最高的 Top 5 美食餐廳</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-muted">
        <p>Powered by Google Places API</p>
      </footer>
    </div>
  );
}
