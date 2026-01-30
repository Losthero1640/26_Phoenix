from fastapi import APIRouter, Depends, HTTPException, status, Header
from schemas import SignupIn, LoginIn, TokenResp
from service import create_user, get_user_by_email, login_user, archive_and_clear_session, refresh_tokens
from mongo import db
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResp, status_code=201)
async def signup(payload: SignupIn):
    existing = await get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await create_user(payload.email, payload.password)
    # auto-login after signup
    res = await login_user(payload.email, payload.password)
    if not res:
        raise HTTPException(500, "signup failed")
    return {"access_token": res["access_token"], "refresh_token": res["refresh_token"], "session_id": res["session_id"]}

@router.post("/login", response_model=TokenResp)
async def login(payload: LoginIn):
    res = await login_user(payload.email, payload.password)
    if not res:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # return tokens, session id and archived history
    return {
        "access_token": res["access_token"],
        "refresh_token": res["refresh_token"],
        "session_id": res["session_id"],
        "history": res.get("history", [])
    }

@router.post("/refresh", response_model=TokenResp)
async def refresh(authorization: str = Header(...)):
    try:
        # Extract token from "Bearer <token>" format
        token = authorization.split()[-1] if " " in authorization else authorization
        
        res = await refresh_tokens(token)
        if not res:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        return {
            "access_token": res["access_token"],
            "refresh_token": res["refresh_token"],
            "session_id": res.get("session_id", "")
        }
    except Exception as e:
        print(f"Refresh error: {e}")
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    
@router.post("/logout")
async def logout(user_id: str, session_id: str):
    # user_id can be obtained from access token in production; here we accept param for clarity
    # Archive current session messages and clear active session
    await archive_and_clear_session(user_id, session_id)
    return {"ok": True}

@router.get("/history")
async def history(user_id: str):
    # return archived sessions for user
    cur = db["session_archives"].find({"user_id": user_id}).sort("archived_at", -1)
    return [doc async for doc in cur]