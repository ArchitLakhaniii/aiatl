# Render Deployment Guide

This guide shows how to deploy the frontend and backend separately on Render.com.

## 📁 Project Structure

```
/
├── frontend/          # React frontend application
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
└── backend/           # Python FastAPI backend
    ├── app.py
    ├── requirements.txt
    ├── MLmodel/
    ├── Dockerfile
    └── entrypoint.sh
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend

1. **Go to Render Dashboard** → **New** → **Web Service**
2. **Connect your GitHub repository**
3. **Configure Backend Service:**

   **Option A: Using Docker (Recommended)**
   - **Name**: `aiatl-backend`
   - **Region**: `Oregon` (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
   - **Build Command**: (Leave empty - handled by Dockerfile)
   - **Start Command**: (Leave empty - handled by Dockerfile)

   **Option B: Using Build/Start Commands (Without Docker)**
   - **Name**: `aiatl-backend`
   - **Region**: `Oregon` (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: `3.11.0`

5. **Environment Variables**:
   ```
   MONGODB_URI=your-mongodb-connection-string
   DB_NAME=flashrequest
   JWT_SECRET=your-jwt-secret-min-32-chars
   GEMINI_SERVICE_URL=your-gemini-service-url
   ENVIRONMENT=production
   CORS_ALLOW_ORIGINS=https://aiatl-frontend.onrender.com
   ```

6. **Health Check Path**: `/health`

7. **Click "Create Web Service"**

8. **Wait for deployment** and copy the backend URL (e.g., `https://aiatl-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Go to Render Dashboard** → **New** → **Web Service**
2. **Connect your GitHub repository** (same repo)
3. **Configure Frontend Service:**

   **Option A: Using Docker (Recommended)**
   - **Name**: `aiatl-frontend`
   - **Region**: `Oregon` (same as backend)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Docker`
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Docker Context**: `frontend`
   - **Build Command**: (Leave empty - handled by Dockerfile)
   - **Start Command**: (Leave empty - handled by Dockerfile)

   **Option B: Using Build/Start Commands (Without Docker)**
   - **Name**: `aiatl-frontend`
   - **Region**: `Oregon` (same as backend)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: `Static Site` or `Node`
   - **Build Command**: `npm ci --prefer-offline --no-audit && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
   - **Node Version**: `20`

5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://aiatl-backend.onrender.com
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** and copy the frontend URL (e.g., `https://aiatl-frontend.onrender.com`)

### Step 3: Update CORS Settings

1. Go back to **Backend Service** → **Environment**
2. Update `CORS_ALLOW_ORIGINS` to your frontend URL:
   ```
   CORS_ALLOW_ORIGINS=https://aiatl-frontend.onrender.com
   ```
3. **Save Changes** (this will trigger a redeploy)

## 🔧 Manual Build & Start Commands

### Backend (if not using Docker)

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Frontend (if not using Docker)

**Build Command:**
```bash
npm ci --prefer-offline --no-audit
npm run build
```

**Start Command:**
```bash
# Using nginx (recommended)
nginx -g "daemon off;"

# OR using a simple static server
npx serve -s dist -l $PORT
```

## 📝 Using render.yaml (Alternative)

You can also use the `render.yaml` file for automated deployment:

1. **Push `render.yaml` to your repository**
2. **Go to Render Dashboard** → **New** → **Blueprint**
3. **Connect your GitHub repository**
4. **Render will automatically detect `render.yaml` and create both services**

### Important: Set Environment Variables

After the services are created, you must set the environment variables in the Render dashboard:

**Backend:**
- `MONGODB_URI`
- `DB_NAME`
- `JWT_SECRET`
- `GEMINI_SERVICE_URL`
- `CORS_ALLOW_ORIGINS` (set to your frontend URL)

**Frontend:**
- `VITE_API_BASE_URL` (set to your backend URL)

## 🔗 Connecting Frontend to Backend

The frontend uses the `VITE_API_BASE_URL` environment variable to connect to the backend. This is set during the build process, so:

1. **Set `VITE_API_BASE_URL` in Render dashboard**
2. **Redeploy the frontend** (environment variables are baked into the build)

## ✅ Verification

1. **Check Backend Health:**
   ```bash
   curl https://aiatl-backend.onrender.com/health
   ```
   Should return: `{"status":"ok",...}`

2. **Check Frontend:**
   - Open `https://aiatl-frontend.onrender.com` in your browser
   - The app should load and connect to the backend

3. **Check API Connection:**
   - Open browser DevTools → Network tab
   - Make a request in the app
   - Verify API calls go to your backend URL

## 🐛 Troubleshooting

### Backend Issues

- **"Module not found" errors**: Check that all files are in the `backend/` directory
- **"Port binding failed"**: Ensure `$PORT` environment variable is used
- **"CORS errors"**: Update `CORS_ALLOW_ORIGINS` with your frontend URL

### Frontend Issues

- **"API calls failing"**: Check `VITE_API_BASE_URL` is set correctly and redeploy
- **"404 on routes"**: Ensure nginx.conf has `try_files $uri $uri/ /index.html;`
- **"Build fails"**: Check Node.js version (should be 20+)

## 💰 Cost

- **Free Tier**: 750 hours/month per service
- **Two services**: 1500 hours/month total (enough for 24/7 operation)
- **Total Cost**: $0/month (free tier)

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker on Render](https://render.com/docs/docker)
- [Environment Variables](https://render.com/docs/environment-variables)

