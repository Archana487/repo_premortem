# RepoPremortem AI 💀

**RepoPremortem AI** is a powerful full-stack tool that predicts the "inevitable failure" of your software projects before they even hit production. By analyzing your codebase using Gemini AI, it identifies architectural bottlenecks, scalability cliffs, and systemic risks.

![Frontend Overview](frontend/public/favicon.ico) <!-- Placeholder for actual screenshot if available -->

## 🚀 Features

- **Deep Code Analysis**: Clones any public GitHub repository and parses the structure and source code.
- **AI-Driven Risk Assessment**: Uses Gemini AI (Flash) to perform a "Staff SRE" level pre-mortem analysis.
- **Categorized Risks**: Detailed breakdown of technical debt, architectural flaws, and scalability issues.
- **Simplified Explanations**: Provides analogies for non-technical stakeholders to understand system-killing risks.
- **10x Scale Simulation**: Specifically targets bottlenecks that appear when traffic grows tenfold.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Repository Processing**: [GitPython](https://gitpython.readthedocs.io/)
- **Deployment**: Render / Railway

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Lucide React](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: Netlify / Vercel

## 📦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/app/apikey)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Archana487/repo_premortem.git
   cd repo_premortem
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend
Deploy to **Render** or **Railway**.
- Root directory: `backend`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: `GOOGLE_API_KEY`

### Frontend
Deploy to **Netlify** (configured with `netlify.toml`).
- Base directory: `frontend`
- Build Command: `npm run build`
- Publish directory: `.next`
- Environment Variables: `NEXT_PUBLIC_API_URL` (Point to your deployed backend)

---

Built with 💀 by [Archana487](https://github.com/Archana487)
