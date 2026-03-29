# Backend Tech Stack - Quick Reference
## EnergySync FastAPI + MongoDB + Redis + Celery

---

## 📚 Quick Links

### Official Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Motor (Async MongoDB)](https://motor.readthedocs.io/)
- [Celery Docs](https://docs.celeryproject.io/)
- [Redis Docs](https://redis.io/documentation)
- [Pydantic Docs](https://pydantic-docs.helpmanual.io/)

---

## 🔧 Core Dependencies & Versions

```
# Core Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0

# Database & ODM
motor==3.3.2
pymongo==4.6.0
mongoengine==0.29.1  # Optional: simpler ODM

# Async Support
aiofiles==23.2.1
aiohttp==3.9.1

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic-settings==2.1.0

# Database & Caching
redis==5.0.1
celery==5.3.4

# Data Processing
pandas==2.1.3
numpy==1.26.3
scikit-learn==1.3.2

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2

# Code Quality
black==23.12.1
flake8==6.1.0
pylint==3.0.3
mypy==1.7.1

# Utilities
python-dotenv==1.0.0
requests==2.31.0
click==8.1.7
```

---

## 🚀 Quick Start Commands

### Project Initialization
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Initialize database
python scripts/init_db.py

# Create indexes
python scripts/create_indexes.py

# Seed initial data
python scripts/seed_data.py
```

### Running Services
```bash
# Start FastAPI server (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002

# Start Celery worker
celery -A app.workers.celery_app worker --loglevel=info

# Start Celery beat (scheduler)
celery -A app.workers.celery_app beat --loglevel=info

# Start all services with Docker Compose
docker-compose up
```

### Testing & Quality
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Code formatting
black app/

# Linting
flake8 app/

# Type checking
mypy app/
```

---

## 📁 Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI application entry point |
| `app/core/config.py` | Configuration for dev/prod |
| `app/core/security.py` | JWT and OAuth2 settings |
| `app/db/mongodb.py` | MongoDB connection |
| `app/models/` | Pydantic + MongoDB models |
| `app/schemas/` | Request/Response schemas |
| `app/repositories/` | Data access layer (CRUD) |
| `app/services/` | Business logic |
| `app/api/v1/endpoints/` | Route handlers |
| `app/workers/tasks/` | Celery background jobs |
| `requirements.txt` | Python dependencies |
| `docker-compose.yml` | Service orchestration |

---

## 🔐 Authentication Flow Example

```python
# 1. User Login (POST /auth/login)
from app.services.auth_service import AuthService
auth_service = AuthService()
token = await auth_service.authenticate(username, password)
# Returns: {"access_token": "...", "refresh_token": "...", "token_type": "bearer"}

# 2. Add Token to Requests
# Header: Authorization: Bearer <access_token>

# 3. Token Validation (Automatic on protected routes)
from app.api.v1.dependencies import get_current_user
async def protected_route(current_user = Depends(get_current_user)):
    return {"user": current_user}

# 4. Refresh Token (POST /auth/refresh)
# Header: Authorization: Bearer <refresh_token>
```

---

## 💾 MongoDB CRUD Pattern

```python
# Model Definition (Pydantic + Motor)
from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class User(UserCreate):
    id: str = Field(alias="_id")
    is_active: bool = True
    created_at: datetime

# Repository Pattern
class UserRepository:
    def __init__(self, db):
        self.collection = db["users"]
    
    # CREATE
    async def create(self, user_data: UserCreate) -> User:
        result = await self.collection.insert_one(user_data.dict())
        return await self.get_by_id(str(result.inserted_id))
    
    # READ
    async def get_by_id(self, user_id: str) -> Optional[User]:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return User(**user) if user else None
    
    async def get_all(self, skip: int = 0, limit: int = 10):
        cursor = self.collection.find().skip(skip).limit(limit)
        return [User(**user) async for user in cursor]
    
    # UPDATE
    async def update(self, user_id: str, user_data: dict):
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": user_data}
        )
        return await self.get_by_id(user_id)
    
    # DELETE
    async def delete(self, user_id: str):
        await self.collection.delete_one({"_id": ObjectId(user_id)})

# Service Layer (Business Logic)
class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo
    
    async def create_user(self, user_data: UserCreate):
        # Validation, password hashing, etc.
        user = await self.repo.create(user_data)
        return user

# API Endpoint
@router.post("/users", response_model=User)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return await service.create_user(user_data)
```

---

## 📋 Common FastAPI Patterns

### 1. Dependency Injection
```python
# Define dependency
async def get_db():
    client = AsyncMongoClient(MONGODB_URL)
    db = client["gemats"]
    try:
        yield db
    finally:
        client.close()

# Use in endpoint
@app.get("/items")
async def get_items(db = Depends(get_db)):
    items = await db["items"].find().to_list(length=None)
    return items
```

### 2. Request/Response Validation
```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)

# Automatic validation, returns 422 if invalid
@app.post("/users")
async def create(user: UserCreate):
    return user
```

### 3. Error Handling
```python
from fastapi import HTTPException

@app.get("/users/{user_id}")
async def get_user(user_id: str, db = Depends(get_db)):
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### 4. Background Tasks
```python
from fastapi import BackgroundTasks

@app.post("/send-email")
async def send_email(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_background, email)
    return {"message": "Email queued"}

def send_email_background(email: str):
    # Send email here
    pass
```

---

## 🔄 Celery Task Pattern

```python
# Define Task
from app.workers.celery_app import celery_app

@celery_app.task
def process_iex_data(data: dict):
    """Background task to process IEX data"""
    # Heavy processing
    return {"status": "completed"}

# Call Task
from app.workers.tasks import process_iex_data

# Asynchronous
task = process_iex_data.delay(data)

# Get result
result = task.get(timeout=300)

# Check status
print(task.state)  # PENDING, STARTED, SUCCESS, FAILURE

# Scheduled Task (Celery Beat)
from celery.schedules import crontab

app.conf.beat_schedule = {
    'poll-iex-every-5-mins': {
        'task': 'app.workers.tasks.data_ingestion.poll_iex_data',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
}
```

---

## 🗄️ MongoDB Indexing Strategy

```python
# Create Indexes (in init_db.py)
async def create_indexes():
    db = client["gemats"]
    
    # Users collection
    await db["users"].create_index("username", unique=True)
    await db["users"].create_index("email", unique=True)
    await db["users"].create_index("created_at")
    
    # Forecast data (frequently queried)
    await db["forecast_data"].create_index([("forecast_date", 1), ("period", 1)])
    await db["forecast_data"].create_index("market_type")
    await db["forecast_data"].create_index([("created_at", -1)], background=True)
    
    # Real-time data
    await db["iex_data"].create_index([("timestamp", -1)])
    await db["iex_data"].create_index("area_code")
    
    # Compound index for range queries
    await db["iex_data"].create_index([
        ("delivery_date", 1),
        ("period", 1),
        ("area_code", 1)
    ])
```

---

## 🔗 Redis Caching Patterns

```python
# Service with Caching
class AnalyticsService:
    def __init__(self, cache: Redis):
        self.cache = cache
    
    async def get_price_volume_data(self, date_range: str):
        # Check cache
        cache_key = f"pvd:{date_range}"
        cached = await self.cache.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        # Fetch from DB
        data = await self._compute_from_db(date_range)
        
        # Cache for 1 hour
        await self.cache.setex(
            cache_key,
            3600,  # TTL in seconds
            json.dumps(data)
        )
        
        return data
    
    async def _compute_from_db(self, date_range: str):
        # Database query
        pass

# Invalidate cache on data update
async def update_forecast(forecast_id: str, new_data: dict):
    # Update DB
    await forecast_repo.update(forecast_id, new_data)
    
    # Invalidate related cache
    keys_to_delete = await cache.keys("forecast_metrics:*")
    if keys_to_delete:
        await cache.delete(*keys_to_delete)

```

---

## 📊 API Response Format Standard

```python
# Standard Response Model
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Success Response
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": "123",
        "username": "john"
    },
    "error": null,
    "timestamp": "2024-01-15T10:30:00"
}

# Error Response
{
    "success": false,
    "message": "Invalid request",
    "data": null,
    "error": "Email already exists",
    "timestamp": "2024-01-15T10:30:00"
}

# Pagination Response
{
    "success": true,
    "message": "Users retrieved",
    "data": {
        "items": [...],
        "total": 100,
        "skip": 0,
        "limit": 10,
        "pages": 10
    }
}
```

---

## 🧪 Testing Example

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/users",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "securepass123"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["success"] == True
        assert data["data"]["username"] == "testuser"

@pytest.mark.asyncio
async def test_get_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/users/123",
            headers={"Authorization": "Bearer <token>"}
        )
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_user_not_found():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/users/nonexistent")
        assert response.status_code == 404
```

---

## 🔍 Debugging Tips

### 1. Enable Logging
```python
# main.py
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.debug(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.debug(f"Response: {response.status_code}")
    return response
```

### 2. MongoDB Shell Access
```bash
# Access MongoDB via Docker
docker exec -it gemats-mongodb mongosh

# List databases
show databases

# Use database
use gemats

# Check collections
show collections

# Query data
db.users.find().pretty()
db.users.findOne({"_id": ObjectId("...")})
```

### 3. Redis CLI
```bash
# Access Redis via Docker
docker exec -it gemats-redis redis-cli

# View all keys
KEYS *

# Get value
GET <key>

# Check memory
INFO memory

# Monitor commands
MONITOR
```

### 4. Celery Task Inspection
```bash
# Inspect worker
celery -A app.workers.celery_app inspect active

# View task history
celery -A app.workers.celery_app events

# Purge queue
celery -A app.workers.celery_app purge
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never hardcode secrets
   - Use `.env` files (add to `.gitignore`)
   - Load via `pydantic-settings`

2. **Password Hashing**
   ```python
   from passlib.context import CryptContext
   pwd_context = CryptContext(schemes=["bcrypt"])
   hashed = pwd_context.hash(password)
   pwd_context.verify(password, hashed)
   ```

3. **JWT Expiration**
   - Access token: 15 minutes
   - Refresh token: 7 days
   - Always validate expiration

4. **CORS Configuration**
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:4200"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

5. **Input Validation**
   - Always use Pydantic models
   - Validate data types and ranges
   - Use custom validators

---

## 📈 Performance Tips

1. **Database Queries**
   - Use compound indexes for frequent queries
   - Limit fields returned with projection
   - Use aggregation pipeline for complex queries

2. **Caching Strategy**
   - Cache read-heavy endpoints
   - Cache pre-computed analytics
   - Set appropriate TTLs

3. **Async/Await**
   - Use async/await for I/O operations
   - Avoid blocking operations in endpoints

4. **Pagination**
   - Always paginate large result sets
   - Use skip+limit or cursor-based

5. **Connection Pooling**
   - Configure MongoDB connection pool
   - Reuse Redis connections

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups tested
- [ ] Redis persistence configured
- [ ] Logging to file system
- [ ] Error monitoring (Sentry/DataDog)
- [ ] Health check endpoints
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Database replication setup
- [ ] Scaling parameters configured
- [ ] Monitoring and alerts setup

---

**Questions? Questions? Let's discuss implementation details!** 💬
