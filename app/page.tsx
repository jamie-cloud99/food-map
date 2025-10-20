'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) return;

    setIsLoading(true);

    // 導向結果頁並傳遞搜尋參數
    const params = new URLSearchParams({
      address: address.trim(),
      radius: radius,
    });

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
            <div className="flex gap-4 justify-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="radius"
                  value="500"
                  checked={radius === '500'}
                  onChange={(e) => setRadius(e.target.value)}
                  className="mr-2 w-4 h-4 text-primary accent-primary"
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
                />
                <span className="text-foreground">2 公里</span>
              </label>
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
