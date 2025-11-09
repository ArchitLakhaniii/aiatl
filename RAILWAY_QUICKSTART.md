# 🚂 Railway Quick Start

Deploy your full-stack AIATL app to Railway in 5 minutes!

## 🚀 One-Command Deploy

```bash
./deploy-railway.sh
```

This script will:
1. ✅ Install Railway CLI
2. ✅ Login to Railway
3. ✅ Initialize project
4. ✅ Set environment variables
5. ✅ Deploy your app

---

## 📋 Manual Setup (3 Steps)

### Step 1: Install & Login

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login
```

### Step 2: Set Environment Variables

```bash
# Required
railway variables set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/aiatl"
railway variables set SECRET_KEY="your-secret-key-min-32-characters"
railway variables set GEMINI_API_KEY="your-gemini-api-key"

# Optional (defaults are set)
railway variables set ALGORITHM="HS256"
railway variables set ACCESS_TOKEN_EXPIRE_MINUTES="30"
railway variables set PYTHON_VERSION="3.11"
railway variables set NODE_VERSION="20"
```

### Step 3: Deploy

```bash
railway up
```

That's it! 🎉

---

## 🔗 Get Your App URL

```bash
# Open Railway dashboard
railway open

# Your app will be at:
# https://your-app-name-production.up.railway.app
```

---

## 📊 View Logs

```bash
railway logs
```

---

## 💾 MongoDB Setup

### Option 1: Railway MongoDB (Easiest)

1. In Railway dashboard, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway creates MongoDB and sets `MONGODB_URI` automatically
3. Done! ✨

### Option 2: MongoDB Atlas (Free Tier Available)

1. Create cluster: https://cloud.mongodb.com/
2. Create database user
3. Network Access → Add IP: `0.0.0.0/0`
4. Get connection string
5. Set in Railway: `railway variables set MONGODB_URI="your-connection-string"`

---

## 🎯 Architecture

```
Railway Service
├── Backend API (FastAPI + Python) → Port 8000
├── Frontend (React + Vite) → Static files
└── MongoDB (Railway or Atlas)
```

Your app serves both frontend and backend from one Railway service!

---

## ⚙️ Configuration Files

All these files are already configured for you:

- ✅ `railway.json` - Railway service config
- ✅ `railway.toml` - Build/deploy settings  
- ✅ `nixpacks.toml` - Nixpacks builder config
- ✅ `Procfile` - Start command
- ✅ `Dockerfile.railway` - Docker config (alternative)

---

## 💰 Cost

- **Free Tier**: $5 credit/month (~500 hours)
- **Pro**: $20/month (unlimited hours)
- **Tip**: Enable sleep mode for dev to save credits

---

## 🆘 Troubleshooting

### Build fails?
```bash
railway logs
```

### Can't connect to MongoDB?
Check MongoDB Atlas Network Access allows `0.0.0.0/0`

### Port issues?
Railway automatically sets `$PORT` - no config needed!

---

## 📚 Full Documentation

See **`RAILWAY_SETUP.md`** for:
- Advanced configuration
- Multiple services setup
- Custom domains
- Continuous deployment
- And more!

---

## 🎉 You're Done!

Your app is live at: `https://your-app.railway.app`

Need help? Check logs with `railway logs` or see full docs in `RAILWAY_SETUP.md`
