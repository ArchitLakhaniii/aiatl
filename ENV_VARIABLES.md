# Environment Variables Guide

## 📍 Where to Set Environment Variables

Environment variables need to be set in different places depending on where you're running your application:

### 1. **Local Development** (`.env` file)

Create a `.env` file in the **root directory** of your project:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your actual values.

**Location**: `/Users/architlakhani/Documents/GitHub/aiatl/.env`

### 2. **Render.com Deployment** (Render Dashboard)

Set environment variables in the Render dashboard for each service:

**Backend Service:**
- Go to Render Dashboard → Your Backend Service → Environment
- Add environment variables there

**Frontend Service:**
- Go to Render Dashboard → Your Frontend Service → Environment
- Add environment variables there

### 3. **Railway Deployment** (Railway Dashboard)

Set environment variables in the Railway dashboard:
- Go to Railway Dashboard → Your Service → Variables
- Add environment variables there

### 4. **Cloudflare Workers** (`.dev.vars` file or Cloudflare Dashboard)

For local development with Wrangler:
```bash
cp .dev.vars.example .dev.vars
```

For production, set secrets in Cloudflare Dashboard:
- Go to Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Variables

---

## 🔑 Required Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | (hardcoded fallback) | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | Database name | No | `flashrequest` | `flashrequest` |
| `SECRET_KEY` or `JWT_SECRET` | JWT secret key | Yes | `your-secret-key-change-in-production` | `your-32-char-secret-key` |
| `GEMINI_SERVICE_URL` | Gemini service URL | No | `http://127.0.0.1:3001` | `https://your-gemini-service.workers.dev` |
| `CORS_ALLOW_ORIGINS` | Allowed CORS origins | No | `*` | `https://your-frontend.onrender.com` |
| `ENVIRONMENT` | Environment name | No | - | `production` |

### Frontend Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | `http://127.0.0.1:8000` | `https://your-backend.onrender.com` |

### Gemini Service Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - | `your-gemini-api-key` |

---

## 📝 Creating Your `.env` File

### Step 1: Copy the example file

```bash
# From the root directory
cp .env.example .env
```

### Step 2: Edit `.env` with your values

```bash
# Backend/.env (for local development)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=flashrequest
SECRET_KEY=your-secret-key-min-32-characters-long
JWT_SECRET=your-secret-key-min-32-characters-long
GEMINI_SERVICE_URL=http://localhost:3001
CORS_ALLOW_ORIGINS=http://localhost:5173
ENVIRONMENT=development

# Frontend (if using .env in frontend/)
VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Make sure `.env` is in `.gitignore`

⚠️ **Important**: Never commit `.env` files to git! They contain sensitive information.

Check that `.env` is in your `.gitignore`:
```bash
cat .gitignore | grep .env
```

---

## 🚀 Render.com Setup

### Backend Service

1. Go to **Render Dashboard** → **Your Backend Service** → **Environment**
2. Add these variables:

```
MONGODB_URI=your-mongodb-connection-string
DB_NAME=flashrequest
JWT_SECRET=your-jwt-secret-min-32-chars
GEMINI_SERVICE_URL=your-gemini-service-url
ENVIRONMENT=production
CORS_ALLOW_ORIGINS=https://your-frontend.onrender.com
```

### Frontend Service

1. Go to **Render Dashboard** → **Your Frontend Service** → **Environment**
2. Add this variable:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

⚠️ **Note**: `VITE_API_BASE_URL` is baked into the build. If you change it, you need to rebuild the frontend.

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to git
2. **Use strong secrets** for `JWT_SECRET` (minimum 32 characters)
3. **Rotate secrets** regularly in production
4. **Use different secrets** for development and production
5. **Don't share** environment variables publicly

### Generate a Strong JWT Secret

```bash
# Linux/Mac
openssl rand -hex 32

# Or use Python
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🧪 Testing Environment Variables

### Check if variables are loaded (Backend)

```python
import os
print("MONGODB_URI:", os.getenv("MONGODB_URI"))
print("DB_NAME:", os.getenv("DB_NAME"))
print("SECRET_KEY:", os.getenv("SECRET_KEY"))
```

### Check if variables are loaded (Frontend)

```javascript
console.log("API URL:", import.meta.env.VITE_API_BASE_URL)
```

---

## 📋 Quick Checklist

- [ ] Created `.env` file from `.env.example`
- [ ] Set `MONGODB_URI` with your MongoDB connection string
- [ ] Set `SECRET_KEY` or `JWT_SECRET` with a strong secret
- [ ] Set `VITE_API_BASE_URL` in frontend (for production)
- [ ] Set `CORS_ALLOW_ORIGINS` in backend (for production)
- [ ] Verified `.env` is in `.gitignore`
- [ ] Set environment variables in Render/Railway dashboard (for deployment)

---

## 🐛 Troubleshooting

### "Environment variable not found"

- **Check**: Is the variable name correct? (case-sensitive)
- **Check**: Did you create the `.env` file?
- **Check**: Is the `.env` file in the correct location?
- **Check**: Did you restart your server after adding variables?

### "MongoDB connection failed"

- **Check**: Is `MONGODB_URI` set correctly?
- **Check**: Does your MongoDB cluster allow connections from your IP?
- **Check**: Are your MongoDB credentials correct?

### "CORS errors"

- **Check**: Is `CORS_ALLOW_ORIGINS` set to your frontend URL?
- **Check**: Is there a trailing slash? (remove it)
- **Check**: Are you using `https://` for production?

### "API calls failing"

- **Check**: Is `VITE_API_BASE_URL` set correctly?
- **Check**: Did you rebuild the frontend after changing the variable?
- **Check**: Is the backend URL accessible?

---

## 📚 Additional Resources

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Python Environment Variables](https://docs.python.org/3/library/os.html#os.getenv)

