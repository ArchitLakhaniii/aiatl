#!/bin/bash

# Railway Deployment Setup Script
# This script helps you deploy to Railway

set -e

echo "🚂 Railway Deployment Setup"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found${NC}"
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo -e "${GREEN}✓${NC} Railway CLI installed"
echo ""

# Login to Railway
echo -e "${BLUE}Step 1: Login to Railway${NC}"
railway login

echo ""
echo -e "${BLUE}Step 2: Initialize Project${NC}"
echo "Choose option: Create new project or link existing"
railway init

echo ""
echo -e "${BLUE}Step 3: Set Environment Variables${NC}"
echo "You'll need to set these variables in Railway Dashboard or via CLI:"
echo ""
echo "Required variables:"
echo "  - MONGODB_URI (your MongoDB connection string)"
echo "  - SECRET_KEY (JWT secret key, min 32 characters)"
echo "  - GEMINI_API_KEY (Google Gemini API key)"
echo ""
echo "Optional variables:"
echo "  - ALGORITHM=HS256"
echo "  - ACCESS_TOKEN_EXPIRE_MINUTES=30"
echo "  - PYTHON_VERSION=3.11"
echo "  - NODE_VERSION=20"
echo ""

read -p "Do you want to set environment variables now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter MONGODB_URI: " mongodb_uri
    railway variables set MONGODB_URI="$mongodb_uri"
    
    read -p "Enter SECRET_KEY (min 32 chars): " secret_key
    railway variables set SECRET_KEY="$secret_key"
    
    read -p "Enter GEMINI_API_KEY: " gemini_key
    railway variables set GEMINI_API_KEY="$gemini_key"
    
    railway variables set ALGORITHM="HS256"
    railway variables set ACCESS_TOKEN_EXPIRE_MINUTES="30"
    railway variables set PYTHON_VERSION="3.11"
    railway variables set NODE_VERSION="20"
    
    echo -e "${GREEN}✓${NC} Environment variables set"
else
    echo -e "${YELLOW}⚠️  Remember to set environment variables before deploying!${NC}"
    echo "Set them at: https://railway.app/dashboard"
fi

echo ""
echo -e "${BLUE}Step 4: Deploy${NC}"
read -p "Deploy now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway up
    echo ""
    echo -e "${GREEN}✓${NC} Deployment started!"
    echo ""
    echo "View your deployment:"
    railway open
else
    echo ""
    echo "To deploy later, run: railway up"
fi

echo ""
echo -e "${GREEN}🎉 Railway setup complete!${NC}"
echo ""
echo "Useful commands:"
echo "  railway logs        - View logs"
echo "  railway open        - Open dashboard"
echo "  railway up          - Deploy"
echo "  railway link        - Link to project"
echo "  railway variables   - Manage variables"
echo ""
echo "Full documentation: See RAILWAY_SETUP.md"
