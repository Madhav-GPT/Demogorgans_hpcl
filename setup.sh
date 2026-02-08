#!/bin/bash

# HPCL Lead Intelligence - One-Click Setup Script
# This script handles: Ollama install, model download, and server start

set -e

echo "🚀 HPCL Lead Intelligence - Auto Setup"
echo "======================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check OS
OS="$(uname -s)"
echo "📦 Detected OS: $OS"

# Step 1: Check/Install Ollama
echo ""
echo "Step 1/4: Checking Ollama..."

if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✅ Ollama is already installed${NC}"
else
    echo -e "${YELLOW}⏳ Ollama not found. Installing...${NC}"
    
    if [ "$OS" = "Darwin" ]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            echo "Installing Ollama via curl..."
            curl -fsSL https://ollama.ai/install.sh | sh
        fi
    elif [ "$OS" = "Linux" ]; then
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo -e "${RED}❌ Unsupported OS. Please install Ollama manually from https://ollama.ai${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Ollama installed${NC}"
fi

# Step 2: Start Ollama server (in background if not running)
echo ""
echo "Step 2/4: Starting Ollama server..."

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama server is already running${NC}"
else
    echo "Starting Ollama server in background..."
    ollama serve > /dev/null 2>&1 &
    sleep 3
    
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama server started${NC}"
    else
        echo -e "${YELLOW}⚠️  Ollama server may still be starting. Continuing...${NC}"
    fi
fi

# Step 3: Pull the model
echo ""
echo "Step 3/4: Checking qwen2.5:1.5b model..."

if ollama list | grep -q "qwen2.5:1.5b"; then
    echo -e "${GREEN}✅ Model qwen2.5:1.5b is already downloaded${NC}"
else
    echo -e "${YELLOW}⏳ Downloading model qwen2.5:1.5b (~1GB)... This may take a few minutes.${NC}"
    ollama pull qwen2.5:1.5b
    echo -e "${GREEN}✅ Model downloaded${NC}"
fi

# Step 4: Install npm dependencies and start server
echo ""
echo "Step 4/4: Setting up backend..."

cd "$(dirname "$0")/backend"

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Created .env from template. You may need to add API keys.${NC}"
    fi
fi

echo "Installing npm dependencies..."
npm install --silent

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Starting server..."
echo ""
echo "📡 Dashboard: http://localhost:3001"
echo "🤖 LLM Test:  http://localhost:3001/api/test-llm"
echo ""

node server.js
