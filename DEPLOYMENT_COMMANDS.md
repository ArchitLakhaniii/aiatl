# Build and Start Commands for Render Deployment

## 📋 Quick Reference

### Backend Service

**Build Command:**
```bash
# Handled by Dockerfile - no separate build command needed
# OR if not using Docker:
pip install -r requirements.txt
```

**Start Command:**
```bash
# Handled by Dockerfile entrypoint
# OR if not using Docker:
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Frontend Service

**Build Command:**
```bash
# Handled by Dockerfile - no separate build command needed
# OR if not using Docker:
npm ci --prefer-offline --no-audit
npm run build
```

**Start Command:**
```bash
# Handled by Dockerfile (nginx)
# OR if not using Docker:
npx serve -s dist -l $PORT
```

---

## 🐳 Using Docker (Recommended)

### Backend Dockerfile Location
- **Path**: `backend/Dockerfile`
- **Context**: `backend/`
- **Build**: Automatic (Render builds from Dockerfile)
- **Start**: Automatic (uses ENTRYPOINT from Dockerfile)

### Frontend Dockerfile Location
- **Path**: `frontend/Dockerfile`
- **Context**: `frontend/`
- **Build**: Automatic (Render builds from Dockerfile)
- **Start**: Automatic (uses nginx from Dockerfile)

---

## 🔧 Manual Deployment (Without Docker)

### Backend Manual Setup

1. **Environment**: Python 3.11
2. **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Start Command**:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
4. **Root Directory**: `backend/`

### Frontend Manual Setup

1. **Environment**: Node.js 20
2. **Build Command**:
   ```bash
   npm ci --prefer-offline --no-audit
   npm run build
   ```
3. **Start Command** (Option 1 - nginx):
   ```bash
   # Install nginx first, then:
   nginx -g "daemon off;"
   ```

4. **Start Command** (Option 2 - serve):
   ```bash
   npx serve -s dist -l $PORT
   ```

5. **Root Directory**: `frontend/`

---

## 📝 Render Dashboard Configuration

### Backend Service Settings

| Setting | Value |
|---------|-------|
| **Name** | `aiatl-backend` |
| **Environment** | `Docker` |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Docker Context** | `backend` |
| **Health Check Path** | `/health` |
| **Build Command** | (Leave empty - handled by Dockerfile) |
| **Start Command** | (Leave empty - handled by Dockerfile) |

### Frontend Service Settings

| Setting | Value |
|---------|-------|
| **Name** | `aiatl-frontend` |
| **Environment** | `Docker` |
| **Dockerfile Path** | `frontend/Dockerfile` |
| **Docker Context** | `frontend` |
| **Health Check Path** | `/` |
| **Build Command** | (Leave empty - handled by Dockerfile) |
| **Start Command** | (Leave empty - handled by Dockerfile) |

---

## 🔐 Required Environment Variables

### Backend Environment Variables

```bash
MONGODB_URI=your-mongodb-connection-string
DB_NAME=flashrequest
JWT_SECRET=your-jwt-secret-min-32-chars
GEMINI_SERVICE_URL=your-gemini-service-url
ENVIRONMENT=production
CORS_ALLOW_ORIGINS=https://aiatl-frontend.onrender.com
```

### Frontend Environment Variables

```bash
VITE_API_BASE_URL=https://aiatl-backend.onrender.com
```

**Note**: `VITE_API_BASE_URL` must be set **before** building. If you change it, you need to rebuild the frontend.

---

## 🚀 Deployment Workflow

1. **Deploy Backend First**
   - Create backend service in Render
   - Set environment variables
   - Wait for deployment
   - Copy backend URL

2. **Deploy Frontend**
   - Create frontend service in Render
   - Set `VITE_API_BASE_URL` to backend URL
   - Wait for deployment
   - Copy frontend URL

3. **Update CORS**
   - Go back to backend service
   - Update `CORS_ALLOW_ORIGINS` with frontend URL
   - Save (triggers redeploy)

4. **Test**
   - Visit frontend URL
   - Check browser console for errors
   - Test API connectivity

---

## 📦 Local Development

### Backend (Local)
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```

**Note**: Frontend dev server runs on port 5173 and proxies API requests to `http://localhost:8000`

---

## 🔍 Verification Commands

### Check Backend Health
```bash
curl https://aiatl-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "modelLoaded": "matchmaker_model.joblib",
  "profiles": 0,
  "requests": 0
}
```

### Check Frontend
```bash
curl https://aiatl-frontend.onrender.com
```

Expected: HTML content (React app)

### Check API Connection
```bash
curl https://aiatl-backend.onrender.com/api/listings
```

Expected: JSON response with listings or empty array

---

## 🐛 Common Issues

### Backend: "Module not found"
- **Solution**: Ensure all files are in `backend/` directory
- **Check**: Verify `backend/app.py`, `backend/auth.py`, etc. exist

### Backend: "Port binding failed"
- **Solution**: Use `$PORT` environment variable in start command
- **Check**: Ensure start command includes `--port $PORT`

### Frontend: "API calls failing"
- **Solution**: Set `VITE_API_BASE_URL` and rebuild
- **Check**: Verify environment variable is set before build

### Frontend: "404 on routes"
- **Solution**: Ensure nginx.conf has `try_files $uri $uri/ /index.html;`
- **Check**: Verify nginx configuration

### CORS Errors
- **Solution**: Update `CORS_ALLOW_ORIGINS` in backend with frontend URL
- **Check**: Ensure no trailing slash in URLs

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)

