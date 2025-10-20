# Security Fixes - Quick Implementation Guide

## 🚨 URGENT: Fix Before Production

### 1. Regenerate Google API Key (5 minutes)

Your API key was exposed. Follow these steps:

```bash
# Step 1: Go to Google Cloud Console
open https://console.cloud.google.com/apis/credentials

# Step 2: Delete the old key
# Find key: AIzaSyDQxg... (the one in your .env)
# Click the trash icon to delete it

# Step 3: Create a new key
# Click "+ CREATE CREDENTIALS" > "API key"
# Copy the new key

# Step 4: Update your .env file
# Replace the old key with the new one

# Step 5: Add restrictions
# Click on the new key name
# Under "Application restrictions":
#   - Select "HTTP referrers (web sites)"
#   - Add: http://localhost:3000/*
#   - Add: https://yourdomain.com/* (when you deploy)
#
# Under "API restrictions":
#   - Select "Restrict key"
#   - Check: ✓ Geocoding API
#   - Check: ✓ Places API
#   - Uncheck all others
#
# Click "SAVE"
```

### 2. Strengthen Database Password (2 minutes)

```bash
# Generate a strong password
openssl rand -base64 32

# Or use this command:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Update your .env:
# DATABASE_URL=mysql://root:YOUR_STRONG_PASSWORD_HERE@localhost:3306/food_map
```

---

## 🛡️ RECOMMENDED: Add Input Validation

Add this to `/app/api/search/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { address, radius = 1000, type = 'restaurant' } = body

    // Validate address
    if (!address) {
      return NextResponse.json(
        { error: '請提供地址' },
        { status: 400 }
      )
    }

    // NEW: Validate address length
    if (address.length > 500) {
      return NextResponse.json(
        { error: '地址過長' },
        { status: 400 }
      )
    }

    // NEW: Validate radius
    const MAX_RADIUS = 50000 // 50km
    const MIN_RADIUS = 100   // 100m

    if (radius < MIN_RADIUS || radius > MAX_RADIUS) {
      return NextResponse.json(
        { error: \`搜尋半徑必須在 \${MIN_RADIUS}-\${MAX_RADIUS} 公尺之間\` },
        { status: 400 }
      )
    }

    // NEW: Validate type
    const VALID_TYPES = ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'bar', 'all']
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: '無效的搜尋類型' },
        { status: 400 }
      )
    }

    // Rest of your code...
```

---

## 🔒 OPTIONAL: Add Rate Limiting

### Simple Rate Limiting (No external dependencies)

Create `/app/middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/search')) {
    const ip = request.ip || 'anonymous'
    const now = Date.now()
    const limit = 10 // 10 requests
    const window = 60000 // per 60 seconds

    const userLimit = rateLimit.get(ip)

    if (userLimit && now < userLimit.resetTime) {
      if (userLimit.count >= limit) {
        return NextResponse.json(
          { error: '請求過於頻繁，請稍後再試' },
          { status: 429 }
        )
      }
      userLimit.count++
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + window })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## ✅ After Applying Fixes

Run these checks:

```bash
# 1. Verify .env is not tracked
git status | grep .env
# Should output: nothing

# 2. Test API with new key
npm run dev
# Visit http://localhost:3000 and search

# 3. Run security audit
npm audit

# 4. Check for vulnerabilities
npm audit fix
```

---

## 📋 Production Deployment Checklist

Before deploying:

- [ ] New Google API key with restrictions
- [ ] Strong database password
- [ ] Update `.env` variables on hosting platform
- [ ] Enable HTTPS
- [ ] Test search functionality
- [ ] Monitor API usage
- [ ] Set up error logging
- [ ] Configure CORS if needed

---

## 🆘 If Key Was Already Abused

If you notice suspicious API usage:

```bash
# 1. Immediately delete the exposed key
# 2. Create a new key with strict restrictions
# 3. Check Google Cloud billing for unexpected charges
# 4. Set up billing alerts in Google Cloud Console
```

---

## 📞 Need Help?

- Google API Key Security: https://cloud.google.com/docs/authentication/api-keys
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Report issues: https://github.com/anthropics/claude-code/issues
