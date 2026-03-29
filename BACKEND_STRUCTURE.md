# Backend Architecture & Structure Plan
## EnergySync Real-time Energy Market Platform

---

## 📋 Executive Summary

This document outlines the backend architecture for the EnergySync platform using:
- **Framework**: FastAPI (Python 3.9+)
- **Database**: MongoDB
- **Caching**: Redis
- **Task Queue**: Celery
- **Authentication**: JWT + OAuth2
- **API Documentation**: Swagger/OpenAPI

---

## 📁 Proposed Backend Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI application entry point
│   ├── config.py                        # Configuration management
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                    # Development/Production config
│   │   ├── security.py                  # JWT & OAuth2 configuration
│   │   ├── constants.py                 # Application constants
│   │   └── exceptions.py                # Custom exception definitions
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── mongodb.py                   # MongoDB connection & initialization
│   │   ├── session.py                   # Database session management
│   │   └── base.py                      # Base repository pattern
│   │
│   ├── models/                          # MongoDB data models (Pydantic + Motor)
│   │   ├── __init__.py
│   │   ├── base.py                      # Base model with timestamps
│   │   ├── user.py                      # User model
│   │   ├── role.py                      # Role & Permission models
│   │   ├── market.py                    # Market configuration models
│   │   │   ├── country.py
│   │   │   ├── state.py
│   │   │   ├── market_provider.py
│   │   │   ├── market_type.py
│   │   │   ├── rldc.py
│   │   │   ├── market_area.py
│   │   │   └── entity.py
│   │   ├── realtime_data.py             # Real-time data models
│   │   │   ├── iex_data.py
│   │   │   ├── igx_data.py
│   │   │   ├── wbes_data.py
│   │   │   ├── forecast_data.py
│   │   │   └── generator_outage.py
│   │   ├── analytics.py                 # Analytics & metrics models
│   │   ├── audit_log.py                 # Audit & logging models
│   │   └── file_upload.py               # File upload metadata
│   │
│   ├── schemas/                         # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── base.py                      # Base schema with pagination
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── market.py
│   │   ├── realtime_data.py
│   │   ├── analytics.py
│   │   └── responses.py                 # Standard response models
│   │
│   ├── repositories/                    # Data access layer (CRUD operations)
│   │   ├── __init__.py
│   │   ├── base.py                      # Base repository
│   │   ├── user_repo.py
│   │   ├── role_repo.py
│   │   ├── market_repos.py              # All market entity repos
│   │   ├── realtime_data_repo.py
│   │   ├── analytics_repo.py
│   │   └── audit_log_repo.py
│   │
│   ├── services/                        # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py              # Authentication & JWT
│   │   ├── user_service.py              # User operations
│   │   ├── role_service.py              # Role & permission management
│   │   ├── market_service.py            # Market configuration
│   │   │   ├── country_service.py
│   │   │   ├── state_service.py
│   │   │   ├── market_provider_service.py
│   │   │   ├── market_type_service.py
│   │   │   ├── rldc_service.py
│   │   │   ├── market_area_service.py
│   │   │   └── entity_service.py
│   │   ├── realtime_data_service.py     # Real-time data processing
│   │   │   ├── iex_service.py           # IEX data processing
│   │   │   ├── igx_service.py           # IGX data processing
│   │   │   ├── wbes_service.py          # WBES data processing
│   │   │   ├── forecast_service.py      # Forecast data processing
│   │   │   └── generator_service.py     # Generator data processing
│   │   ├── analytics_service.py         # Analytics calculations
│   │   │   ├── price_volume_service.py  # PVV & PVD analytics
│   │   │   ├── forecast_metrics_service.py
│   │   │   ├── statistical_service.py
│   │   │   └── graph_data_service.py
│   │   ├── cache_service.py             # Redis caching
│   │   ├── file_service.py              # File upload/download handling
│   │   └── notification_service.py      # Email/Alerts (optional)
│   │
│   ├── api/                             # API routes/endpoints
│   │   ├── __init__.py
│   │   ├── api.py                       # Main API router setup
│   │   ├── v1/                          # API version 1
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py              # Authentication endpoints
│   │   │   │   ├── users.py             # User CRUD endpoints
│   │   │   │   ├── roles.py             # Role management endpoints
│   │   │   │   ├── market/
│   │   │   │   │   ├── countries.py
│   │   │   │   │   ├── states.py
│   │   │   │   │   ├── rldcs.py
│   │   │   │   │   ├── market_areas.py
│   │   │   │   │   ├── market_providers.py
│   │   │   │   │   ├── market_types.py
│   │   │   │   │   └── entities.py
│   │   │   │   ├── realtime_data.py    # Real-time data endpoints
│   │   │   │   ├── analytics.py        # Analytics endpoints
│   │   │   │   ├── graph_data.py       # Graph data endpoints
│   │   │   │   └── files.py            # File upload/download
│   │   │   └── dependencies.py         # Common dependencies (auth, DB)
│   │
│   ├── workers/                         # Celery tasks for background processing
│   │   ├── __init__.py
│   │   ├── celery_app.py               # Celery configuration
│   │   ├── tasks/
│   │   │   ├── __init__.py
│   │   │   ├── data_ingestion.py       # Real-time data polling
│   │   │   ├── data_processing.py      # Data aggregation & processing
│   │   │   ├── analytics.py            # Scheduled analytics jobs
│   │   │   ├── notifications.py        # Alert notifications
│   │   │   └── cleanup.py              # Data cleanup/archival
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── cors.py                      # CORS configuration
│   │   ├── error_handler.py             # Global error handling
│   │   ├── logging.py                   # Request/response logging
│   │   └── audit.py                     # Audit trail middleware
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py                # Input validation utilities
│   │   ├── formatters.py                # Response formatting
│   │   ├── jwt_handler.py               # JWT utilities
│   │   ├── decorators.py                # Custom decorators
│   │   ├── logger.py                    # Logging setup
│   │   └── datetime_utils.py            # DateTime utilities
│   │
│   └── tests/                           # Test suite
│       ├── __init__.py
│       ├── conftest.py                  # pytest fixtures
│       ├── test_auth.py
│       ├── test_users.py
│       ├── test_markets.py
│       ├── test_realtime_data.py
│       ├── test_analytics.py
│       ├── integration/
│       └── e2e/
│
├── migrations/                          # MongoDB migrations (optional)
│   ├── __init__.py
│   └── scripts/
│
├── scripts/
│   ├── __init__.py
│   ├── init_db.py                       # Initialize MongoDB
│   ├── create_indexes.py                # Create DB indexes
│   ├── seed_data.py                     # Seed initial data (roles, users)
│   └── data_import.py                   # Import historical data
│
├── logs/                                # Application logs directory
│
├── uploads/                             # File upload directory
│
├── .env.example                         # Environment variables template
├── requirements.txt                     # Python dependencies
├── docker-compose.yml                   # Docker setup (MongoDB, Redis)
├── Dockerfile                           # Application Docker image
├── gunicorn_config.py                   # Gunicorn configuration
├── pytest.ini                           # Pytest configuration
├── .gitignore
└── README_BACKEND.md                    # Backend README

