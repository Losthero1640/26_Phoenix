from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import importlib.util

# Pydantic's EmailStr requires the optional `email-validator` dependency.
# If it's not installed, importing/starting the app will crash while building schemas.
EmailField = EmailStr if importlib.util.find_spec("email_validator") is not None else str

class SessionMsg(BaseModel):
    role: str
    content: str
    ts: Optional[datetime]

class SessionArchive(BaseModel):
    session_id: str
    archived_at: datetime
    messages: List[SessionMsg]

class SignupIn(BaseModel):
    email: EmailField
    password: str

class LoginIn(BaseModel):
    email: EmailField
    password: str

class TokenResp(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    session_id: str
    history: Optional[List[SessionArchive]] = None



