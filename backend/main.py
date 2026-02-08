import os
import json
import shutil
import tempfile
import traceback
import git
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PreMortemAnalysis
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not set in environment variables.")

genai.configure(api_key=GOOGLE_API_KEY)

# genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="RepoPremortem AI API")

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

# --- Helper: Repository Processing ---
RELEVANT_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.go', '.rs', '.java', '.c', '.cpp', '.h', 
    '.rb', '.php', '.md', '.json', '.yml', '.yaml', '.toml', '.dockerfile', 'Dockerfile'
}

IGNORED_DIRS = {
    '.git', 'node_modules', 'venv', '.venv', 'dist', 'build', '__pycache__', 
    '.idea', '.vscode', 'coverage'
}

def analyze_repo_content(repo_url: str):
    """
    Clones the repo to a temp dir, extracts file tree and source content.
    Returns (file_tree_str, source_content_str, readme_content_str)
    """
    temp_dir = tempfile.mkdtemp()
    try:
        print(f"Cloning {repo_url} into {temp_dir}...")
        git.Repo.clone_from(repo_url, temp_dir, depth=1)
        
        file_tree_lines = []
        source_content_parts = []
        readme_content = "No README found."
        
        # Max chars to feed Gemini to avoid token limits (conservative estimate)
        MAX_SOURCE_CHARS = 100000 
        current_source_chars = 0
        
        for root, dirs, files in os.walk(temp_dir):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            
            rel_root = os.path.relpath(root, temp_dir)
            if rel_root == ".":
                rel_root = ""
                indent_level = 0
            else:
                indent_level = rel_root.count(os.sep) + 1
                
            if rel_root:
                file_tree_lines.append(f"{'  ' * (indent_level - 1)}/{os.path.basename(root)}")
                
            for file in files:
                file_path = os.path.join(root, file)
                rel_file_path = os.path.join(rel_root, file)
                
                # File Tree
                file_tree_lines.append(f"{'  ' * indent_level}{file}")
                
                # Content Extraction
                _, ext = os.path.splitext(file)
                
                if file.lower() == "readme.md":
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            readme_content = f.read()
                    except Exception:
                        pass
                
                elif ext in RELEVANT_EXTENSIONS and current_source_chars < MAX_SOURCE_CHARS:
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                            # Basic check to avoid minified files or huge logs
                            if len(content) < 50000 and "\x00" not in content: 
                                source_part = f"\n# --- {rel_file_path} ---\n{content}\n"
                                source_content_parts.append(source_part)
                                current_source_chars += len(source_part)
                    except Exception:
                        continue # Skip unreadable files
                        
        file_tree_str = "\n".join(file_tree_lines)
        source_content_str = "".join(source_content_parts)
        
        if current_source_chars >= MAX_SOURCE_CHARS:
            source_content_str += "\n\n[... Truncated due to size limits ...]"
            
        return file_tree_str, source_content_str, readme_content

    except Exception as e:
        print(f"Error processing repo: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Failed to clone or process repository: {str(e)}")
        
    finally:
        # Cleanup
        try:
            # On Windows, git sometimes holds handles. Ignore errors on cleanup if needed.
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            print(f"Warning: Failed to cleanup temp dir {temp_dir}: {e}")

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "RepoPremortem AI Backend Operational", "gemini_connected": bool(GOOGLE_API_KEY)}

@app.post("/analyze", response_model=PreMortemAnalysis)
async def analyze_repo(repo_url: str):
    if not GOOGLE_API_KEY:
        # Fallback for when no API key is present
        # In real-mode, we should probably just fail, but keeping fallback for safety if key is missing 
        # is confusing. Let's error out if they want real analysis but have no key.
        raise HTTPException(status_code=503, detail="Gemini API Key not found. Please set GOOGLE_API_KEY environment variable.")

    # 1. Fetch Repository Content (REAL)
    print(f"Processing request for: {repo_url}")
    file_tree_context, source_files_context, readme_context = analyze_repo_content(repo_url)

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
        try:
            analysis_dict = json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback if JSON is malformed (sometimes happens)
            # Try to find JSON block
            import re
            match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if match:
                analysis_dict = json.loads(match.group(0))
            else:
                raise ValueError("Could not parse JSON from Gemini response")
        
        # Validate with Pydantic
        return PreMortemAnalysis(**analysis_dict)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini Analysis Failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
