# Project Demo Video Drive Link:- https://drive.google.com/file/d/1RsLPViGEGo9AfLSfuoqeO13Q2zygnSN7/view?usp=sharing

# HPCL Lead Intelligence Dashboard

AI-powered B2B lead discovery platform using **100% local LLM inference** with Ollama.

> ⚠️ **Important for Judges**: This project uses a LOCAL LLM that runs on YOUR machine. The model (~1GB) is NOT included in this repo. See setup below.

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│  THIS GITHUB REPO (~150MB)        │  OLLAMA (Install Separately) │
├────────────────────────────────────────────────────────────────┤
│  backend/                         │  ~/.ollama/models/            │
│  ├── services/llmService.js ──────│──→ qwen2.5:1.5b (~1GB)        │
│  └── server.js                    │                               │
│                                   │  Runs as local service on:    │
│  Makes HTTP calls to ─────────────│──→ localhost:11434            │
│                                   │                               │
│  frontend/dist/                   │  No cloud APIs needed!        │
└────────────────────────────────────────────────────────────────┘
```

**Why this design?**
- Model is too large for GitHub (1GB+ limit)
- Ollama manages model downloads, caching, and inference
- Your code just makes HTTP calls to `localhost:11434`
- Works fully offline once model is downloaded

---

## 🚀 One-Click Setup (For Judges)
-----------------------------------------
### macOS/Linux:
```bash
git clone <this-repo>
cd Demagorgans_hpcl
./setup.sh
```
------------------------------------------
### Windows:
```cmd
git clone <this-repo>
cd Demagorgans_hpcl
setup.bat
```

**The script automatically:**
1. ✅ Installs Ollama (if missing)
2. ✅ Downloads qwen2.5:1.5b model (~1GB)
3. ✅ Starts Ollama server
4. ✅ Installs npm dependencies
5. ✅ Launches the app

**Dashboard:** http://localhost:3001

---

## 📋 Manual Setup (Alternative)

<details>
<summary>Click to expand manual steps</summary>

### Step 1: Install Ollama
```bash
# macOS
brew install ollama
# OR download from https://ollama.ai
```

### Step 2: Download Model
```bash
ollama pull qwen2.5:1.5b
```

### Step 3: Start Ollama
```bash
ollama serve  # Keep running
```

### Step 4: Run Backend (New Terminal)
```bash
cd backend
npm install
node server.js
```
</details>

---

### Verify LLM Working
Visit: **http://localhost:3001/api/test-llm**

| Aspect | Cloud API (Gemini/OpenAI) | Local LLM (Ollama) |
|--------|---------------------------|-------------------|
| **Cost** | Pay per request | ✅ Free forever |
| **Rate Limits** | 20 req/day on free tier | ✅ Unlimited |
| **Internet** | Required | ✅ Works offline |
| **Privacy** | Data sent to cloud | ✅ Data stays local |
| **Latency** | Network dependent | ✅ Local inference |

---

## 📁 Project Structure

```
backend/
├── server.js                 # Express server
├── services/
│   └── llmService.js         # Ollama API wrapper
├── api/
│   ├── fetchNews.js          # NewsData.io API + Demo articles
│   ├── processLead.js        # Lead extraction (uses LLM)
│   ├── chatService.js        # Chatbot (uses LLM)
│   ├── telegramService.js    # Telegram alerts
│   └── testLLM.js            # LLM health check
└── .env.example              # Config template

frontend/
├── src/                      # React source
└── dist/                     # Production build (served by backend)
```

---

## 🔧 Environment Variables

The project comes with API keys pre-configured for demo purposes. No `.env` setup required!

If you want to use your own keys, create `.env` in `backend/` folder:

```env
LOCAL_LLM=true                              # Required
NEWSDATA_API_KEY=your_key_here              # Get from newsdata.io
TELEGRAM_BOT_TOKEN=your_token_here          # Optional
PORT=3001                                   # Optional
```

---

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test-llm` | GET | Check if Ollama + model working |
| `/api/fetchNews` | GET | Fetch industrial news |
| `/api/fetchNews?demo=true` | GET | Force demo articles only |
| `/api/processLead` | POST | Extract lead with AI |
| `/api/chat` | POST | Chatbot interaction |
| `/api/sendAlert` | POST | Send Telegram alert |

---

## 🛠 Troubleshooting

### "Ollama server is offline"
```bash
ollama serve  # Start in another terminal
```

### "Model not found"
```bash
ollama pull qwen2.5:1.5b
```

### Model download stuck?
```bash
# Check download progress
ollama list

# If stuck, restart
ollama stop
ollama pull qwen2.5:1.5b
```

---

## 📊 Model Specs

| Property | Value |
|----------|-------|
| Model | qwen2.5:1.5b |
| Parameters | 1.5 Billion |
| Quantization | Q4_K_M |
| Size | ~1GB on disk |
| RAM Required | ~2GB |
| Inference Speed | ~20-50 tokens/sec |

---

## ✨ Features

- 🤖 **Local LLM**: 100% offline AI (Ollama + Qwen 1.5B)
- 📰 **News Scraping**: Auto-fetches industrial news from India
- 📊 **Lead Scoring**: AI ranks leads 0-100 with reasoning
- 💬 **AI Chatbot**: Ask questions about leads
- 📱 **WhatsApp/Telegram**: One-click contact sales officers
- 🎨 **Modern UI**: Workspace-style dashboard with lime green theme

---

## 👥 Team: Demogorgans

Built for HPCL 24-Hour Productathon

📄 See [PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md) for detailed ideology and approach.