```

---

## 🔌 Database Schema (MongoDB Collections)

### **1. users**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password_hash: String,
  first_name: String,
  last_name: String,
  phone: String,
  roles: [ObjectId], // references to role collection
  is_active: Boolean,
  last_login: DateTime,
  profile_picture_url: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **2. roles**
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  permissions: [ObjectId], // references to privileges
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **3. privileges** (Permissions)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  module: String, // e.g., 'users', 'market', 'analytics'
  action: String, // e.g., 'create', 'read', 'update', 'delete'
  created_at: DateTime
}
```

### **4. countries**
```javascript
{
  _id: ObjectId,
  name: String (unique),
  code: String (ISO code),
  timezone: String,
  currency: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **5. states**
```javascript
{
  _id: ObjectId,
  name: String,
  country_id: ObjectId, // reference to countries
  code: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **6. market_providers**
```javascript
{
  _id: ObjectId,
  name: String,
  country_id: ObjectId,
  operator_name: String,
  website: String,
  contact_info: Object, // { email, phone, address }
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **7. market_types**
```javascript
{
  _id: ObjectId,
  name: String, // DAM, RTM, RTM192, etc.
  description: String,
  country_id: ObjectId,
  market_provider_id: ObjectId,
  blocks_count: Integer, // 96 for RTM, 192 for RTM192
  settlement_period_minutes: Integer,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **8. rldcs** (Regional Load Dispatch Centers)
```javascript
{
  _id: ObjectId,
  name: String,
  code: String (unique),
  country_id: ObjectId,
  states: [ObjectId], // references to states
  responsibility_area: String,
  contact_info: Object,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **9. market_areas**
```javascript
{
  _id: ObjectId,
  name: String,
  code: String,
  country_id: ObjectId,
  rldc_id: ObjectId,
  description: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **10. entities** (Market Participants)
```javascript
{
  _id: ObjectId,
  name: String (unique),
  type: String, // Generator, Distributor, Consumer, etc.
  country_id: ObjectId,
  state_id: ObjectId,
  market_area_id: ObjectId,
  parent_entity_id: ObjectId, // for hierarchical relationships
  license_no: String,
  contact_info: Object,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### **11. iex_status** (Real-time Data)
```javascript
{
  _id: ObjectId,
  timestamp: DateTime,
  area_code: String,
  area_type: String,
  price: Float,
  volume: Float,
  delivery_date: Date,
  period: Integer,
  created_at: DateTime
}
```

### **12. igx_data**
```javascript
{
  _id: ObjectId,
  timestamp: DateTime,
  delivery_area: String,
  delivery_area_code: String,
  price: Float,
  volume: Float,
  delivery_date: Date,
  period: Integer,
  created_at: DateTime
}
```

### **13. forecast_data**
```javascript
{
  _id: ObjectId,
  timestamp: DateTime,
  forecast_date: Date,
  period: Integer,
  model_name: String, // e.g., 'Model1', 'Model2'
  market_type: String, // DAM, RTM, etc.
  forecast_value: Float,
  actual_value: Float,
  mape: Float, // Mean Absolute Percentage Error
  rmse: Float, // Root Mean Squared Error
  created_at: DateTime
}
```

### **14. generator_outages**
```javascript
{
  _id: ObjectId,
  generator_id: ObjectId, // reference to entity
  generator_name: String,
  outage_start: DateTime,
  outage_end: DateTime,
  capacity_mw: Float,
  reason: String,
  status: String, // 'planned', 'forced', 'resolved'
  created_at: DateTime,
  updated_at: DateTime
}
```

### **15. graph_data_cache** (Pre-computed analytics)
```javascript
{
  _id: ObjectId,
  metric_type: String, // pvd, pvv, forecast_metrics, etc.
  entity_id: ObjectId,
  time_period: String, // daily, weekly, monthly
  start_date: Date,
  end_date: Date,
  data: Array, // cached graph data
  last_computed: DateTime,
  ttl: DateTime, // time-to-live for cache expiration
  created_at: DateTime
}
```

### **16. audit_logs**
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  action: String, // create, update, delete, login, export
  resource_type: String, // user, role, country, etc.
  resource_id: ObjectId,
  changes: Object, // old vs new values
  ip_address: String,
  user_agent: String,
  status: String, // success, failure
  error_message: String,
  created_at: DateTime
}
```

---

## 🔄 API Endpoint Map

### **Authentication**
```
POST   /api/v1/auth/login              - User login
POST   /api/v1/auth/register           - User registration
POST   /api/v1/auth/refresh           - Refresh JWT token
POST   /api/v1/auth/logout            - User logout
GET    /api/v1/auth/profile           - Get current user profile
PATCH  /api/v1/auth/profile           - Update profile
```

### **Users Management**
```
GET    /api/v1/users                  - List all users
POST   /api/v1/admin/users            - Create user
GET    /api/v1/users/{user_id}        - Get user by ID
PATCH  /api/v1/users/{user_id}        - Update user
DELETE /api/v1/users/{user_id}        - Delete user
POST   /api/v1/users/{user_id}/roles  - Assign roles
```

### **Roles & Permissions**
```
GET    /api/v1/roles                  - List all roles
POST   /api/v1/admin/roles            - Create role
GET    /api/v1/roles/{role_id}        - Get role by ID
PATCH  /api/v1/roles/{role_id}        - Update role
DELETE /api/v1/roles/{role_id}        - Delete role
GET    /api/v1/privileges             - List all permissions
```

### **Market Configuration**
```
GET    /api/v1/countries              - List countries
POST   /api/v1/admin/countries        - Create country
PATCH  /api/v1/countries/{id}         - Update country
DELETE /api/v1/countries/{id}         - Delete country

GET    /api/v1/states                 - List states
POST   /api/v1/admin/states           - Create state
GET    /api/v1/states/country/{country_id} - States by country

GET    /api/v1/rldcs                  - List RLDCs
POST   /api/v1/admin/rldcs            - Create RLDC

GET    /api/v1/market-areas           - List market areas
GET    /api/v1/market-providers       - List providers
GET    /api/v1/market-types           - List market types
GET    /api/v1/entities               - List entities
```

### **Real-time Data**
```
GET    /api/v1/realtime/iex-status    - IEX status
GET    /api/v1/realtime/igx-status    - IGX status
GET    /api/v1/realtime/wbes-status   - WBES status
GET    /api/v1/realtime/forecast-status - Forecast status
GET    /api/v1/realtime/rtm-status    - RTM status
GET    /api/v1/generators/outages     - Generator outages
```

### **Analytics & Graph Data**
```
GET    /api/v1/analytics/price-vs-demand       - PVD graph data
GET    /api/v1/analytics/price-vs-volume       - PVV graph data
GET    /api/v1/analytics/forecast-vs-actual    - Forecast metrics
GET    /api/v1/analytics/model-wise-forecast  - Model comparison
GET    /api/v1/analytics/india-map-data       - Map visualization
GET    /api/v1/analytics/rtm-forecast-data    - RTM metrics
GET    /api/v1/analytics/igx-delivery-data    - IGX delivery areas
```

### **File Operations**
```
POST   /api/v1/files/upload           - Upload file
GET    /api/v1/files/{file_id}        - Download file
DELETE /api/v1/files/{file_id}        - Delete file
```

---

## 🛡️ Security Architecture

### Authentication Flow
1. User submits credentials (username/password)
2. Backend validates and generates JWT token (Access + Refresh)
3. Client includes token in Authorization header
4. Backend verifies token on protected routes
5. Refresh token used to obtain new access token

### Permission Model
- **Role-Based Access Control (RBAC)**
- Each user has multiple roles
- Each role has multiple permissions
- Permissions are checked on endpoint access
- Fine-grained control: Module + Action

### Data Protection
- Password hashing using bcrypt
- JWT tokens with expiration (15 min access, 7 days refresh)
- CORS enabled for specific origins
- Rate limiting on sensitive endpoints
- Audit logging for all data changes

---

## 🔄 Data Flow Architecture

```
External Data Sources (IEX, IGX, WBES, Forecasts)
           ↓
   [Celery Workers] → Data Ingestion Tasks
           ↓
   [Data Validation] → MongoDB
           ↓
   [Background Processing] → Analysis/Aggregation
           ↓
   [Cache Service] → Redis Cache
           ↓
   [FastAPI Endpoints] → Response to Frontend
           ↓
   [Angular Frontend] → Charts/Dashboard
```

---

## 🚀 Development Workflow

### Setup
1. Create Python virtual environment
2. Install dependencies: `pip install -r requirements.txt`
3. Configure `.env` file
4. Initialize MongoDB: `python scripts/init_db.py`
5. Create indexes: `python scripts/create_indexes.py`
6. Seed initial data: `python scripts/seed_data.py`

### Running
```bash
# Development server
uvicorn app.main:app --reload --port 8002

# Celery worker
celery -A app.workers.celery_app worker --loglevel=info

# Celery beat (scheduler)
celery -A app.workers.celery_app beat --loglevel=info
```

### Testing
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

---

## 📊 Technology Dependencies

### Core Framework
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `motor` - Async MongoDB driver
- `pymongo` - MongoDB driver

### Database & Caching
- `mongoengine` or direct motor for ODM
- `redis` - Caching layer
- `celery` - Task queue

### Security & Auth
- `python-jose` - JWT handling
- `passlib` - Password hashing
- `python-multipart` - File uploads

### Data Processing
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `scikit-learn` - ML for metrics (MAPE, RMSE)

### Testing & Quality
- `pytest` - Testing framework
- `pytest-cov` - Coverage
- `httpx` - Async HTTP client for tests
- `black` - Code formatting
- `flake8` - Linting

### Utilities
- `python-dotenv` - Environment variables
- `requests` - HTTP client for external APIs
- `aiohttp` - Async HTTP
- `python-dateutil` - Date utilities

---

## 📋 Implementation Checklist

- [ ] Project initialization and structure
- [ ] Database setup (MongoDB, collections, indexes)
- [ ] Authentication & Authorization (JWT, Roles, Permissions)
- [ ] User Management CRUD
- [ ] Market Configuration CRUD
- [ ] Real-time Data Ingestion
- [ ] Analytics & Graph Data Services
- [ ] API Endpoints Development
- [ ] Error Handling & Validation
- [ ] Logging & Audit Trail
- [ ] Testing (Unit, Integration, E2E)
- [ ] Documentation (API docs, setup guide)
- [ ] Docker & Deployment
- [ ] Performance Optimization
- [ ] Security Hardening

---

## 📞 Questions & Considerations

1. **Data Sources**: How will external data be ingested? (APIs, databases, file uploads)
2. **Real-time Requirements**: How fresh should real-time data be? (Seconds, minutes)
3. **Scalability**: Expected user count and data volume?
4. **Caching Strategy**: Which endpoints need aggressive caching?
5. **Notification System**: Email alerts on critical events?
6. **Reporting**: Export to PDF/Excel requirements?
7. **Historical Data**: How long to retain raw data?
8. **Performance SLAs**: Expected API response times?

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Motor (Async MongoDB)](https://motor.readthedocs.io/)
- [Celery Documentation](https://docs.celeryproject.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [MongoDB Best Practices](https://docs.mongodb.com/)

---

**Next Step**: Ready to start implementing? Let me know which module to tackle first!
