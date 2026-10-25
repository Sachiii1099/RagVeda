# IP-SAKTI Sahayak (Smart India Hackathon 2026)

> **Evidence-First, Multilingual AI Decision-Support Platform for Ayurvedic Innovation & Regulatory Navigation**
>
> *Ministry of AYUSH • Office of the CGPDTM (IP India) • National Biodiversity Authority (NBA)*

---

## 🌟 Executive Overview

**IP-SAKTI Sahayak** is **not** a generic chatbot, medical diagnostic app, or simple PDF chat assistant. It is a structured **Innovation-to-IP-and-Regulatory Decision Engine** that converts an unstructured Ayurvedic innovation description into:
1. **Pydantic-Validated Innovation Fingerprint** with botanical nomenclature normalization
2. **Adaptive Clarification Checkpoints** asking minimum necessary questions that materially impact statutory outcomes
3. **Product Classification Engine** (Classical Ayurvedic, Proprietary ASU, Phytopharmaceutical, Ayush Aahar, Cosmetic)
4. **IP Opportunity Matrix** with Section 3(p) Traditional Knowledge exclusion and Section 3(e) admixture scrutiny
5. **Prior-Art Radar & Novelty Timeline** tracking proximity to classical treatises (Charaka, Sushruta, AFI), TKDL classifications, and global patents
6. **Biodiversity & ABS Module** assessing Biological Diversity Act 2002 and 2023 Amendment rules
7. **Regulatory Navigator** mapping classification to exact licensing forms (Form 24D/25D, Rule 158-B) and compliance readiness scores
8. **What-If Scenario Simulator** allowing innovators to modify variables and compare statutory impacts
9. **Interactive Regulatory Dependency Graph** linking innovation attributes to clearance gates
10. **Persistent Innovation Passport & Expert Brief** for patent agents and AYUSH consultants

---

## 🚀 Key Differentiators Added

### 1. Dual Speech-to-Text (STT) Feature
- **Native Browser Web Speech API**: Zero-cost, zero-latency, real-time microphone dictation for **8+ Indian Languages**:
  - English (`en-IN`)
  - हिन्दी (Hindi - `hi-IN`)
  - मराठी (Marathi - `mr-IN`)
  - தமிழ் (Tamil - `ta-IN`)
  - తెలుగు (Telugu - `te-IN`)
  - ગુજરાતી (Gujarati - `gu-IN`)
  - ಕನ್ನಡ (Kannada - `kn-IN`)
  - മലയാളം (Malayalam - `ml-IN`)
  - বাংলা (Bengali - `bn-IN`)
- **Visual Waveform**: Animated pulsing soundwave indicators built with **Framer Motion**.
- **External API Support**: Users can supply their OpenAI Whisper or Gemini API keys in the Settings modal for cloud server-side transcription.

### 2. Complete Site-Wide Multilingual Localization (i18n)
- Seamlessly switch between **9 Languages** from the header: **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **ગુજરાતી (Gujarati)**, **ಕನ್ನಡ (Kannada)**, **മലയാളം (Malayalam)**, and **বাংলা (Bengali)**.
- The **entire site** updates reactively in real time: navigation, buttons, cards, forms, tooltips, compliance metrics, and AI explanations.

### 3. Sleek Framer Motion UX
- Interactive SVG Prior-Art Radar with glowing concentric similarity circles and hoverable nodes.
- Chronological Novelty Timeline from ancient classical eras to modern patents.
- Animated Regulatory Dependency Graph showing statutory dependencies.
- Evidence Drawer sliding smoothly into view with exact Level 1-6 statutory citations.

---

## 🏗️ Repository Architecture

```text
wonderful-brahmagupta/
├── apps/
│   ├── api/                          # FastAPI Backend (Python 3.11)
│   │   ├── app/
│   │   │   ├── core/                 # Config & SQLite/PostgreSQL Database
│   │   │   ├── models/               # SQLAlchemy Models
│   │   │   ├── schemas/              # Pydantic Schemas
│   │   │   ├── knowledge/            # Statutory Knowledge Corpus (Patents, BDA, DCA, FSSAI)
│   │   │   ├── retrieval/            # Hybrid BM25 + Semantic Search Engine
│   │   │   ├── engines/              # Decision Engines (Fingerprint, IP, Prior-Art, ABS, Regulatory, What-If)
│   │   │   └── api/                  # REST API Routes
│   │   ├── tests/                    # Pytest Unit and Flow Test Suite
│   │   └── Dockerfile
│   │
│   └── web/                          # Vite + React 18 + TypeScript Frontend
│       ├── src/
│       │   ├── components/           # Radar, Timeline, Dependency Graph, Intake, What-If, Drawer
│       │   ├── context/              # Global App Context & State
│       │   ├── hooks/                # Speech-to-Text Hook
│       │   └── i18n/                 # Multi-Language Translation Dictionaries (EN, HI, MR)
│       └── Dockerfile
│
├── docker-compose.yml                # Production Container Deployment
├── run_local.ps1                     # Local Quick-Launch Script
└── README.md
```

---

## ⚡ Quick Start

### 1. Running Locally (Windows / Linux / macOS)

#### Prerequisites:
- Python 3.11+
- Node.js 18+

#### Option A: Quick-Launch Script (PowerShell)
```powershell
.\run_local.ps1
```

#### Option B: Manual Launch
1. **Backend**:
   ```bash
   cd apps/api
   uv venv .venv
   .\.venv\Scripts\activate
   uv pip install fastapi uvicorn pydantic sqlalchemy python-multipart httpx pytest
   uvicorn app.main:app --reload --port 8000
   ```
   *FastAPI Swagger documentation available at: `http://127.0.0.1:8000/api/v1/docs`*

2. **Frontend**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   *Web application opens at: `http://localhost:5173`*

---

### 2. Running with Docker Compose
```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- API Backend: `http://localhost:8000`

---

## 🧪 Testing

Run the automated backend test suite:
```bash
cd apps/api
.\.venv\Scripts\python -m pytest tests/ -v
```
All tests validate botanical entity normalization, hybrid statutory retrieval, Section 3(p) exclusion warnings, biodiversity ABS triggers, and end-to-end multi-domain assessment pipelines.

---

## ⚖️ Non-Hallucination Legal Disclaimer
IP-SAKTI Sahayak is an evidence-first decision-support platform. It does not provide formal legal representation, guarantee patent grants, or replace the statutory authority of the Controller General of Patents, Designs & Trade Marks (CGPDTM), the National Biodiversity Authority (NBA), or the Ministry of AYUSH. All citations are linked directly to official gazette notifications and codified classical pharmacopoeias.
