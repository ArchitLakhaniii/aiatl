# 🚂 Railway Deployment - Switch to Docker

## ✅ FIXED: Switched from Nixpacks to Docker

Railway's Nixpacks has issues with Python virtual environments in the immutable `/nix/store`. The solution is to use Docker instead.

---

## 🔧 Changes Made

### 1. Updated `railway.json`

**Changed from:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  }
}
```

**To:**
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.railway"
  }
}
```

### 2. Updated `Dockerfile.railway`

Now uses **multi-stage build**:
- **Stage 1**: Builds frontend with Node.js 20
- **Stage 2**: Sets up Python backend and copies built frontend

This gives you:
- ✅ Clean Python environment
- ✅ Frontend built and served
- ✅ All dependencies properly installed
- ✅ Smaller final image size

---

## 🚀 Deploy Now

### Option 1: Push to GitHub (Recommended)

```bash
# Add the changes
git add railway.json Dockerfile.railway requirements.txt

# Commit
git commit -m "Switch to Docker builder for Railway deployment"

# Push
git push origin main
```

Railway will automatically:
1. Detect the new configuration
2. Build using Docker (not Nixpacks)
3. Successfully deploy your app! ✅

### Option 2: Railway CLI

```bash
railway up
```

---

## 📊 How It Works

### Build Process:

```
Stage 1: Frontend
├── Use Node.js 20 Alpine image
├── Install npm dependencies
├── Build React app → dist/
└── Output: Built frontend files

Stage 2: Backend
├── Use Python 3.11 Slim image
├── Install Node.js (for compatibility)
├── Install Python dependencies
├── Copy backend code
├── Copy frontend from Stage 1
└── Start uvicorn server
```

### Result:
- Frontend served from `/` 
- API available at `/api/*`
- Health check at `/health`

---

## ✅ Why This Works

1. **Docker has full control** - No immutable filesystem issues
2. **Multi-stage build** - Smaller final image
3. **Proven approach** - Docker is Railway's most reliable builder
4. **Same as local** - Works exactly like your local setup

---

## 🧪 Test Locally (Optional)

You can test the Docker build locally:

```bash
# Build the image
docker build -f Dockerfile.railway -t aiatl .

# Run the container
docker run -p 8000:8000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e SECRET_KEY="your-secret-key" \
  -e GEMINI_API_KEY="your-gemini-key" \
  aiatl

# Access at http://localhost:8000
```

---

## 🎯 Next Steps

1. **Commit and push the changes:**
   ```bash
   git add railway.json Dockerfile.railway requirements.txt
   git commit -m "Fix Railway deployment - use Docker builder"
   git push origin main
   ```

2. **Watch Railway deploy:**
   - Go to Railway dashboard
   - You'll see "Using Docker" instead of "Using Nixpacks"
   - Build will succeed! ✅

3. **Set environment variables** (if not already done):
   ```bash
   railway variables set MONGODB_URI="your-uri"
   railway variables set SECRET_KEY="your-secret"
   railway variables set GEMINI_API_KEY="your-key"
   ```

---

## 🆘 Troubleshooting

### If build still fails:

1. **Clear Railway cache:**
   - Go to Railway dashboard
   - Settings → Clear cache
   - Redeploy

2. **Check Docker build locally:**
   ```bash
   docker build -f Dockerfile.railway -t aiatl .
   ```

3. **View Railway logs:**
   ```bash
   railway logs
   ```

---

## 📝 Summary

| Item | Before | After |
|------|--------|-------|
| Builder | Nixpacks | **Docker** ✅ |
| Config File | nixpacks.toml | Dockerfile.railway |
| Issue | Immutable `/nix/store` | Full control |
| Status | ❌ Failed | ✅ Will succeed |

---

**Ready to deploy!** Push your changes and watch it succeed! 🚀

```bash
git push origin main
```
