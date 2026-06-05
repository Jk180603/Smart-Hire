# SmartHire AI 🎯

**An intelligent job application tracker powered by LLMs, semantic embeddings, and a full-stack modern tech stack.**

Built while actively job hunting in Berlin — I was tracking 20+ applications manually and reading every JD by hand, so I built a tool to automate the painful parts. The result is a full-stack AI system that scores how well your CV matches any job description in seconds.

---

## 📸 Screenshots

### Dashboard
![Dashboard](dashboard.png)

### AI Match Analyser
![Analyser](analyser.png)

### Add Application
![Add](add.png)

---

## ✨ Features

- **AI Match Scoring** — semantic cosine similarity between your CV and any JD using Sentence Transformers (all-MiniLM-L6-v2)
- **LLM Job Analysis** — extracts required skills, key technologies, and role summary using Groq Llama 3.3 via LangChain
- **AI Career Coach Feedback** — 3-point personalised feedback: what matches, what is missing, one improvement tip
- **PDF Upload** — upload your CV and JD as PDFs, text extracted automatically in the browser via pdf.js
- **Application Pipeline Tracker** — track every application with status updates (Applied, Interview, Offer, Rejected)
- **Live Dashboard** — stats cards, bar chart pipeline view, full application list
- **Production Ready** — Docker Compose, GitHub Actions CI/CD, deployable to AWS EC2

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python 3.11, SQLAlchemy |
| AI / NLP | Sentence Transformers, LangChain, Groq Llama 3.3 |
| Database | PostgreSQL |
| DevOps | Docker, Docker Compose, GitHub Actions CI/CD |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/Jk180603/SmartHire-AI.git
cd SmartHire-AI
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/smarthire
GROQ_API_KEY=your_groq_key_here
SECRET_KEY=smarthire_secret_2026
```

```bash
psql -U postgres -c "CREATE DATABASE smarthire;"
uvicorn app.main:app --reload --port 8001
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Docker (run everything at once)

```bash
GROQ_API_KEY=your_key_here docker-compose up --build
```

---

## 🏗️ Project Structure

```
SmartHire-AI/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS
│   │   ├── models.py        # SQLAlchemy models (3 tables)
│   │   ├── routes.py        # REST API endpoints
│   │   ├── ai_engine.py     # LLM + semantic matching logic
│   │   ├── schemas.py       # Pydantic request/response models
│   │   └── database.py      # PostgreSQL connection
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Dashboard
│   │   ├── add/page.tsx     # Add application
│   │   └── analyse/page.tsx # AI analyser with PDF upload
│   ├── lib/api.ts           # Axios API client
│   └── Dockerfile
├── .github/
│   └── workflows/ci.yml     # GitHub Actions CI
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/applications` | Add new application |
| GET | `/applications` | List all applications |
| POST | `/analyse` | Run AI analysis |
| PUT | `/applications/{id}` | Update status |
| GET | `/dashboard/stats` | Pipeline statistics |

Full interactive docs: `http://localhost:8001/docs`

---

## 🤖 How the AI Works

```
Your CV + Job Description
         ↓
Sentence Transformers (all-MiniLM-L6-v2)
         ↓
Vector Embeddings → Cosine Similarity → Match Score (0-100%)
         ↓
Groq Llama 3.3 via LangChain
         ↓
Required Skills + Key Technologies + 3-Point Feedback
```

Two separate AI systems working together:
- **Semantic matching** is fast and deterministic — same inputs always give same score
- **LLM analysis** is generative — gives different phrasing each time but consistent substance

---

## 📊 Why I Built This

Managing a job search across 20+ applications is genuinely painful. Every JD needs to be read carefully, every application needs to be tracked, and you constantly wonder whether your CV even matches what they want.

I built SmartHire AI to solve my own problem — and ended up with a project that covers every layer of the stack I care about: data modeling with PostgreSQL, NLP with sentence transformers, LLM integration with LangChain and Groq, REST API design with FastAPI, full-stack UI with Next.js and TypeScript, and deployment automation with Docker and GitHub Actions.

---

## 📄 License

MIT

---

## 👨‍💻 Author

**Jay Khakhar** — MSc AI @ BTU Cottbus-Senftenberg, Germany

[![LinkedIn](https://img.shields.io/badge/LinkedIn-jay--khakhar--w18-blue)](https://linkedin.com/in/jay-khakhar-w18)
[![GitHub](https://img.shields.io/badge/GitHub-Jk180603-black)](https://github.com/Jk180603)
