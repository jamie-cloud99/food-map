# 🚀 Supabase 快速設定指南

## 1. 建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 並註冊
2. 點擊 "New Project"
3. 選擇組織或建立新組織
4. 填寫專案資訊：
   - **Name**: `food-map`
   - **Database Password**: 設定強密碼（請記住！）
   - **Region**: 選擇 `Southeast Asia (Singapore)` 或最近的區域
5. 點擊 "Create new project"

## 2. 取得連線資訊

專案建立完成後：

1. 進入專案 Dashboard
2. 點擊上方的 "Connet" 按鈕
3. 在 "Connection string" 區域找到 URI 格式
4. 複製連線字串，格式如下：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## 3. 設定環境變數

1. 複製環境變數範本：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，填入實際值：
   ```bash
   # 貼上您的 Supabase 連線字串（記得修改為正確的密碼！）
   DATABASE_URL="postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres"
   
   # 填入您的 Google Places API 金鑰
   GOOGLE_PLACES_API_KEY="your_actual_api_key"
   GEOCODING_API_KEY="your_actual_api_key"
   ```

## 4. 切換到 PostgreSQL

執行設定腳本：
```bash
chmod +x scripts/setup-supabase.sh
./scripts/setup-supabase.sh
```

或手動執行：
```bash
# 切換到 PostgreSQL schema
cp prisma/schema-postgresql.prisma prisma/schema.prisma

# 推送資料庫結構到 Supabase
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

## 5. 測試連線

啟動開發伺服器：
```bash
npm run dev
```

前往 http://localhost:3000/api/health 檢查健康狀態

## 6. Supabase Dashboard 功能

在 Supabase Dashboard 中您可以：

- **Table Editor**: 直接檢視和編輯資料
- **SQL Editor**: 執行 SQL 查詢
- **Database**: 檢視 schema 和效能
- **API**: 查看自動生成的 API 文件
- **Authentication**: 如果需要用戶登入功能
- **Storage**: 檔案儲存功能

## 7. 生產環境部署

部署到 Vercel 時：

1. 在 Vercel Dashboard 設定環境變數
2. 或使用 Vercel CLI：
   ```bash
   vercel env add DATABASE_URL
   vercel env add GOOGLE_PLACES_API_KEY
   ```

## 8. 監控與維護

- **使用量監控**: Settings → Usage
- **備份**: 自動每日備份（免費方案保留 7 天）
- **日誌**: Logs 頁面查看資料庫活動

## 🎯 免費方案限制

- **資料庫大小**: 500MB
- **API 請求**: 5萬次/月
- **頻寬**: 5GB/月
- **專案數量**: 2個

對於食物地圖應用程式來說，這些額度通常已經足夠！

## 🆘 疑難排解

### 連線失敗
1. 檢查密碼是否正確
2. 確認專案狀態為 "Active"
3. 檢查防火牆設定

### Schema 推送失敗
```bash
# 重置並重新推送
npx prisma db push --force-reset
```

### 效能問題
1. 在 Supabase Dashboard 檢查查詢效能
2. 考慮新增適當的索引
3. 使用 EXPLAIN 分析慢查詢