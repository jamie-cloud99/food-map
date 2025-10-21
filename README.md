# 🍽️ 美食地圖

探索您附近最美味的餐廳 - 基於 Google Places API 的智能美食推薦系統

![美食地圖](./docs/screenshots/homepage.png)

## ✨ 專案特色

- 🎯 **智能評分演算法**: 60% 評分 + 40% 距離的加權計算
- 🗺️ **互動式地圖**: 使用 Leaflet.js 顯示餐廳位置
- 📱 **響應式設計**: 手機優先的 UI/UX
- 🎨 **柔和米色系**: Calming & Minimal 設計風格
- ⚡ **快速載入**: Next.js 15 + Turbopack
- 🧪 **測試驅動開發**: 完整的單元測試與 E2E 測試

## 🚀 快速開始

### 前置需求

- Node.js 18+
- Supabase 帳號（免費）
- Google Places API Key

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd food-map
   ```

2. **設定 Supabase 資料庫**
   ```bash
   # 一鍵設定 Supabase
   chmod +x scripts/setup-supabase.sh
   ./scripts/setup-supabase.sh
   ```
   
   或參考詳細設定指南：[docs/supabase-setup.md](./docs/supabase-setup.md)

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**

   環境變數會在執行 Supabase 設定腳本時自動處理，或您可以手動設定：
   ```bash
   # 複製環境變數範本
   cp .env.example .env
   
   # 編輯 .env 填入實際值
   # DATABASE_URL: Supabase 連線字串
   # GOOGLE_PLACES_API_KEY: Google Places API 金鑰
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**

   前往 [http://localhost:3000](http://localhost:3000)

   或檢查健康狀態：[http://localhost:3000/api/health](http://localhost:3000/api/health)

## 📋 可用指令

```bash
# 開發
npm run dev          # 啟動開發伺服器（Turbopack）
npm run build        # 建置生產版本
npm start            # 啟動生產伺服器

# 測試
npm test             # 執行單元測試
npm run test:ui      # 測試 UI 介面
npm run test:coverage # 測試覆蓋率報告

# 資料庫
npx prisma studio    # 開啟 Prisma Studio
npx prisma migrate dev # 執行 migration

# 程式碼品質
npm run lint         # ESLint 檢查
```

## 🏗️ 技術棧

### 前端
- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS v4
- **地圖**: Leaflet.js
- **狀態管理**: React Query (TanStack Query)

### 後端
- **API**: Next.js API Routes
- **資料庫**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **外部服務**: Google Places API

### 測試
- **單元測試**: Vitest + React Testing Library
- **E2E 測試**: Chrome DevTools MCP
- **Mock**: MSW (Mock Service Worker)

## 📁 專案結構

```
food-map/
├── app/
│   ├── api/
│   │   └── search/route.ts      # 搜尋 API
│   ├── results/page.tsx         # 結果頁
│   ├── page.tsx                 # 首頁
│   └── globals.css              # 全域樣式
├── components/
│   ├── PlaceCard.tsx            # 美食卡片元件
│   └── MapView.tsx              # 地圖元件
├── lib/
│   ├── db.ts                    # Prisma Client
│   ├── scoring.ts               # 評分演算法
│   └── google-places.ts         # Google Places API
├── types/
│   └── place.ts                 # 型別定義
├── prisma/
│   └── schema.prisma            # 資料庫 Schema
└── tests/
    ├── unit/                    # 單元測試
    ├── integration/             # 整合測試
    └── e2e/                     # E2E 測試
```

## 🎯 核心功能

### 1. 智能評分演算法

```typescript
score = 0.6 × (rating / 5.0) + 0.4 × (1 - distance / maxDistance)
```

- **評分權重**: 60% - Google 評分 (0-5 星)
- **距離權重**: 40% - 距離使用者位置
- **結果**: 綜合評分 (0-100)

### 2. Google Places API 整合

- ✅ Geocoding - 地址轉座標
- ✅ Nearby Search - 附近餐廳搜尋
- ✅ Place Details - 餐廳詳細資訊
- ✅ Place Photos - 餐廳照片

### 3. 互動式地圖

- ✅ 使用者位置標記（藍色）
- ✅ 餐廳位置標記（金棕色編號 1-5）
- ✅ 點擊標記顯示彈出視窗
- ✅ 縮放與拖曳功能

### 4. 美食卡片資訊

每張卡片顯示：
- 📷 餐廳照片
- ⭐ Google 評分 + 評論數
- 💰 價格等級 ($ ~ $$$$)
- 📍 距離與地址
- 🏆 綜合評分 (0-100)
- 🕐 營業狀態

## 🧪 測試

### 執行單元測試

```bash
npm test
```

目前測試覆蓋率：
- ✅ 評分演算法 (8/8 tests passed)
- ✅ 距離計算 (Haversine 公式)

### 執行 E2E 測試

完整的 E2E 測試報告請參閱：
- [E2E 測試指南](./tests/e2e/README.md)
- [E2E 測試報告](./tests/e2e/E2E_TEST_REPORT.md)

測試結果：
- ✅ 首頁 UI 載入
- ✅ 搜尋流程
- ✅ 結果頁顯示
- ✅ 地圖互動
- ✅ 返回導航
- ✅ 錯誤處理

## 🎨 設計系統

### 配色方案（柔和米色系）

```css
--background: #f5f1e8    /* 主背景 */
--foreground: #4a4338    /* 主文字 */
--primary: #d4a574       /* 強調色 */
--secondary: #a8956c     /* 輔助色 */
--accent: #f59e0b        /* 評分星星 */
--muted: #8a7f72         /* 次要文字 */
--card: #ffffff          /* 卡片背景 */
```

### 設計原則

- **Calming** - 柔和、舒適的視覺體驗
- **Minimal** - 簡潔、清晰的介面設計
- **手機優先** - 響應式排版，移動裝置優化

## 🔐 環境變數說明

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| `DATABASE_URL` | Supabase PostgreSQL 連線字串 | - |
| `GOOGLE_PLACES_API_KEY` | Google Places API Key | - |
| `GEOCODING_API_KEY` | Google Geocoding API Key | - |
| `NEXT_PUBLIC_DEFAULT_SEARCH_RADIUS` | 預設搜尋半徑（公尺） | 1000 |
| `NEXT_PUBLIC_MAP_CENTER_LAT` | 地圖中心緯度 | 25.0330 |
| `NEXT_PUBLIC_MAP_CENTER_LNG` | 地圖中心經度 | 121.5654 |

## 📊 資料庫 Schema

### CachedPlace (快取 Google Places 資料)

```prisma
model CachedPlace {
  id               String   @id @default(uuid())
  placeId          String   @unique
  name             String
  address          String
  latitude         Float
  longitude        Float
  rating           Float?
  userRatingsTotal Int?
  priceLevel       Int?
  types            Json
  photoReference   String?
  vicinity         String?
  isOpen           Boolean?
  lastUpdated      DateTime @default(now())
}
```

### SearchLog (搜尋記錄)

```prisma
model SearchLog {
  id            String   @id @default(uuid())
  searchAddress String
  latitude      Float
  longitude     Float
  radius        Int
  resultCount   Int
  createdAt     DateTime @default(now())
}
```

## 🚧 開發中功能 (Phase 2)

- [ ] 篩選功能（價格、類型、評分）
- [ ] 排序功能（推薦/評分/距離/評論數）
- [ ] 美食詳細資訊頁
- [ ] 在 Google Maps 中開啟連結
- [ ] 搜尋歷史（LocalStorage）
- [ ] 更多美食類型支援
- [ ] 多語言支援（中英切換）

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

### 開發流程

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 編碼規範

- 使用 TypeScript
- 遵循 ESLint 規則
- 撰寫單元測試
- 使用有意義的 commit message

## 📝 授權

MIT License

## 🙏 致謝

- [Next.js](https://nextjs.org/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Leaflet.js](https://leafletjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 聯絡方式

如有問題或建議，請開啟 Issue。

---

**使用 TDD 開發 | Next.js 15 | TypeScript | Tailwind CSS | Google Places API**
