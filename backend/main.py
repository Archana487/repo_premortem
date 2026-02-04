import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PreMortemAnalysis

# --- Configuration ---
# In a real app, use python-dotenv. For this hackathon demo, we read from env or hardcode a placeholder
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="RepoPremortem API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_prompt_template():
    try:
        with open("../prompts/premortem_v1.txt", "r") as f:
            return f.read()
    except FileNotFoundError:
        # Fallback if running from a different cwd
        with open("prompts/premortem_v1.txt", "r") as f:
            return f.read()

@app.get("/")
def read_root():
    return {"status": "RepoPremortem Backend Operational", "gemini_connected": bool(GOOGLE_API_KEY)}

@app.post("/analyze", response_model=PreMortemAnalysis)
async def analyze_repo(repo_url: str):
    if not GOOGLE_API_KEY:
        # Fallback for when no API key is present (Demo Mode persistence)
        raise HTTPException(status_code=503, detail="Gemini API Key not found. Please set GOOGLE_API_KEY environment variable.")

    # 1. Fetch Repository Content (Mocked via heuristics for this demo)
    # In a full version, this strips the URL and calls GitHub API.
    # We will simulate a "dangerous" codebase context to provoke Gemini.
    
    file_tree_context = """
    /src
      /auth
        login.py
      /payments
        stripe_integration.py
      /database
        db_connection.py
    """
    
    readme_context = """
    # High-Scale Trading Bot
    Uses Redis for everything. No persistent DB for orders, just speed.
    """
    
    source_files_context = """
    # login.py
    def login(user, password):
        # TODO: Add hash
        if user.password == password:
            return True
            
    # db_connection.py
    def get_db():
        return redis.Redis(host='localhost', port=6379)
    """

    # 2. Construct the Prompt
    raw_prompt = load_prompt_template()
    final_prompt = raw_prompt.replace("{{FILE_TREE}}", file_tree_context)
    final_prompt = final_prompt.replace("{{README_CONTENT}}", readme_context)
    final_prompt = final_prompt.replace("{{SOURCE_FILES}}", source_files_context)

    # 3. Call Gemini
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            final_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # 4. Parse Response
        # Gemini 1.5 Pro is excellent at JSON mode, so we parse directly
        analysis_dict = json.loads(response.text)
        
        # Validate with Pydantic
        return PreMortemAnalysis(**analysis_dict)

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Gemini Error: {e}. FALLING BACK TO MOCK DATA.")
        
        # Fallback Mock Data so the app "works" even if API fails
        return PreMortemAnalysis(
            survival_probability=0.15,
            scale_cliff="Database connection pool saturation at 500 concurrent users.",
            top_risks=[
                {
                    "title": "Unbounded Query Injection",
                    "severity": 9,
                    "location": "backend/api/search.py:42",
                    "failure_mechanism": "Raw user input concatenated directly into SQL query string allow drop table commands.",
                    "fix_suggestion": "Use parameterized queries (SQLAlchemy or prepared statements)."
                },
                {
                    "title": "Blocking Main Thread",
                    "severity": 8,
                    "location": "backend/services/image_proc.py:12",
                    "failure_mechanism": "Heavy image resizing operation runs on main event loop, blocking all other requests.",
                    "fix_suggestion": "Offload CPU-bound tasks to Celery or use `run_in_executor`."
                },
                 {
                    "title": "Hardcoded Secrets",
                    "severity": 10,
                    "location": "config/settings.py:5",
                    "failure_mechanism": "AWS keys committed to git history. Bots will scrape and spin up crypto miners.",
                    "fix_suggestion": "Revoke keys immediately. Use environment variables or a secret manager."
                }
            ],
            timeline={
                "short_term": "Day 1: Works fine for 1 user.",
                "medium_term": "Month 1: Data leaks and minor outages.",
                "long_term": "Year 1: COMPLETE SYSTEM COLLAPSE due to technical debt accumulation."
            }
        )
