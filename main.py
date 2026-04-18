import csv
import os
import requests
import warnings
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib3.exceptions import InsecureRequestWarning
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

# Suppress SSL warnings (only for fallback case)
warnings.filterwarnings('ignore', category=InsecureRequestWarning)

load_dotenv()

CSV_URL = os.getenv("CSV_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not CSV_URL:
    raise RuntimeError("CSV_URL missing in .env")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env")

# Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the index.html file at the root path
@app.get("/", response_class=HTMLResponse)
async def read_root():
    try:
        with open("index.html", "r") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    except FileNotFoundError:
        return HTMLResponse(content="<h1>index.html not found</h1>", status_code=404)

# Request model
class ChatRequest(BaseModel):
    email: str
    message: str

def get_requests_session():
    """Create a requests session with retry logic and SSL handling"""
    session = requests.Session()
    
    # Configure retry strategy
    retry_strategy = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    
    return session

def fetch_user_profile(email: str):
    session = get_requests_session()
    
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = session.get(CSV_URL, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.exceptions.SSLError as e:
        # If SSL error occurs, try with verify=False as fallback (not recommended for production)
        print(f"SSL Error occurred, retrying with relaxed SSL verification: {e}")
        response = session.get(CSV_URL, headers=headers, timeout=30, verify=False)
        response.raise_for_status()
    finally:
        session.close()

    decoded = response.content.decode("utf-8").splitlines()
    reader = csv.DictReader(decoded)

    for row in reader:
        if row.get("Email") == email:   # IMPORTANT: must match EXACT column name
            return row

    return None


@app.post("/chat")
def chat(req: ChatRequest):

    # Step 1: Fetch profile from Google Sheet
    profile = fetch_user_profile(req.email)
    print(profile)

    if not profile:
        raise HTTPException(status_code=404, detail="User not found in Google Sheet")

    # Step 2: Build system prompt
    system_prompt = f"""
You are HealthBuddy, a friendly health assistant chatbot.
Speak warmly, like a supportive friend/doctor.
Do NOT provide medical diagnosis.
Base your response on this user's profile:

Name: {profile.get("Name")}
Age: {profile.get("Age")}
Gender: {profile.get("Gender")}
Health Conditions: {profile.get("Current Health Conditions")}
Lifestyle: {profile.get("Daily Activity Level")}
Diet: {profile.get("diet")}
Goals: {profile.get("What are your current health goals?")}
Sleep: {profile.get("sleep")}
Water Intake: {profile.get("Water Intake per Day")}
Allergies: {profile.get("Any allergies?")}
Notes: {profile.get("Anything else you want your health assistant to know?")}

Always include the user's name in your greeting.
    """

    # Step 3: Send message to Gemini
    combined_input = system_prompt + "\nUser: " + req.message

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=combined_input
    )

    reply = response.text

    # Step 4: Return chatbot reply
    return {"reply": reply}
