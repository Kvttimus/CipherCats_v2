from flask import Flask, request, jsonify
from flask_cors import CORS
import os, jwt
from datetime import datetime, timezone
import logging
from supabase import create_client, Client

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET"
]

missingVars = [var for var in requiredEnvVars if not os.environ.get(var)]
if missingVars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missingVars)}")

ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development frontend
    "http://localhost:3000",  # Alternative dev port
]

prodOrigins = os.environ.get("ALLOWED_ORIGINS")
if prodOrigins:
    ALLOWED_ORIGINS.extend(prodOrigins.split(","))

CORS(app, supports_credentials=True, origins=ALLOWED_ORIGINS)

# Builds a supabase client using Service Role key (full DB privileges) - DONT RUN IN BROWSER
try:
    supabase: Client = create_client(
        os.environ["NEXT_PUBLIC_SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    )
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize supabase client: {e}")
    raise

JWT_SECRET = os.environ["SUPABASE_JWT_SECRET"]

# Get userId from JWT
def getUserIdFromBearer():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        logger.warning("Expired JWT token")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None
    except Exception as e:
        logger.error(f"JWT decode error: {e}")
        return None 
    
# Get current time in UTC
def getUtcTimestamp():
    return datetime.now(timezone.utc).isoformat()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "internal server error"}), 500
    
# Root so browser stops 404'ing
@app.get("/")
def root():
    return jsonify({"ok": True, "routes": ["/health", "/labs/<key>", "/submissions"]})

# Fetch a lab
@app.get("/labs/<key>")
def getLab(key):
    userId = getUserIdFromBearer()
    if not userId:
        return jsonify({"error":"unauthorized"}), 401
    
    if not key or not key.strip():
        return jsonify({"error": "lab key is required"}), 400

    try:
        res = supabase.table("labs").select("*").eq("key", key).limit(1).execute()
        rows = res.data or []
        if not rows:
            return jsonify({"error": "lab not found"}), 404
        
        lab = rows[0]

        return jsonify({
            "key":lab["key"], 
            "title":lab["title"], 
            "prompt":lab["prompt"]
        })
    except Exception as e:
        logger.error(f"Error fetching lab {key}: {e}")
        return jsonify({"error": "internal server error"}), 500

# Submit an Answer
@app.post("/submissions")
def submit():
    userId = getUserIdFromBearer()
    if not userId:
        return jsonify({"error":"unauthorized"}), 401
    
    if not request.is_json:
        return jsonify({"error": "request must be JSON"}), 400

    body = request.get_json() or {}
    key = body.get("key", "").strip()
    answer = body.get("answer", "").strip()

    if not key:
        return jsonify({"error": "lab key is required"}), 400
    if not answer:
        return jsonify({"error": "answer is required"}), 400

    try:
        labRes = supabase.table("labs").select("*").eq("key", key).limit(1).execute()

        labRows = labRes.data or []
        if not labRows:
            return jsonify({"error": "lab not found"}), 400
        lab = labRows[0]

        isCorrect = (answer.upper() == lab["expected_answer"].upper())

        supabase.table("submissions").insert({
                "user_id": userId,
                "lab_id": lab["id"],
                "answer": answer,
                "is_correct": isCorrect
            }).execute()
        
        attemptsRes = (
            supabase.table("progress")
            .select("attempts")
            .eq("user_id", userId)
            .eq("lab_id", lab["id"])
            .limit(1)
            .execute()
        )
        
        attemptsRows = attemptsRes.data or []
        currentAttempts = attemptsRows[0]["attempts"] if attemptsRows else 0

        # Update progress (repeated attempts overwrite)
        progressData = {
            "user_id": userId,
            "lab_id": lab["id"],
            "status": "completed" if isCorrect else "unlocked",
            "attempts": currentAttempts + 1,
            "updated_at": getUtcTimestamp(),
        }
        supabase.table("progress").upsert(progressData, on_conflict="user_id,lab_id").execute()

        return jsonify({
            "correct": isCorrect,
            "attempts": currentAttempts + 1
        })
    except Exception as e:
        logger.error(f"Error processing submission: {e}")
        return jsonify({"error": "internal server error"}), 500
    
# Simple health checkpoint
@app.get("/health")
def healthCheck():
    return jsonify({
        "status": "healthy",
        "timestamp": getUtcTimestamp()
    })

if __name__ == "__main__":
    # Development server settings
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("FLASK_ENV") == "development"
    
    if debug:
        logger.warning("Running in debug mode - DO NOT use in production!")
    
    app.run(port=port, debug=debug, host="0.0.0.0")