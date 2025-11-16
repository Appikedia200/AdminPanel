# GlowNatura Admin Panel - Deployment Guide

## Overview

This guide provides detailed instructions for deploying the GlowNatura Admin Panel to Cloudflare Pages.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Cloudflare account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)
- Backend API deployed and accessible

## Pre-Deployment Checklist

### 1. Code Quality Check

Ensure all quality gates pass before deployment:

```bash
# Check TypeScript errors
npm run type-check

# Check ESLint
npm run lint

# Format code
npm run format

# Build locally
npm run build
```

All commands should pass with zero errors.

### 2. Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_URL=https://glownatura-backend.onrender.com
NEXT_PUBLIC_APP_NAME=GlowNatura Admin
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

For production, these will be set in Cloudflare Pages dashboard.

## Deployment Options

### Option 1: Automatic Deployment via GitHub (Recommended)

This is the easiest and most reliable method.

#### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Initial commit: GlowNatura Admin Panel"
git push origin main
```

#### Step 2: Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** > **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select your repository: `AdminGlowNaturas`
7. Configure build settings:

**Build Configuration:**
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/`
- **Environment variables:**
  ```
  NEXT_PUBLIC_API_URL=https://glownatura-backend.onrender.com
  NEXT_PUBLIC_APP_NAME=GlowNatura Admin
  NEXT_PUBLIC_APP_URL=https://your-admin-url.pages.dev
  ```

8. Click **Save and Deploy**

Cloudflare Pages will automatically:
- Install dependencies
- Build the project
- Deploy to a global CDN
- Provide a unique `.pages.dev` URL

#### Step 3: Automatic Deployments

Every push to the `main` branch will trigger an automatic deployment.

For preview deployments:
- Create a new branch
- Push changes
- Cloudflare creates a preview URL automatically

### Option 2: Manual Deployment via Wrangler CLI

For manual or CI/CD deployments.

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Authenticate

```bash
wrangler login
```

This opens a browser window for authentication.

#### Step 3: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name=glownatura-admin
```

#### Step 4: Set Environment Variables

```bash
wrangler pages secrets put NEXT_PUBLIC_API_URL
wrangler pages secrets put NEXT_PUBLIC_APP_NAME
wrangler pages secrets put NEXT_PUBLIC_APP_URL
```

You'll be prompted to enter values for each variable.

## Custom Domain Setup

### Step 1: Add Custom Domain

1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `admin.glownatura.com`)
5. Click **Continue**

### Step 2: DNS Configuration

If your domain is on Cloudflare:
- DNS records are added automatically
- SSL certificate is provisioned automatically

If your domain is elsewhere:
1. Add a CNAME record:
   - **Name:** `admin`
   - **Value:** `your-project.pages.dev`
2. Wait for DNS propagation (can take up to 48 hours)

### Step 3: SSL Certificate

Cloudflare automatically provisions and renews SSL certificates for custom domains.

## Post-Deployment Verification

### 1. Check Deployment Status

```bash
# Via Wrangler
wrangler pages deployments list --project-name=glownatura-admin

# Or check Cloudflare Dashboard
```

### 2. Test the Deployment

Visit your deployment URL and verify:

- [ ] Application loads correctly
- [ ] Login page displays
- [ ] Can log in with valid credentials
- [ ] Dashboard displays after login
- [ ] Navigation works (sidebar links)
- [ ] API calls succeed
- [ ] Images load correctly
- [ ] Responsive design works (test on mobile)
- [ ] No console errors in browser DevTools

### 3. Performance Check

Use [PageSpeed Insights](https://pagespeed.web.dev/) or [WebPageTest](https://www.webpagetest.org/):

- Performance score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Cumulative Layout Shift < 0.1

### 4. Security Check

- [ ] HTTPS is enforced
- [ ] No API credentials in client-side code
- [ ] Authentication redirects work
- [ ] Protected routes require login

## Rollback Procedure

If a deployment fails or has issues:

### Via Cloudflare Dashboard

1. Go to **Workers & Pages** > Your project
2. Click **Deployments**
3. Find the last working deployment
4. Click **...** > **Rollback to this deployment**

### Via Wrangler CLI

```bash
# List deployments
wrangler pages deployments list --project-name=glownatura-admin

# Rollback to specific deployment
wrangler pages deployments rollback <DEPLOYMENT_ID> --project-name=glownatura-admin
```

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_APP_NAME: GlowNatura Admin
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy out --project-name=glownatura-admin
```

Add secrets in GitHub repository settings:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_API_URL`

## Monitoring

### Cloudflare Analytics

Cloudflare Pages provides built-in analytics:
- Page views
- Unique visitors
- Bandwidth usage
- Request counts
- Geographic distribution

Access via: Dashboard > Your Project > Analytics

### Error Tracking

Monitor browser console errors:
1. Open browser DevTools
2. Check Console tab for errors
3. Monitor Network tab for failed requests

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user tracking

## Troubleshooting

### Build Fails

**Problem:** Build command fails

**Solutions:**
1. Check build logs in Cloudflare dashboard
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript compilation passes locally
4. Check for environment variable issues

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run type-check
```

### API Calls Fail

**Problem:** API requests return errors

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` environment variable
2. Check CORS settings on backend
3. Verify backend is accessible from Cloudflare network
4. Check browser DevTools Network tab

### Authentication Issues

**Problem:** Cannot log in or session expires immediately

**Solutions:**
1. Check cookie settings (SameSite, Secure, Domain)
2. Verify backend JWT configuration
3. Check browser console for auth errors
4. Ensure middleware is properly configured

### Slow Performance

**Problem:** Pages load slowly

**Solutions:**
1. Check bundle size: `npm run build`
2. Optimize images (use Cloudflare Images)
3. Enable caching headers
4. Use route-based code splitting

## Maintenance

### Regular Updates

1. **Dependencies:**
   ```bash
   npm outdated
   npm update
   ```

2. **Security patches:**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Next.js updates:**
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```

### Backup Strategy

- Source code: GitHub/Git repository
- Environment variables: Document in secure location
- Database: Backend handles this

### Scaling

Cloudflare Pages automatically scales:
- Global CDN with 300+ locations
- Unlimited bandwidth
- No server management required
- Built-in DDoS protection

## Cost Optimization

Cloudflare Pages Free Tier includes:
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 1 concurrent build

For production:
- Consider Cloudflare Pro plan ($20/month) for enhanced performance
- Use Cloudflare Images for image optimization
- Enable caching for static assets

## Support

### Cloudflare Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Discord Server](https://discord.gg/cloudflaredev)

### Project Support

- Check project README.md
- Review code documentation
- Contact project maintainers

## Conclusion

This deployment guide ensures a smooth, professional deployment of the GlowNatura Admin Panel to Cloudflare Pages. Follow the steps carefully and perform thorough testing before directing users to the production URL.

**Next Steps:**
1. Deploy to production
2. Set up monitoring
3. Configure custom domain
4. Train admin users
5. Monitor performance and errors

