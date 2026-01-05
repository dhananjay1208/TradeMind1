# TradeMind Deployment Guide

## Quick Start (Development)

```bash
# Start the development server
npm run dev

# Open your browser
http://localhost:3000
```

---

## Production Deployment to Vercel (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. Supabase project (already configured)

### Step-by-Step Deployment

#### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TradeMind Phase 1 MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/trademind.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your TradeMind repository
5. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

6. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hjibkptyxbjnkyzoavtl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaWJrcHR5eGJqbmt5em9hdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTk0NTQsImV4cCI6MjA3Njk3NTQ1NH0.7NbuwSJdE84WLyTSeOGgpGtO6MpC4ZlaU8bLc9hWIHM
   ```

7. Click "Deploy"
8. Wait 2-3 minutes for build to complete
9. Your app will be live at `https://trademind-xxx.vercel.app`

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? trademind
# - In which directory is your code located? ./
# - Want to override the settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

---

## Alternative: Deploy to Netlify

### Step-by-Step

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables in Site Settings
6. Click "Deploy site"

---

## Database Configuration (Supabase)

### Your database is already set up! But to verify:

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Open your project: `hjibkptyxbjnkyzoavtl`
3. Verify tables exist:
   - ✅ profiles
   - ✅ trading_rules
   - ✅ trading_days
   - ✅ trades
   - ✅ quotes
   - ✅ weekly_reviews
   - ✅ monthly_reviews
   - ✅ trade_screenshots

4. Verify Row Level Security (RLS) is enabled on all tables

5. **Important:** Run the database migration for auto-updating stats:

```sql
-- Go to SQL Editor in Supabase and run:
-- File: supabase/migrations/20260104_update_trading_day_stats_function.sql

-- This creates the function that automatically updates
-- trading day statistics when trades change
```

---

## Post-Deployment Checklist

### After your app is live:

- [ ] Test signup flow
- [ ] Complete onboarding
- [ ] Add a test trade
- [ ] Check dashboard updates in real-time
- [ ] Test calendar view
- [ ] Test analytics dashboard
- [ ] Test settings updates
- [ ] Test theme toggle
- [ ] Test on mobile device
- [ ] Verify all CRUD operations work

---

## Custom Domain Setup (Optional)

### On Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `trademind.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)
5. Vercel automatically provisions SSL certificate

### DNS Records to Add:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Environment Variables Explained

| Variable | Purpose | Value |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Your project URL from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Your anon key from Supabase dashboard |

**Note:** The `NEXT_PUBLIC_` prefix makes these variables accessible in the browser. This is safe because:
- The anon key is meant to be public
- Row Level Security (RLS) protects your data
- Users can only access their own data

---

## Monitoring & Analytics (Optional)

### Add Vercel Analytics

1. Go to your project on Vercel
2. Navigate to Analytics tab
3. Enable Web Analytics
4. No code changes needed!

### Add Google Analytics (Optional)

1. Get GA4 tracking ID
2. Add to `src/app/layout.tsx`:

```tsx
import Script from 'next/script'

// Add inside <head> or <body>
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## Performance Optimization

### Already Implemented:
- ✅ Static page generation where possible
- ✅ Image optimization via Next.js Image component
- ✅ Code splitting via Next.js App Router
- ✅ CSS optimization via Tailwind
- ✅ Lazy loading of components
- ✅ Real-time subscriptions (efficient)

### Additional Optimizations:
```bash
# Enable experimental features in next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
}
```

---

## Troubleshooting

### Build Fails on Vercel

**Issue:** Environment variables not set
**Solution:** Add environment variables in Vercel dashboard

**Issue:** TypeScript errors
**Solution:** Run `npm run build` locally first to catch errors

### Database Connection Issues

**Issue:** 401 Unauthorized errors
**Solution:** Verify Supabase URL and anon key are correct

**Issue:** RLS policy errors
**Solution:** Check Row Level Security policies in Supabase

### Real-time Subscriptions Not Working

**Issue:** Trades don't update live
**Solution:**
1. Check Supabase Realtime is enabled for trades table
2. Verify RLS policies allow SELECT for authenticated users

---

## Security Best Practices

### ✅ Already Implemented:
- Row Level Security on all tables
- Authentication required for all routes
- Input validation on all forms
- HTTPS enforced (via Vercel)
- Environment variables for sensitive data

### Additional Security:
1. **Rate Limiting:** Consider adding rate limiting for API calls
2. **CSRF Protection:** Built into Next.js
3. **XSS Protection:** React escapes by default

---

## Backup & Recovery

### Database Backups (Supabase)

Supabase Pro plan includes:
- Daily automated backups
- Point-in-time recovery
- Manual backups available

**To create manual backup:**
1. Go to Supabase Dashboard → Database → Backups
2. Click "Download Backup"

### Code Backups

Your code is backed up on GitHub automatically with each push.

---

## Scaling Considerations

### Current Setup Handles:
- Up to 50,000 monthly active users (Vercel free tier)
- Up to 500 MB database (Supabase free tier)
- Up to 2 GB bandwidth (Supabase free tier)

### When to Upgrade:

**Vercel Pro ($20/mo):**
- More than 50K MAU
- Need for team collaboration
- Advanced analytics

**Supabase Pro ($25/mo):**
- More than 500 MB database
- More than 2 GB bandwidth
- Daily backups needed
- Priority support

---

## Support & Maintenance

### Regular Maintenance:
1. **Weekly:** Check error logs in Vercel
2. **Monthly:** Review database usage in Supabase
3. **Quarterly:** Update dependencies (`npm update`)

### Dependency Updates:
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest
```

---

## Success Metrics to Track

After deployment, monitor:

1. **User Engagement:**
   - Daily active users
   - Onboarding completion rate
   - Average trades logged per user

2. **Performance:**
   - Page load times
   - Time to first byte (TTFB)
   - Core Web Vitals

3. **Technical:**
   - Error rates
   - API response times
   - Database query performance

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Your TradeMind app is ready to go live! 🚀**

Simply follow the steps above and you'll have a production-ready trading discipline tracker deployed in minutes.
