# 🚀 Cloudflare Pages Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables Configuration**

In Cloudflare Pages Dashboard → Settings → Environment Variables, add:

#### **Production Environment:**
```
NEXT_PUBLIC_API_URL = https://backendglownaturas.onrender.com
NEXT_PUBLIC_ADMIN_URL = https://glownatura-admin.pages.dev
NODE_ENV = production
NODE_VERSION = 22.16.0
```

#### **Preview Environment (Optional):**
```
NEXT_PUBLIC_API_URL = https://backendglownaturas.onrender.com
NEXT_PUBLIC_ADMIN_URL = https://preview.glownatura-admin.pages.dev
NODE_ENV = development
NODE_VERSION = 22.16.0
```

---

## 📦 Deployment Methods

### Method 1: **Automatic Deployment via GitHub (RECOMMENDED)**

1. **Connect Repository:**
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose your GitHub repository: `Appikedia200/AdminPanel`

2. **Build Configuration:**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: (leave empty - auto-detected)
   Root directory: (leave empty)
   ```

3. **Environment Variables:**
   - Add all variables listed above
   - Click "Save and Deploy"

4. **Auto-Deploy:**
   - Every push to `main` branch triggers automatic deployment
   - Preview deployments created for pull requests

---

### Method 2: **Manual Deployment via Wrangler CLI**

⚠️ **Note:** This requires `wrangler` to be installed. For GitHub auto-deploy, skip this method.

```bash
# Install wrangler globally (one-time)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy .next
```

---

## 🔧 Build Process

### What Happens During Build:

1. **Dependencies Install:**
   ```bash
   npm clean-install
   ```

2. **Next.js Build:**
   ```bash
   npm run build
   ```
   - Compiles TypeScript
   - Runs ESLint checks
   - Generates static pages
   - Creates server-side rendering bundle

3. **Output:**
   - `.next/` directory contains the production build
   - Cloudflare Pages automatically serves this

---

## ✅ Post-Deployment Verification

### 1. **Check Build Logs:**
   - Cloudflare dashboard → Deployments → View build log
   - Ensure no errors
   - Verify all environment variables loaded

### 2. **Test Production Site:**
   ```
   ✓ Visit https://glownatura-admin.pages.dev
   ✓ Test registration flow
   ✓ Test email verification (GET request)
   ✓ Test login flow
   ✓ Test dashboard access
   ✓ Verify API calls go to Render backend
   ✓ Check browser console for errors
   ```

### 3. **Verify API Connectivity:**
   - Open browser DevTools → Network tab
   - All API requests should target: `https://backendglownaturas.onrender.com`
   - No CORS errors
   - Successful responses

---

## 🐛 Troubleshooting

### **Issue: Build Fails with "wrangler: not found"**
**Solution:** Use automatic GitHub deployment (Method 1) instead of manual CLI deployment.

### **Issue: Environment Variables Not Working**
**Solution:** 
1. Verify variables in Cloudflare dashboard
2. Redeploy (environment changes don't auto-apply)
3. Check build logs for variable loading

### **Issue: API Calls Go to `undefined` or `localhost`**
**Solution:**
1. Ensure `NEXT_PUBLIC_API_URL` is set in Cloudflare
2. Redeploy after adding environment variables
3. Clear browser cache and retry

### **Issue: CORS Errors**
**Solution:**
1. Update backend's `ADMIN_URL` environment variable to match Cloudflare URL
2. Ensure backend allows `https://glownatura-admin.pages.dev` origin
3. Check backend CORS configuration

### **Issue: "Module not found: Can't resolve 'fs'"**
**Solution:** Already fixed in `next.config.mjs` with webpack fallback configuration.

### **Issue: Email Verification Fails**
**Solution:** 
1. Verify endpoint uses GET (not POST) - Already fixed
2. Check backend is accessible from Cloudflare
3. Verify token is passed as query parameter

---

## 📊 Performance Optimization

### Already Implemented:
- ✅ Image optimization disabled (Cloudflare handles it)
- ✅ Console.log removal in production
- ✅ React Strict Mode enabled
- ✅ Powered-by header disabled (security)
- ✅ Webpack optimized for client-side

### Recommended:
- Monitor Cloudflare Analytics
- Enable Cloudflare CDN caching
- Use Cloudflare Image Optimization for Cloudinary images

---

## 🔒 Security Checklist

- ✅ Environment variables not committed to Git
- ✅ `.env.local` in `.gitignore`
- ✅ HTTPS enforced by Cloudflare
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ API keys never exposed to client
- ✅ TypeScript strict mode enabled
- ✅ ESLint errors fail build

---

## 📝 Local Development Setup

1. **Create `.env.local`:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure local environment:**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
   NODE_ENV=development
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access locally:**
   ```
   http://localhost:3001
   ```

---

## 🎯 Production URLs

| Environment | URL |
|------------|-----|
| **Production Admin Panel** | https://glownatura-admin.pages.dev |
| **Backend API** | https://backendglownaturas.onrender.com |
| **Preview Deployments** | https://[branch].glownatura-admin.pages.dev |

---

## 🚨 Important Notes

1. **Never commit `.env` or `.env.local`** - They contain sensitive data
2. **Always use `NEXT_PUBLIC_` prefix** for client-side environment variables
3. **Cloudflare auto-deploys** on every push to `main` branch
4. **Preview deployments** created automatically for pull requests
5. **Node.js version** locked to `22.16.0` in `.node-version`

---

## ✅ Deployment Status

- [x] Environment variables configured
- [x] Build process optimized
- [x] Security hardened
- [x] Performance optimized
- [x] Auto-deployment enabled
- [x] CORS configured
- [x] Email verification fixed (GET method)
- [x] TypeScript strict mode
- [x] ESLint enabled

---

**🎉 Ready for Production Deployment!**

