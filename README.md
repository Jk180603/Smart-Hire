# SmartHire AI 🎯

**An intelligent job application tracker powered by LLMs, semantic matching, and a full-stack modern tech stack.**

Built as a personal tool to manage my own job search — and ended up being one of the most complete projects I have shipped. Upload your CV, paste a job description, and get an AI-powered match score with career coach feedback in seconds.

---

## 🖥️ Live Demo



---

## ✨ Features

- **AI Match Scoring** — semantic similarity between your CV and any job description using sentence-transformers (DistilBERT)
- **LLM Job Analysis** — extracts required skills, key technologies, and role summary from any JD using Groq Llama 3
- **AI Career Coach Feedback** — 3-point feedback on what matches, what is missing, and how to improve
- **PDF Upload** — upload your CV and JD as PDFs, text is extracted automatically
- **Application Pipeline Tracker** — track every application with status (Applied, Interview, Offer, Rejected)
- **Live Dashboard** — stats cards, bar chart, and full application list with one-click status updates
- **Production Ready** — Docker Compose, GitHub Actions CI/CD, AWS EC2 deployment ready

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python, SQLAlchemy |
| AI / ML | Groq Llama 3.3, LangChain, Sentence Transformers, DistilBERT |
| Database | PostgreSQL |
| DevOps | Docker, Docker Compose, GitHub Actions CI/CD |
| Cloud | AWS EC2 ready |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Groq API key (free at [console.groq.com](https://console.groq.com))

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

Create `.env` file in the backend folder:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/smarthire
GROQ_API_KEY=your_groq_key_here
SECRET_KEY=smarthire_secret_2026
```

Create the database:

```bash
psql -U postgres
CREATE DATABASE smarthire;
\q
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8001
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Or run everything with Docker

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

### Dashboard
> Add screenshot here

### AI Match Analyser
> Add screenshot here

### Add Application
> Add screenshot here

---

## 🏗️ Project Structure

```
SmartHire-AI/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── models.py        # SQLAlchemy database models
│   │   ├── routes.py        # REST API endpoints
│   │   ├── ai_engine.py     # Groq LLM + sentence transformers
│   │   ├── schemas.py       # Pydantic request/response models
│   │   └── database.py      # PostgreSQL connection
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── add/page.tsx     # Add application form
│   │   └── analyse/page.tsx # AI match analyser
│   └── lib/
│       └── api.ts           # API client
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/applications` | Add new application |
| GET | `/applications` | List all applications |
| POST | `/analyse` | Run AI match analysis |
| PUT | `/applications/{id}` | Update application status |
| GET | `/dashboard/stats` | Get pipeline statistics |

Full API docs available at `http://localhost:8001/docs`

---

## 🤖 How the AI Works

1. **JD Analysis** — Groq Llama 3.3 extracts required skills, nice-to-have skills, key technologies, and a role summary from any job description
2. **Semantic Matching** — DistilBERT (via sentence-transformers) encodes both your CV and the JD into vector embeddings, then computes cosine similarity to generate a match score from 0 to 100
3. **Career Feedback** — Groq generates 3-point feedback: what matches well, what is missing, and one improvement tip

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

Services:
- `backend` — FastAPI on port 8001
- `db` — PostgreSQL on port 5432
- `frontend` — Next.js on port 3000

---

## 📊 Why I Built This

I built SmartHire AI while actively applying for working student roles in Berlin. I was tracking 20+ applications in a spreadsheet and manually reading each JD — so I built a tool to automate the painful parts.

The result is a full-stack AI system that covers every layer of the stack I care about: SQL and data modeling, ML with PyTorch-based embeddings, LLM integration with LangChain, FastAPI backend, Next.js frontend, and Docker deployment.

---

## 📄 License

MIT

---

## 👨‍💻 Author

**Jay Khakhar** — MSc AI @ BTU Cottbus

[LinkedIn](https://linkedin.com/in/jay-khakhar-w18) · [GitHub](https://github.com/Jk180603)