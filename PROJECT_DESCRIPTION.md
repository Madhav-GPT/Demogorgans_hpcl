# 🔥 HPCL Lead Intelligence Agent - Project Description

## 📋 Executive Summary

The **HPCL Lead Intelligence Agent** is an AI-powered B2B lead discovery platform that automatically identifies high-value industrial customers for HPCL's petroleum products by analyzing real-time news data using local LLM inference.

---

## 🎯 Problem Statement

### The Challenge
HPCL's B2B sales teams face significant challenges in identifying potential industrial customers:

| Problem | Impact |
|---------|--------|
| **Manual Lead Discovery** | Sales officers spend hours scanning news, trade publications, and industry reports |
| **Missed Opportunities** | New plant constructions, capacity expansions, and equipment installations go unnoticed |
| **Delayed Response** | By the time leads are identified, competitors have already engaged |
| **No Systematic Approach** | Lead identification depends on individual sales officer's networks |

### Real-World Scenario
When Tata Steel announces a ₹12,000 crore blast furnace expansion in Jamshedpur, HPCL should immediately:
1. Know about it (from news)
2. Understand fuel requirements (furnace oil, diesel)
3. Alert the regional sales officer
4. Enable quick outreach

**This doesn't happen today.** Our solution fixes this.

---

## 💡 Our Solution

### Core Innovation: News → AI Analysis → Actionable Leads

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Indian News    │────▶│  Local AI       │────▶│  Sales-Ready    │
│  (Economic Times│     │  (Ollama LLM)   │     │  Lead Cards     │
│   Mint, etc.)   │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
   Real-time              Extracts:              Enables:
   industrial         • Company name          • WhatsApp outreach
   news feed          • Location              • Telegram alerts
                      • Equipment signals     • Lead scoring
                      • Product match         • Territory routing
```

### Why This Matters
1. **Proactive Sales**: Discover leads before competitors
2. **AI-Powered Matching**: Automatically match signals to HPCL products
3. **Instant Alerts**: Real-time notifications to sales officers
4. **Zero Cloud Cost**: 100% local LLM inference

---

## 🏗️ Technical Architecture

### System Design
```
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                                       │
│  ├── Workspace Dashboard UI                                    │
│  ├── Lead Cards with Scoring                                   │
│  ├── Filter Tabs (Hot/Great/Medium/Low)                        │
│  └── AI Chatbot for Lead Queries                               │
└───────────────────────┬────────────────────────────────────────┘
                        │ API Calls
┌───────────────────────▼────────────────────────────────────────┐
│  BACKEND (Node.js + Express)                                   │
│  ├── /api/fetchNews      → NewsData.io API                     │
│  ├── /api/processLead    → LLM Lead Extraction                 │
│  ├── /api/chat           → AI Chatbot                          │
│  └── /api/sendAlert      → Telegram Bot                        │
└───────────────────────┬────────────────────────────────────────┘
                        │ HTTP localhost:11434
┌───────────────────────▼────────────────────────────────────────┐
│  OLLAMA (Local AI Server)                                      │
│  └── qwen2.5:1.5b model (~1GB, runs offline)                   │
└────────────────────────────────────────────────────────────────┘
```

### Why Local LLM (Ollama)?

| Aspect | Cloud APIs (GPT/Gemini) | Our Approach (Ollama) |
|--------|-------------------------|------------------------|
| **Cost** | $0.002-0.06 per request | ✅ Free forever |
| **Rate Limits** | 20 req/day (free tier) | ✅ Unlimited |
| **Privacy** | Data sent to cloud | ✅ 100% on-device |
| **Internet** | Required | ✅ Works offline |
| **Enterprise** | Compliance issues | ✅ Data stays local |

---

## 🛢️ HPCL Product Intelligence

### Product Portfolio Mapping
The AI understands HPCL's industrial product portfolio:

| Product | Use Case | Signal Keywords |
|---------|----------|-----------------|
| **Furnace Oil (FO)** | Boilers, furnaces, kilns | "boiler", "furnace", "kiln" |
| **High Speed Diesel (HSD)** | Gensets, vehicles | "genset", "generator", "fleet" |
| **Light Diesel Oil (LDO)** | Furnace start-up | "ignition", "start-up" |
| **LSHS** | Low sulphur alternative | "emission", "pollution" |
| **Bitumen** | Road construction | "highway", "road", "paving" |
| **Marine Bunker** | Vessel fuel | "port", "shipping", "vessel" |

### AI Prompt Engineering
The LLM is fine-tuned with HPCL-specific prompts that:
1. Identify operational signals (construction, expansion, equipment)
2. Match signals to appropriate HPCL products
3. Calculate lead scores based on intent and urgency
4. Assign leads to regional territories

---

## 📊 Lead Scoring Algorithm

### Score Calculation (0-100)
```javascript
Score = Intent (30pts) + Product Match (30pts) + Urgency (20pts) + Freshness (20pts)

