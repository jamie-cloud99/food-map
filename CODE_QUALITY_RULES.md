# 程式碼品質規則

本專案已實施嚴格的程式碼品質檢查規則，以確保程式碼的一致性、可維護性和類型安全。

## 📋 已實施的規則

### 1. TypeScript 嚴格模式

**檔案**: `tsconfig.json`

已啟用的嚴格類型檢查選項：
- ✅ `noImplicitAny` - 禁止隱式 any 類型
- ✅ `strictNullChecks` - 嚴格的 null 檢查
- ✅ `strictFunctionTypes` - 嚴格的函數類型檢查
- ✅ `noUnusedLocals` - 禁止未使用的本地變數
- ✅ `noUnusedParameters` - 禁止未使用的參數
- ✅ `noImplicitReturns` - 要求明確的返回值
- ✅ `noUncheckedIndexedAccess` - 檢查陣列/物件索引存取

### 2. ESLint 規則

**檔案**: `eslint.config.mjs`

#### TypeScript 專屬規則
- ❌ **禁止使用 `any` 類型** (`@typescript-eslint/no-explicit-any: error`)
  - 例外情況需使用 `// eslint-disable-next-line` 明確標記

- ✅ **優先使用 `type` 而非 `interface`** (`@typescript-eslint/consistent-type-definitions: ["error", "type"]`)

- ❌ **禁止未使用的變數** (`@typescript-eslint/no-unused-vars: error`)
  - 以 `_` 開頭的變數可忽略（例如：`_unused`）

- ⚠️ **建議明確函數返回類型** (`@typescript-eslint/explicit-function-return-type: warn`)
  - 允許表達式和高階函數省略

- ⚠️ **避免使用非空斷言** (`@typescript-eslint/no-non-null-assertion: warn`)

#### 一般程式碼品質規則
- ⚠️ **避免使用 console.log** (`no-console: warn`)
  - 允許 `console.warn` 和 `console.error`

- ❌ **使用 const 而非 let** (`prefer-const: error`)

- ❌ **禁止使用 var** (`no-var: error`)

## 🔧 可用的命令

### 開發命令
```bash
npm run dev              # 啟動開發伺服器
npm run build            # 生產環境建置
npm start                # 啟動生產伺服器
```

### 程式碼品質檢查
```bash
npm run lint             # 執行 ESLint 檢查
npm run lint:fix         # 自動修復 ESLint 問題
npm run type-check       # TypeScript 類型檢查
npm run validate         # 執行完整驗證（type-check + lint + test）
```

### 測試
```bash
npm test                 # 執行測試
npm run test:ui          # 使用 UI 介面執行測試
npm run test:coverage    # 生成測試覆蓋率報告
```

## 🚀 Pre-commit Hooks (Husky + lint-staged)

專案已配置 Git pre-commit hooks，每次提交前會自動執行：

1. ✅ 對修改的 `.ts` 和 `.tsx` 檔案執行 `eslint --fix`
2. ✅ 執行 TypeScript 類型檢查

**配置檔案**: `.husky/pre-commit` 和 `package.json` 的 `lint-staged` 部分

如果檢查失敗，提交會被阻止，需要先修復問題才能提交。

## 🔄 GitHub Actions CI

**檔案**: `.github/workflows/ci.yml`

每次 push 或 PR 到 `main` 或 `develop` 分支時，會自動執行：

1. ✅ TypeScript 類型檢查
2. ✅ ESLint 檢查
3. ✅ 單元測試
4. ✅ 專案建置

## 📝 程式碼範例

### ❌ 錯誤示範

```typescript
// ❌ 使用 any
function processData(data: any) {
  return data
}

// ❌ 使用 interface
interface UserProps {
  name: string
}

// ❌ 未使用的變數
const unusedVariable = 42

// ❌ 使用 var
var count = 0
```

### ✅ 正確示範

```typescript
// ✅ 使用具體類型
function processData(data: UserData): ProcessedData {
  return transformData(data)
}

// ✅ 使用 type
type UserProps = {
  name: string
}

// ✅ 使用 _ 前綴標記未使用的變數
function handleEvent(_event: Event, data: Data): void {
  // 只使用 data
  console.log(data)
}

// ✅ 使用 const
const count = 0

// ✅ 合法的 any 使用（需明確標記）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
```

## 🎯 類型定義位置

- **專案類型**: `types/place.ts`
- **Google API 類型**: `types/google-places.ts`

所有外部 API 回應都應該有對應的類型定義，避免使用 `any`。

## 📊 當前狀態

- ✅ 0 TypeScript 錯誤
- ✅ 0 ESLint 錯誤
- ⚠️ 18 ESLint 警告（可接受）
  - 主要是建議加上明確的函數返回類型
  - 建議移除部分 console.log
- ✅ 8/8 測試通過

## 🔍 故障排除

### 如果 ESLint 很慢
某些需要類型資訊的規則（如 `prefer-nullish-coalescing`）已被停用，因為它們會顯著降低檢查速度。

### 如果需要例外
當確實需要使用 `any` 或其他被禁止的語法時，使用 ESLint 註解：

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = externalLibrary()
```

### 跳過 pre-commit hooks（不建議）
如果緊急情況需要跳過檢查：
```bash
git commit --no-verify -m "emergency fix"
```

⚠️ **注意**: 這會跳過所有檢查，僅在緊急情況使用。

## 📚 相關資源

- [TypeScript 官方文件](https://www.typescriptlang.org/docs/)
- [ESLint 規則文件](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Husky 文件](https://typicode.github.io/husky/)
