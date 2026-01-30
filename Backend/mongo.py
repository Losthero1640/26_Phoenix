from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "phoenix")

_client = None
db = None

def init_mongo():
    global _client, db
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI)
        db = _client[DB_NAME]
    return db

# init on import
init_mongo()