Intent Levels:
  High (expansion, new plant)    = 30 pts
  Medium (maintenance, upgrade)  = 20 pts
  Low (general mention)          = 10 pts

Product Confidence:
  Average of AI confidence scores × 30

Urgency:
  Immediate                      = 20 pts
  Near-term (< 6 months)         = 15 pts
  Long-term (> 6 months)         = 8 pts

Freshness:
  Today                          = 20 pts
  This week                      = 15 pts
  Older                          = 5 pts
```

### Lead Categories
| Score | Category | UI Badge |
|-------|----------|----------|
| 75-100 | Hot Client | 🔴 Red |
| 60-74 | High Interest | 🟠 Orange |
| 40-59 | Medium Interest | 🟡 Yellow |
| 0-39 | Low Interest | ⚪ Gray |

---

## 🖥️ User Interface

### Design Philosophy
- **Workspace-style layout**: Inspired by modern productivity tools
- **Card-based leads**: Quick scanning and comparison
- **Lime green accent**: Fresh, professional, HPCL-aligned
- **Filter tabs**: Instant prioritization of hot leads

### Key Features
1. **One-click lead discovery**: Press "Find Leads" to scan news
2. **Visual scoring**: Interest dots show lead quality at a glance
3. **Source transparency**: Each lead shows the news source
4. **AI chatbot**: Ask questions about leads in natural language
5. **Contact buttons**: WhatsApp/Telegram integration for sales outreach

---

## 📱 Sales Officer Workflow

### Before (Manual Process)
```
Morning: Browse newspapers (30 min)
        ↓
Manually note down companies (15 min)
        ↓
Google each company (45 min)
        ↓
Decide if relevant (10 min)
        ↓
Create contact list (20 min)

Total: ~2 hours daily
```

### After (With Our Solution)
```
Open Dashboard → Click "Find Leads"
        ↓
AI processes 10 news articles (30 sec)
        ↓
View prioritized leads with scores
        ↓
Click "Contact" on hot lead
        ↓
WhatsApp opens with pre-filled message

Total: ~2 minutes ✅
```

---

## 🔒 Privacy & Security

### Data Flow
- **News data**: Fetched from public APIs (NewsData.io)
- **AI processing**: 100% local on user's machine
- **No cloud dependency**: Works offline after setup
- **No data storage**: Leads exist only in browser session

### Enterprise Ready
- No API keys stored in the cloud
- No sensitive data leaves the local machine
- Compliant with enterprise AI policies

---

## 🚀 Future Scope

| Feature | Description |
|---------|-------------|
| **CRM Integration** | Push leads directly to Salesforce/HubSpot |
| **Email Campaigns** | Automated follow-up sequences |
| **Voice Alerts** | Audio notifications for hot leads |
| **Mobile App** | React Native version for field sales |
| **Multi-language** | Hindi/Regional language news parsing |
| **Competitor Intel** | Track competitor activity in news |

---

## 👥 Team: Demogorgans

Built with ❤️ for HPCL 24-Hour Productathon

### Tech Stack
- **Frontend**: React, Vite, Lucide Icons
- **Backend**: Node.js, Express
- **AI**: Ollama, Qwen 2.5 (1.5B parameters)
- **APIs**: NewsData.io, Telegram Bot API

---

## 📚 References

- [Ollama Documentation](https://ollama.ai)
- [Qwen 2.5 Model](https://huggingface.co/Qwen)
- [NewsData.io API](https://newsdata.io)
- [HPCL Product Portfolio](https://www.hindustanpetroleum.com)
