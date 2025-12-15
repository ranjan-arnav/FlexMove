# FlexMove - Netlify Deployment Guide

## Quick Fix Steps

### 1. Install Netlify Next.js Plugin

In your Netlify dashboard:
1. Go to **Site Settings** → **Build & Deploy** → **Build Settings**
2. Add build command: `npm run build`
3. Set publish directory: `.next`

### 2. Install the Plugin

In your Netlify site, go to **Plugins** and install:
- **Essential Next.js Plugin** (by Netlify)

### 3. Set Environment Variables

In Netlify dashboard → **Site Settings** → **Environment Variables**, add:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
RESEND_API_KEY=your_resend_api_key
```

### 4. Deploy

Push the updated code:
```bash
git add netlify.toml next.config.mjs
git commit -m "Add Netlify configuration"
git push origin main
```

Netlify will auto-deploy!

## Common Issues & Solutions

### Issue: "Page not found" or 404 errors
**Solution:** The `netlify.toml` file handles this with redirects

### Issue: "Build failed"
**Solution:** Check Netlify build logs for specific errors. Common fixes:
- Ensure all environment variables are set
- Check that `package.json` has correct build script

### Issue: "Function timeout"
**Solution:** Netlify has 10s timeout for serverless functions. For long operations, consider:
- Using Netlify Background Functions
- Optimizing API calls

### Issue: "Environment variables not working"
**Solution:** 
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables

## Files Created

- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.mjs` - Updated with `output: 'standalone'`

## Next Steps

1. Commit and push these changes
2. Netlify will automatically redeploy
3. Check deployment logs in Netlify dashboard
4. Test your site!

If you still have issues, share the Netlify build logs and I can help debug further.
