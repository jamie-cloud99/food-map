# Security Notes

## ⚠️ IMPORTANT: Protect Your API Keys

### Current Security Status

✅ `.env` is in `.gitignore` - Your API keys won't be committed to git
✅ `.env.example` has placeholder values only
✅ API keys should only be in your local `.env` file

### Best Practices

1. **Never commit `.env` to git**
   - It's already in `.gitignore`, but double-check before committing

2. **If you accidentally exposed your API key:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Delete the exposed key immediately
   - Create a new API key
   - Update your `.env` file with the new key

3. **For production deployment:**
   - Use environment variables on your hosting platform (Vercel, Netlify, etc.)
   - Never hardcode API keys in your code
   - Consider using API key restrictions:
     - HTTP referrer restrictions (for web apps)
     - IP address restrictions (for servers)

4. **API Key Restrictions (Recommended):**
   - Go to Google Cloud Console > Credentials
   - Edit your API key
   - Under "Application restrictions":
     - Development: Use "None" or add `http://localhost:3000/*`
     - Production: Add your domain (e.g., `https://yourdomain.com/*`)
   - Under "API restrictions":
     - Restrict to: Geocoding API, Places API

## Database Credentials

The `.env` file also contains database credentials. Keep these secure:
- Never use default passwords like "password" or "123456"
- Use strong, unique passwords
- Consider using a password manager

## Questions?

If you're unsure about security, check:
- https://cloud.google.com/docs/authentication/api-keys
- https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
