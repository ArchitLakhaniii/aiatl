# Project Structure Changes

## ✅ What Changed

Your application has been reorganized into separate `/frontend` and `/backend` directories for independent deployment.

### New Structure

```
/
├── frontend/              # React frontend application
│   ├── src/              # React source code
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   ├── Dockerfile        # Frontend Docker image
│   └── nginx.conf        # Nginx configuration
│
└── backend/              # Python FastAPI backend
    ├── app.py            # FastAPI application
    ├── requirements.txt  # Python dependencies
    ├── MLmodel/          # ML model files
    ├── campus_sellers.json
    ├── Dockerfile        # Backend Docker image
    └── entrypoint.sh     # Startup script
```

### Files Moved

**Frontend:**
- `src/` → `frontend/src/`
- `index.html` → `frontend/index.html`
- `package.json` → `frontend/package.json`
- `vite.config.ts` → `frontend/vite.config.ts`
- `tsconfig.json` → `frontend/tsconfig.json`
- `tailwind.config.js` → `frontend/tailwind.config.js`
- `postcss.config.js` → `frontend/postcss.config.js`

**Backend:**
- `MLmodel/` → `backend/MLmodel/`
- `campus_sellers.json` → `backend/campus_sellers.json`
- `requirements.txt` → `backend/requirements.txt`

## 🔗 How They Connect

The frontend and backend communicate via HTTP API:

- **Frontend** makes requests to backend API endpoints
- **Backend URL** is configured via `VITE_API_BASE_URL` environment variable
- **CORS** is configured in backend to allow requests from frontend URL

## 🚀 Deployment

See `RENDER_DEPLOYMENT.md` for complete deployment instructions.

### Quick Start

1. **Deploy Backend:**
   - Create web service in Render
   - Dockerfile: `backend/Dockerfile`
   - Context: `backend/`

2. **Deploy Frontend:**
   - Create web service in Render
   - Dockerfile: `frontend/Dockerfile`
   - Context: `frontend/`
   - Set `VITE_API_BASE_URL` to backend URL

3. **Update CORS:**
   - Set `CORS_ALLOW_ORIGINS` in backend to frontend URL

## 📝 Build & Start Commands

See `DEPLOYMENT_COMMANDS.md` for detailed build and start commands.

### Backend
- **Build**: Handled by Dockerfile
- **Start**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Frontend
- **Build**: `npm ci && npm run build`
- **Start**: Nginx (handled by Dockerfile)

## 🔧 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs on port 5173 and connects to backend on port 8000.

## 📚 Documentation

- `RENDER_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_COMMANDS.md` - Build and start commands
- `render.yaml` - Render.com configuration file

## 🎯 Next Steps

1. **Review the new structure**
2. **Test locally** (see Local Development above)
3. **Deploy to Render** (see RENDER_DEPLOYMENT.md)
4. **Set environment variables** in Render dashboard
5. **Update CORS settings** after deployment

## ⚠️ Important Notes

- **Environment Variables**: Must be set in Render dashboard before deployment
- **CORS**: Backend must allow frontend URL in `CORS_ALLOW_ORIGINS`
- **API URL**: Frontend needs `VITE_API_BASE_URL` set during build
- **Separate Deployments**: Frontend and backend are deployed as separate services

## 🔍 Verification

After deployment, verify:

1. **Backend health**: `https://your-backend.onrender.com/health`
2. **Frontend loads**: `https://your-frontend.onrender.com`
3. **API connection**: Check browser console for API requests
4. **CORS**: No CORS errors in browser console

## 🐛 Troubleshooting

See `DEPLOYMENT_COMMANDS.md` for common issues and solutions.

Common issues:
- Module not found errors → Check file locations
- Port binding failed → Use `$PORT` environment variable
- API calls failing → Check `VITE_API_BASE_URL`
- CORS errors → Update `CORS_ALLOW_ORIGINS`

