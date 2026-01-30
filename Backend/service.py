from tokens import create_access_token, create_refresh_token, hash_refresh_token, decode_token
from mongo import db
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime
from typing import List
import uuid
from pymongo import ReturnDocument

# Use a pure-Python hash to avoid platform-specific bcrypt/argon2 backends.
# This prevents signup/login from 500'ing on Windows due to missing/unsupported backends.
pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
USERS = "users"
SESSIONS = "sessions"
ARCHIVES = "session_archives"

async def get_user_by_email(email: str):
    return await db[USERS].find_one({"email": email})

async def create_user(email: str, password: str):
    password = password[:72]
    existing = await db["users"].find_one({"email": email})
    if existing:
        return None
    hashed = pwd_ctx.hash(password)
    user = {"email": email, "password": hashed, "refresh_hash": None, "created_at": datetime.utcnow()}
    res = await db[USERS].insert_one(user)
    user["_id"] = res.inserted_id
    return user

async def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

async def create_session(user_id) -> str:
    session_id = str(uuid.uuid4())
    doc = {
        "session_id": session_id,
        "user_id": user_id,
        "messages": [],
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    await db[SESSIONS].insert_one(doc)
    return session_id

async def archive_and_clear_session(user_id, session_id):
    # atomically fetch messages, archive them, then clear & deactivate session
    sess = await db[SESSIONS].find_one({"user_id": user_id, "session_id": session_id})
    if not sess:
        return
    msgs = sess.get("messages", [])
    if msgs:
        archive = {
            "user_id": user_id,
            "session_id": session_id,
            "messages": msgs,
            "archived_at": datetime.utcnow(),
        }
        await db[ARCHIVES].insert_one(archive)
    # clear messages and deactivate session
    await db[SESSIONS].update_one(
        {"user_id": user_id, "session_id": session_id},
        {"$set": {"messages": [], "is_active": False}}
    )

async def get_archived_history(user_id) -> List[dict]:
    cur = db[ARCHIVES].find({"user_id": user_id}).sort("archived_at", -1)
    return [doc async for doc in cur]

async def login_user(email: str, password: str):
    user = await db["users"].find_one({"email": email})
    if not user or not pwd_ctx.verify(password, user["password"]):
        return None
    
    user_id = str(user["_id"])
    
    # These functions return single values, not tuples
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    
    # Create session
    session = {
        "user_id": user_id,
        "session_id": str(__import__('uuid').uuid4()),
        "created_at": datetime.utcnow()
    }
    await db["sessions"].insert_one(session)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "session_id": session["session_id"]
    }

async def refresh_tokens(token: str):
    from tokens import decode_token, create_access_token, create_refresh_token
    
    try:
        payload = decode_token(token)
        if not payload:
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        # Verify user still exists
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            return None
        
        # Generate new tokens
        new_access = create_access_token(user_id)
        new_refresh = create_refresh_token(user_id)
        
        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "session_id": ""
        }
    except Exception as e:
        print(f"Token refresh error: {e}")
        return None