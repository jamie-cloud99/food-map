# Food Map 產品需求文件 (PRD)

## 1. 產品概述

**產品名稱**: Food Map (美食地圖)
**產品類型**: 餐廳探索 Web 應用程式
**目標用戶**: 尋找附近優質餐廳的消費者
**核心價值**: 透過智能評分演算法，平衡「評分品質」與「距離遠近」，推薦最佳用餐選擇

## 2. 核心功能需求

### 2.1 搜尋功能
| 功能 | 規格 |
|------|------|
| 地址輸入 | 支援任意地址或地標（如「台北101」） |
| 搜尋半徑 | 500m / 1km (預設) / 2km |
| 進階篩選 | • 價位等級（$-$$$$，多選）<br>• 餐廳類型（餐廳/咖啡廳/烘焙坊/外帶/酒吧，多選）<br>• 最低評分（3.5+/4.0+/4.5+） |

### 2.2 結果展示
| 項目 | 規格 |
|------|------|
| 顯示數量 | 前 5 名最佳餐廳 |
| 卡片資訊 | 排名徽章、照片、星級評分、評論數、價位、距離、地址、營業狀態、綜合分數 |
| 地圖整合 | Leaflet 互動式地圖，藍色圓點標示搜尋位置，金色數字標記餐廳 (1-5) |
| 響應式設計 | 手機版：地圖在上方<br>桌面版：地圖固定在側邊 |

## 3. 核心演算法

### 智能評分公式
```
綜合分數 = 0.6 × (評分/5.0) + 0.4 × (1 - 距離/最大半徑)
```

**權重設計**:
- 60% 評分權重：優先推薦高評價餐廳
- 40% 距離權重：考量便利性
- 結果範圍：0-100 分

**距離計算**: Haversine 公式（精確地理距離）

## 4. 技術規格

### 4.1 技術棧
| 層級 | 技術選型 |
|------|----------|
| 前端框架 | Next.js 15 (App Router) + React 19 + TypeScript |
| 樣式方案 | Tailwind CSS v4（暖米色主題 #f5f1e8） |
| 狀態管理 | TanStack Query (React Query) |
| 地圖元件 | Leaflet.js + React-Leaflet |
| 後端 | Next.js API Routes |
| 資料庫 | PostgreSQL (Supabase) + Prisma ORM |
| 測試框架 | Vitest + Testing Library |

### 4.2 API 整合
| API | 用途 | 備援機制 |
|-----|------|----------|
| Google Geocoding API | 地址轉座標 | 自動降級至 Mock 資料 |
| Google Places API (Nearby Search) | 搜尋附近餐廳 | 自動降級至 Mock 資料 |
| Google Place Photos API | 餐廳照片 | Next.js Image 優化 |

### 4.3 資料模型

**CachedPlace** (快取 Google Places 資料):
- `placeId`, `name`, `address`, `coordinates`
- `rating`, `priceLevel`, `types`, `photos`
- 索引：`placeId`, `latitude`, `longitude`

**SearchLog** (搜尋紀錄分析):
- `query`, `location`, `radius`, `resultCount`, `timestamp`

## 5. 資料流程

```
用戶輸入地址 + 半徑
    ↓
POST /api/search
    ↓
Google Geocoding API (地址 → 座標)
    ↓
Google Places API (搜尋附近餐廳)
    ↓
評分演算法計算分數
    ↓
套用使用者篩選條件
    ↓
返回前 5 名結果
    ↓
客戶端渲染卡片 + 地圖
```

## 6. 非功能性需求

### 6.1 效能要求
- 搜尋 API 回應時間 < 3 秒
- 首次內容繪製 (FCP) < 1.5 秒
- React Query 快取 5 分鐘，減少 API 呼叫

### 6.2 安全性
- ✅ API 金鑰僅存於伺服器端環境變數
- ✅ `.env` 檔案列入 `.gitignore`
- ✅ API 路由進行輸入驗證
- 🔜 生產環境建議設定 HTTP Referrer 限制

### 6.3 可用性
- ✅ API 失敗自動降級至 Mock 資料
- ✅ 完整錯誤處理與使用者提示
- ✅ 健康檢查端點 (`GET /api/health`)

## 7. 開發與部署

### 環境變數
```bash
DATABASE_URL=postgresql://...          # 必填：資料庫連線
GOOGLE_PLACES_API_KEY=...             # 必填：Google API 金鑰
USE_MOCK_DATA=false                   # 選填：強制使用 Mock 資料
```

### 部署平台
- **主要**: Vercel (已優化)
- **替代**: Docker Standalone 模式

### CI/CD 流程
```bash
npm run validate    # 型別檢查 + Lint + 測試
npm run build       # Turbopack 建置
npm start           # 生產環境啟動
```

## 8. 成功指標

| 指標 | 目標 |
|------|------|
| 搜尋成功率 | > 95% |
| API 回應時間 | < 3s (P95) |
| 使用者滿意度 | 推薦結果準確度 > 80% |
| 行動裝置可用性 | Lighthouse Score > 90 |

## 9. 限制與約束

| 項目 | 限制 |
|------|------|
| Google Places API | 每月配額限制（建議啟用資料庫快取） |
| 搜尋半徑 | 最大 2km（API 限制） |
| 結果數量 | 最多顯示 5 筆（產品設計決策） |
| 地圖提供商 | OpenStreetMap（免費方案） |

## 10. 未來規劃 (Phase 2)

- [ ] 啟用資料庫快取機制（減少 API 配額消耗）
- [ ] 餐廳詳細頁面
- [ ] 多種排序方式（純評分/純距離/評論數）
- [ ] 「在 Google Maps 開啟」連結
- [ ] 搜尋歷史記錄 (LocalStorage)
- [ ] 多語系支援（中/英切換）

---

## 附錄：專案文件

- **使用指南**: [README.md](../README.md)
- **設定指南**: [SETUP.md](../SETUP.md), [supabase-setup.md](./supabase-setup.md)
- **安全性**: [SECURITY.md](../SECURITY.md), [SECURITY_AUDIT_REPORT.md](../SECURITY_AUDIT_REPORT.md)
- **開發規範**: [CODE_QUALITY_RULES.md](../CODE_QUALITY_RULES.md)
- **專案說明**: [CLAUDE.md](../CLAUDE.md)
- **測試報告**: [tests/e2e/E2E_TEST_REPORT.md](../tests/e2e/E2E_TEST_REPORT.md)

---

**文件版本**: 1.0
**最後更新**: 2025-10-30
**專案狀態**: ✅ 生產就緒 (Production Ready)
