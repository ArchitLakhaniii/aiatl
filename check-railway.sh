#!/bin/bash

# Quick Railway Status Check
# Run this to verify your Railway configuration

echo "🚂 Railway Configuration Check"
echo "=============================="
echo ""

# Check if files exist
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 (missing)"
    fi
}

echo "📁 Configuration Files:"
check_file "railway.json"
check_file "nixpacks.toml"
check_file "railway.toml"
check_file "Procfile"
check_file "Dockerfile.railway"
check_file "requirements.txt"
check_file "package.json"

echo ""
echo "📚 Documentation Files:"
check_file "RAILWAY_QUICKSTART.md"
check_file "RAILWAY_SETUP.md"
check_file "RAILWAY_CONFIG_SUMMARY.md"

echo ""
echo "🔧 Scripts:"
check_file "deploy-railway.sh"
if [ -x "deploy-railway.sh" ]; then
    echo "   └─ Executable: ✅"
else
    echo "   └─ Executable: ❌ (run: chmod +x deploy-railway.sh)"
fi

echo ""
echo "🔍 Environment Check:"

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI installed ($(railway --version))"
else
    echo "❌ Railway CLI not installed"
    echo "   Install with: npm i -g @railway/cli"
fi

# Check Node version
if command -v node &> /dev/null; then
    echo "✅ Node.js installed ($(node --version))"
else
    echo "❌ Node.js not installed"
fi

# Check Python version
if command -v python3 &> /dev/null; then
    echo "✅ Python installed ($(python3 --version))"
else
    echo "❌ Python not installed"
fi

echo ""
echo "📋 Required Environment Variables (to set in Railway):"
echo "   - MONGODB_URI"
echo "   - SECRET_KEY"
echo "   - GEMINI_API_KEY"

echo ""
echo "🚀 Ready to Deploy?"
echo ""
echo "Quick deploy:    ./deploy-railway.sh"
echo "Manual deploy:   railway login && railway init && railway up"
echo "Documentation:   cat RAILWAY_QUICKSTART.md"
echo ""
echo "Need help? Read RAILWAY_SETUP.md for full documentation."
