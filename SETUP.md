# Food Map Setup Guide

## Google API Setup

Your API is returning errors because required APIs need to be enabled in Google Cloud Console.

### 1. Enable Required APIs

Go to Google Cloud Console and enable these APIs:

1. **Geocoding API**:
   - https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com
   - Click "Enable"

2. **Places API**:
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com
   - Click "Enable"

3. **Maps JavaScript API** (optional, for advanced features):
   - https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   - Click "Enable"

### 2. Check API Key Restrictions

Go to: https://console.cloud.google.com/apis/credentials

Click on your API key and verify:

- **Application restrictions**:
  - For development: Set to "None"
  - For production: Set to "HTTP referrers" and add your domain

- **API restrictions**:
  - Select "Restrict key"
  - Check: Geocoding API, Places API, Maps JavaScript API

### 3. Enable Billing

Google requires billing to be enabled for these APIs (they offer a generous free tier):
- https://console.cloud.google.com/billing

**Free tier limits:**
- Geocoding API: $200 free credit/month
- Places API: $200 free credit/month

### 4. Environment Variables

Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
```

Then edit `.env` and replace `your_api_key_here` with your actual Google API key.

**IMPORTANT**: Never commit `.env` to git! It's already in `.gitignore`.

### 5. Test the Setup

```bash
npm run dev
```

Visit http://localhost:3000 and try searching for a location.

## Development Mode (Mock Data)

If you want to test the app without using the Google API, you can enable mock mode:

In `.env`, set:
```
USE_MOCK_DATA=true
```

This will use sample restaurant data instead of making real API calls.

## Troubleshooting

### Error: "REQUEST_DENIED"
- Make sure you've enabled the Geocoding API and Places API
- Check that billing is enabled on your Google Cloud project
- Verify your API key doesn't have restrictions blocking localhost

### Error: "Invalid src prop" (Image errors)
- This is already fixed in `next.config.ts`
- If you still see it, restart the dev server

### No restaurants found
- Try a different search location
- Increase the search radius
- Make sure the Places API is enabled
