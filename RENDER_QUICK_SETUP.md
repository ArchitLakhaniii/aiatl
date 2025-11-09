# Quick Setup Guide for Render

## 🚀 Backend Service Setup

### If Using Docker (Recommended)

1. **Environment**: Select `Docker`
2. **Dockerfile Path**: `backend/Dockerfile`
3. **Docker Context**: `backend`
4. **Build Command**: Leave empty
5. **Start Command**: Leave empty

### If Using Build/Start Commands

1. **Environment**: Select `Python 3`
2. **Root Directory**: `backend`
3. **Build Command**: 
   ```bash
   pip install -r requirements.txt
   ```
4. **Start Command**: 
   ```bash
   uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
5. **Python Version**: `3.11.0`

⚠️ **Important**: 
- The start command shown in your image (`gunicorn your_application.wsgi`) is for Django/Flask
- For FastAPI, use `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Make sure **Root Directory** is set to `backend`

## 🎨 Frontend Service Setup

### If Using Docker (Recommended)

1. **Environment**: Select `Docker`
2. **Dockerfile Path**: `frontend/Dockerfile`
3. **Docker Context**: `frontend`
4. **Build Command**: Leave empty
5. **Start Command**: Leave empty

### If Using Build/Start Commands

1. **Environment**: Select `Node`
2. **Root Directory**: `frontend`
3. **Build Command**: 
   ```bash
   npm ci --prefer-offline --no-audit && npm run build
   ```
4. **Start Command**: 
   ```bash
   npx serve -s dist -l $PORT
   ```
5. **Node Version**: `20`

## 🔑 Required Environment Variables

### Backend
```
MONGODB_URI=your-mongodb-connection-string
DB_NAME=flashrequest
JWT_SECRET=your-jwt-secret-min-32-chars
GEMINI_SERVICE_URL=your-gemini-service-url
ENVIRONMENT=production
CORS_ALLOW_ORIGINS=https://aiatl-frontend.onrender.com
```

### Frontend
```
VITE_API_BASE_URL=https://aiatl-backend.onrender.com
```

## 📝 Step-by-Step for Backend (Build/Start Commands)

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Fill in the form:
   - **Name**: `aiatl-backend`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Click **Advanced** and set Python Version to `3.11.0`
5. Add environment variables (see above)
6. Click **Create Web Service**

## 📝 Step-by-Step for Frontend (Build/Start Commands)

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository (same repo)
3. Fill in the form:
   - **Name**: `aiatl-frontend`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT**
   - **Environment**: `Node`
   - **Build Command**: `npm ci --prefer-offline --no-audit && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
4. Click **Advanced** and set Node Version to `20`
5. Add environment variable: `VITE_API_BASE_URL=https://aiatl-backend.onrender.com`
6. Click **Create Web Service**

## ✅ Verification

After deployment:

1. **Backend**: Visit `https://aiatl-backend.onrender.com/health`
   - Should return: `{"status":"ok",...}`

2. **Frontend**: Visit `https://aiatl-frontend.onrender.com`
   - Should show your React app

3. **Update CORS**: 
   - Go to backend service → Environment
   - Set `CORS_ALLOW_ORIGINS` to your frontend URL
   - Save (triggers redeploy)

## 🐛 Common Issues

### "Module not found" error
- **Solution**: Make sure **Root Directory** is set to `backend` (not empty)

### "Port binding failed"
- **Solution**: Use `$PORT` in start command (Render sets this automatically)

### "gunicorn: command not found"
- **Solution**: You're using the wrong start command. Use `uvicorn app:app --host 0.0.0.0 --port $PORT` for FastAPI

### "npm: command not found"
- **Solution**: Make sure Environment is set to `Node` (not Python)

## 💡 Recommendation

**Use Docker deployment** - it's simpler and more reliable:
- No need to set build/start commands
- Consistent environment
- Better for production

Just select **Docker** as environment and specify the Dockerfile path.

