# E2E 測試指南 - 美食地圖

## 概述

本專案使用 **Chrome DevTools MCP (Model Context Protocol)** 進行端對端 (E2E) 測試。

相比傳統的 Playwright 或 Cypress，MCP 提供了更靈活的瀏覽器自動化能力。

---

## 測試工具

### Chrome DevTools MCP

**優點**:
- ✅ 無需安裝額外的測試框架
- ✅ 直接使用 Claude Code 內建的 MCP 工具
- ✅ 可以進行視覺驗證（截圖）
- ✅ 可以檢查 DOM 結構
- ✅ 支援網路請求監控
- ✅ 支援互動操作（點擊、輸入、等待）

**可用的 MCP 工具**:
- `mcp__chrome-devtools__new_page` - 開啟新頁面
- `mcp__chrome-devtools__navigate_page` - 導航到 URL
- `mcp__chrome-devtools__take_snapshot` - 拍攝頁面結構快照
- `mcp__chrome-devtools__take_screenshot` - 拍攝頁面截圖
- `mcp__chrome-devtools__fill` - 填寫表單
- `mcp__chrome-devtools__click` - 點擊元素
- `mcp__chrome-devtools__wait_for` - 等待元素出現
- `mcp__chrome-devtools__list_network_requests` - 列出網路請求

---

## 執行測試

### 前置準備

1. **啟動開發伺服器**:
   ```bash
   npm run dev
   ```

2. **確認 Google Places API Key**:
   - 檢查 `.env` 檔案中的 `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
   - 如果沒有 API Key，請至 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 建立

3. **確認資料庫運行**:
   ```bash
   # 檢查 MySQL 服務狀態
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### 手動 E2E 測試步驟

使用 Claude Code 的 Chrome DevTools MCP 進行測試：

#### 1. 開啟頁面
```
請使用 MCP 開啟 http://localhost:3000
```

#### 2. 拍攝首頁快照
```
請拍攝頁面快照和截圖
```

#### 3. 測試搜尋流程
```
請在地址欄位輸入「台北101」並點擊搜尋按鈕
```

#### 4. 驗證結果頁
```
請等待結果頁載入並拍攝截圖
```

#### 5. 測試返回功能
```
請點擊返回按鈕
```

---

## 測試案例清單

### ✅ 核心流程測試

1. **首頁載入測試**
   - 驗證 UI 元素完整性
   - 驗證米色系配色
   - 驗證表單驗證

2. **搜尋流程測試**
   - 輸入有效地址（台北101）
   - 點擊搜尋按鈕
   - 驗證載入狀態
   - 驗證頁面導航

3. **結果頁測試**
   - 驗證 Top 5 列表顯示
   - 驗證美食卡片資訊
   - 驗證評分計算
   - 驗證地圖顯示

4. **地圖互動測試**
   - 驗證標記顯示
   - 驗證彈出視窗
   - 驗證縮放功能

5. **錯誤處理測試**
   - 輸入無效地址
   - 驗證容錯處理

### 📋 完整測試報告

請參閱 [E2E_TEST_REPORT.md](./E2E_TEST_REPORT.md)

---

## 自動化測試腳本範例

如果未來需要使用 Playwright，可以參考以下設定：

### 安裝 Playwright

```bash
npm install -D @playwright/test playwright
npx playwright install
```

### Playwright 配置檔案

建立 `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 範例測試檔案

建立 `tests/e2e/food-map.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('美食地圖 E2E 測試', () => {
  test('首頁載入與搜尋流程', async ({ page }) => {
    // 1. 開啟首頁
    await page.goto('/')

    // 2. 驗證標題
    await expect(page.getByRole('heading', { name: '🍽️ 美食地圖' })).toBeVisible()

    // 3. 輸入地址
    await page.getByPlaceholder('例如：台北101').fill('台北101')

    // 4. 點擊搜尋
    await page.getByRole('button', { name: '🔍 搜尋美食' }).click()

    // 5. 等待結果頁載入
    await expect(page.getByRole('heading', { name: /Top 5 推薦/ })).toBeVisible()

    // 6. 驗證至少有 5 張卡片
    const cards = page.locator('[class*="PlaceCard"]')
    await expect(cards).toHaveCount(5)

    // 7. 驗證地圖載入
    await expect(page.locator('[class*="leaflet-container"]')).toBeVisible()
  })

  test('返回按鈕功能', async ({ page }) => {
    await page.goto('/results?address=台北101&radius=1000')
    await page.getByRole('button', { name: '← 返回搜尋' }).click()
    await expect(page).toHaveURL('/')
  })
})
```

---

## 測試最佳實踐

### 1. 測試資料準備
- 使用真實的地址（台北101、台北車站等）
- 避免使用過於偏僻的地址（可能找不到餐廳）

### 2. 等待策略
- 使用 `wait_for` 等待特定元素出現
- 給予足夠的 timeout（Google Places API 可能需要 2-3 秒）

### 3. 截圖與快照
- 在關鍵步驟拍攝截圖以便除錯
- 使用快照檢查 DOM 結構

### 4. 網路請求監控
- 監控 Google Places API 呼叫
- 驗證 API 回應狀態

### 5. 視覺回歸測試
- 保存基準截圖
- 比對 UI 變更

---

## 常見問題

### Q1: 開發伺服器沒有啟動怎麼辦？
```bash
npm run dev
# 確認 http://localhost:3000 可以訪問
```

### Q2: Google Places API 沒有回傳結果？
- 檢查 `.env` 中的 `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- 檢查 API Key 權限設定
- 檢查 API 配額

### Q3: 地圖沒有顯示？
- Leaflet.js 需要客戶端渲染
- 確認使用 `dynamic(() => import())` 並設定 `ssr: false`

### Q4: 測試超時？
- 增加 timeout 時間
- 檢查網路連線
- 檢查 API 回應速度

---

## 持續整合 (CI/CD)

### GitHub Actions 範例

建立 `.github/workflows/e2e-test.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: food_map
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup database
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:password@localhost:3306/food_map

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test
        env:
          NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: ${{ secrets.GOOGLE_PLACES_API_KEY }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 總結

本專案目前使用 **Chrome DevTools MCP** 進行手動 E2E 測試，提供快速且靈活的測試方式。

未來可視需求加入 **Playwright** 進行自動化測試與 CI/CD 整合。

詳細測試結果請參閱 [E2E_TEST_REPORT.md](./E2E_TEST_REPORT.md)。
