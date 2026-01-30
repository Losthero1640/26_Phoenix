import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib
import base64
from typing import Tuple
import uuid

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_MINUTES = int(os.getenv("ACCESS_MINUTES", "15"))
REFRESH_DAYS = int(os.getenv("REFRESH_DAYS", "30"))

def _hash_token(token: str) -> str:
    # store hashed refresh token (SHA256, base64)
    h = hashlib.sha256(token.encode()).digest()
    return base64.b64encode(h).decode()

def create_access_token(user_id: str, expires_delta: timedelta = None):
    if expires_delta is None:
        expires_delta = timedelta(hours=1)
    
    expire = datetime.utcnow() + expires_delta
    payload = {
        "sub": user_id,
        "exp": expire
    }
    encoded_jwt = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt 

def create_refresh_token(user_id: str):
    expires = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": user_id,
        "exp": expires,
        "jti": str(uuid.uuid4())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM) 

def hash_refresh_token(token: str) -> str:
    return _hash_token(token)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.JWTError as e:
        print(f"JWT error: {e}")
        return None