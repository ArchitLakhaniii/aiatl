# 🚂 Railway Deployment Guide

Complete guide to deploy your AIATL application on Railway.

## 🎯 What Railway Offers

- **Free Tier**: $5/month credit (500 execution hours)
- **Automatic HTTPS**: SSL certificates included
- **MongoDB**: Can be added as a service
- **Full-Stack Support**: Frontend + Backend in one project
- **Git Integration**: Auto-deploy on push

---

## 📋 Prerequisites

1. Railway account: https://railway.app/
2. GitHub repository connected
3. MongoDB Atlas account (or use Railway's MongoDB)

---

## 🚀 Quick Deploy (Method 1: One-Click)

### Option A: Deploy Button

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ArchitLakhaniii/aiatl)

### Option B: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## 🛠️ Manual Setup (Method 2: Dashboard)

### Step 1: Create New Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `aiatl` repository
5. Railway will auto-detect the configuration

### Step 2: Configure Backend Service

Railway will create a service automatically. Configure it:

1. **Environment Variables** (click on your service → Variables):

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aiatl?retryWrites=true&w=majority

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Python/Node Versions
PYTHON_VERSION=3.11
NODE_VERSION=20

# Port (Railway sets this automatically)
PORT=${{PORT}}

# Frontend URL (update after frontend deployment)
FRONTEND_URL=https://your-frontend.railway.app

# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

2. **Build Configuration**:
   - Railway auto-detects from `nixpacks.toml`
   - Build Command: `npm install && npm run build && pip install -r requirements.txt`
   - Start Command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`

### Step 3: Add MongoDB (Optional)

If you want Railway-hosted MongoDB:

1. In your project, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway will create a MongoDB instance
3. Copy the connection string from the MongoDB service variables
4. Add it to your backend service as `MONGODB_URI`

**OR** use MongoDB Atlas:
- Create cluster at https://cloud.mongodb.com/
- Whitelist Railway IPs: `0.0.0.0/0` (for simplicity) or specific Railway IPs
- Copy connection string

### Step 4: Deploy Frontend (Static Site)

Railway can serve your frontend as static files:

1. In your project, click **"New"** → **"Empty Service"**
2. Name it "frontend"
3. Connect the same GitHub repo
4. **Settings**:
   - Root Directory: `/`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l $PORT`

5. **Environment Variables**:
```bash
NODE_VERSION=20
VITE_API_URL=https://your-backend-service.railway.app
```

### Step 5: Generate Domain

1. Go to your backend service → **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `aiatl-backend-production.up.railway.app`)
4. Update frontend's `VITE_API_URL` with this domain
5. Repeat for frontend service

---

## 🔧 Alternative: Single Service Deployment

Deploy backend and serve frontend from the same service:

### Update backend/app.py:

```python
from fastapi.staticfiles import StaticFiles
import os

# ... existing code ...

# Serve frontend static files
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")
```

### Railway Configuration:

**Build Command:**
```bash
npm install && npm run build && pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

This serves both API and frontend from one Railway service!

---

## 📊 Cost Estimation

### Free Tier
- **$5 credit/month** = ~500 hours
- 1 service running 24/7 = 720 hours/month
- **Recommendation**: Use sleep mode for dev

### Pro Plan ($20/month)
- Unlimited execution hours
- Priority support
- Custom domains
- More resources

### With MongoDB Atlas:
- Railway: Free tier or $20/month
- MongoDB M0 (Free): 512MB storage
- MongoDB M10 ($57/month): Production-ready

---

## 🔐 Environment Variables Checklist

Copy this list to Railway Dashboard → Service → Variables:

```bash
# Required
MONGODB_URI=your-mongodb-connection-string
SECRET_KEY=your-secret-key-min-32-chars
GEMINI_API_KEY=your-gemini-api-key

# Optional
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PYTHON_VERSION=3.11
NODE_VERSION=20
FRONTEND_URL=https://your-frontend.railway.app
```

---

## 🧪 Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://your-backend.railway.app/health

# API test
curl https://your-backend.railway.app/api/listings
```

### Test Frontend:
Open: `https://your-frontend.railway.app`

---

## 🚨 Troubleshooting

### Build Fails

**Problem**: Python/Node version mismatch
**Solution**: Check `nixpacks.toml` has correct versions:
```toml
nixPkgs = ["nodejs_20", "python311", "python311Packages.pip"]
```

### Port Binding Error

**Problem**: Application not using Railway's PORT
**Solution**: Ensure start command uses `$PORT`:
```bash
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

### MongoDB Connection Fails

**Problem**: Railway can't connect to MongoDB Atlas
**Solution**: 
1. Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
2. Check connection string format
3. Ensure `retryWrites=true&w=majority` in connection string

### Frontend Can't Reach Backend

**Problem**: CORS errors
**Solution**: Check `backend/app.py` CORS settings:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.railway.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Service Crashes

**Problem**: Out of memory
**Solution**: 
1. Check logs: `railway logs`
2. Upgrade to Pro plan for more resources
3. Optimize your code (reduce memory usage)

---

## 📝 Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] MongoDB setup (Atlas or Railway)
- [ ] Environment variables configured
- [ ] Backend service deployed
- [ ] Frontend service deployed (or single service)
- [ ] Custom domain configured (optional)
- [ ] Health check passing
- [ ] API endpoints tested
- [ ] Frontend loads correctly
- [ ] Authentication working
- [ ] Database queries working

---

## 🎯 Railway CLI Commands

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open dashboard
railway open

# Add environment variable
railway variables set MONGODB_URI=your-uri

# Deploy
railway up

# Run command in Railway environment
railway run npm start

# SSH into service
railway shell
```

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

1. **Main Branch**: Auto-deploys to production
2. **Pull Requests**: Creates preview deployments
3. **Rollback**: Easy rollback from dashboard

### Configure Auto-Deploy:
1. Go to Service → Settings → Deploy
2. Enable "Automatic Deployments"
3. Choose branch (e.g., `main`)
4. Set deploy conditions (optional)

---

## 🌐 Custom Domain

### Add Custom Domain:

1. Go to Service → Settings → Networking
2. Click "Custom Domain"
3. Enter your domain (e.g., `api.aiatl.com`)
4. Add DNS records to your domain provider:

```
Type: CNAME
Name: api (or your subdomain)
Value: your-service.railway.app
```

5. Wait for DNS propagation (up to 48 hours)

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app/
- **Railway Templates**: https://railway.app/templates
- **Community Discord**: https://discord.gg/railway
- **Railway Blog**: https://blog.railway.app/

---

## 🎉 Quick Start Summary

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and initialize
railway login
railway init

# 3. Set environment variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set SECRET_KEY="your-secret-key"
railway variables set GEMINI_API_KEY="your-gemini-key"

# 4. Deploy
railway up

# 5. View deployment
railway open
```

---

## 💡 Pro Tips

1. **Use Railway's PostgreSQL/MongoDB** for simpler setup
2. **Enable automatic deployments** from GitHub
3. **Use environment groups** for dev/staging/prod
4. **Set up monitoring** with Railway's built-in tools
5. **Use sleep mode** to save credits in free tier
6. **Check logs regularly** with `railway logs`
7. **Use private networking** between services for better security

---

## 🆘 Need Help?

- Check logs: `railway logs`
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app/
- GitHub Issues: Your repository issues page

---

**Your Railway deployment is ready!** 🚀

Deploy with: `railway up` or push to GitHub for auto-deployment.
