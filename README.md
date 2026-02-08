# 🔥 HPCL Lead Intelligence Dashboard

AI-powered B2B lead discovery platform using **100% local LLM inference** with Ollama.

![Dashboard Preview](/Users/madhav_189/.gemini/antigravity/brain/a2c5d6c6-7e46-4538-9187-de39ce36915f/leads_generated_dashboard_1770547976921.png)

---

## 🚀 Quick Start (For Judges)

### Prerequisites
- **Node.js 18+**
- **Ollama** (see below)

### Step 1: Clone & Install
```bash
git clone https://github.com/your-repo/Demogorgans_hpcl.git
cd Demogorgans_hpcl
```

### Step 2: Install Ollama & Model
```bash
# macOS
brew install ollama

# OR download from https://ollama.ai

# Then download the model (~1GB)
ollama pull qwen2.5:1.5b
```

### Step 3: Start Everything
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Backend (serves frontend too)
cd backend
npm install
node server.js
```

### Step 4: Open Dashboard
**http://localhost:3001**

Click "Find Leads" → AI generates 6+ lead cards automatically! 🎉

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Local LLM** | 100% offline AI (Ollama + Qwen 1.5B) |
| 📰 **News Scraping** | Auto-fetches industrial news from India |
| 📊 **Lead Scoring** | AI ranks leads 0-100 with reasoning |
| 💬 **AI Chatbot** | Ask questions about leads |
| 📱 **WhatsApp/Telegram** | One-click contact sales officers |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│  Frontend (React)                    │
│  localhost:3001                      │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Backend (Express)                   │
│  ├── /api/fetchNews → NewsData.io   │
│  ├── /api/processLead → Ollama LLM  │
│  ├── /api/chat → Ollama LLM         │
│  └── /api/sendAlert → Telegram      │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Ollama (Local AI Server)            │
│  localhost:11434                     │
│  Model: qwen2.5:1.5b (~1GB)          │
└──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Express server
├── services/llmService.js    # Ollama API wrapper
├── api/
│   ├── fetchNews.js          # News API + 6 demo articles
│   ├── processLead.js        # AI lead extraction
│   ├── chatService.js        # AI chatbot
│   └── telegramService.js    # Telegram alerts
└── .env                      # Config (included for judges)

frontend/
├── src/                      # React source
└── dist/                     # Production build
```

---

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test-llm` | GET | Check Ollama status |
| `/api/fetchNews` | GET | Fetch industrial news |
| `/api/fetchNews?demo=true` | GET | Force demo articles |
| `/api/processLead` | POST | Extract lead with AI |
| `/api/chat` | POST | Chat with AI assistant |
| `/api/sendAlert` | POST | Send Telegram alert |

---

## 🛠 Troubleshooting

### "Ollama server is offline"
```bash
ollama serve  # Run in separate terminal
```

### "Model not found"
```bash
ollama pull qwen2.5:1.5b
```

### Verify LLM Working
Visit: **http://localhost:3001/api/test-llm**

---

## 📊 Model Specs

| Property | Value |
|----------|-------|
| Model | qwen2.5:1.5b |
| Parameters | 1.5 Billion |
| Size | ~1GB |
| RAM Required | ~2GB |

---

## 👥 Team: Demogorgans

Built for HPCL 24-Hour Productathon
