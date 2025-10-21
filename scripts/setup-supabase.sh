#!/bin/bash

# Supabase 設定腳本 - 自動化設定流程

set -e

echo "� 開始設定 Supabase..."
echo ""

# 1. 檢查必要檔案
if [ ! -f "prisma/schema-postgresql.prisma" ]; then
    echo "❌ 錯誤: 找不到 PostgreSQL schema 檔案"
    echo "請確保 prisma/schema-postgresql.prisma 存在"
    exit 1
fi

# 2. 檢查環境變數檔案
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📋 複製環境變數範本..."
        cp .env.example .env
        echo "✅ 已建立 .env 檔案"
        echo ""
        echo "⚠️  請編輯 .env 檔案並填入以下資訊："
        echo "   - DATABASE_URL (Supabase 連線字串)"
        echo "   - GOOGLE_PLACES_API_KEY"
        echo "   - GEOCODING_API_KEY"
        echo ""
        echo "💡 參考 docs/supabase-setup.md 取得詳細設定說明"
        echo ""
        read -p "完成 .env 設定後按 Enter 繼續..."
    else
        echo "❌ 錯誤: 找不到 .env.example 檔案"
        exit 1
    fi
else
    echo "📋 發現現有的 .env 檔案"
    
    # 檢查是否為 MySQL 設定
    if grep -q "mysql://" .env; then
        echo "⚠️  偵測到 MySQL 設定，建議切換到 Supabase PostgreSQL"
        echo ""
        echo "📁 已建立 .env.migration 檔案，包含轉換後的設定"
        echo "💡 您可以："
        echo "   1. 繼續使用現有的 MySQL 設定"
        echo "   2. 手動編輯 .env 切換到 Supabase"
        echo "   3. 使用 .env.migration 作為參考"
        echo ""
        read -p "繼續使用現有設定？(Y/n): " use_existing
        case "$use_existing" in
            n|N|no|No )
                echo "請手動更新 .env 檔案後重新執行腳本"
                exit 1
                ;;
            * )
                echo "✅ 繼續使用現有設定"
                ;;
        esac
    fi
fi

# 3. 檢查 DATABASE_URL
source .env 2>/dev/null || true
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres" ]; then
    echo "❌ 錯誤: DATABASE_URL 尚未設定"
    echo "請在 .env 檔案中設定正確的 Supabase 連線字串"
    exit 1
fi

# 4. 備份現有的 schema（如果存在）
if [ -f "prisma/schema.prisma" ]; then
    echo "💾 備份現有 schema..."
    cp prisma/schema.prisma "prisma/schema-backup-$(date +%Y%m%d_%H%M%S).prisma"
    echo "✅ 已備份到 prisma/schema-backup-*.prisma"
fi

# 5. 使用 PostgreSQL schema
echo "🔄 切換到 PostgreSQL schema..."
cp prisma/schema-postgresql.prisma prisma/schema.prisma
echo "✅ 已切換到 PostgreSQL schema"

# 6. 安裝依賴（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安裝 npm 依賴..."
    npm install
fi

# 7. 生成 Prisma Client
echo "⚙️ 生成 Prisma Client..."
npx prisma generate

# 8. 推送 schema 到 Supabase
echo "🗄️ 推送資料庫 schema 到 Supabase..."
npx prisma db push

# 9. 驗證連線
echo "🔍 驗證資料庫連線..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ 資料庫連線成功！"
else
    echo "❌ 資料庫連線失敗，請檢查 DATABASE_URL"
    exit 1
fi

echo ""
echo "🎉 Supabase 設定完成！"
echo ""
echo "📋 下一步驟："
echo "1. 執行 'npm run dev' 啟動開發伺服器"
echo "2. 前往 http://localhost:3000/api/health 檢查健康狀態"
echo "3. 前往 http://localhost:3000 測試應用程式"
echo ""
echo "📖 更多資訊請參考 docs/supabase-setup.md"