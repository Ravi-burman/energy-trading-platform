# EnergySync - Real-time Energy Market Platform

## 📋 Project Overview

EnergySync is a comprehensive **Real-time Energy Market Analytics and Trading Platform** designed to facilitate energy trading, forecasting, and real-time data analytics across Indian energy markets. The platform integrates multiple data sources and provides advanced analytics for energy market participants.

### 🎯 What is EnergySync?

EnergySync enables:
- **Real-time Energy Market Data**: Monitor IEX, IGX energy prices and volumes
- **Forecast Analytics**: DAM, RTM, and RTM192 forecast vs actual analysis
- **Generator Management**: Track installed capacity, outages, and performance
- **Market Configuration**: Manage countries, states, RLDCs, market areas, and entities
- **User & Role Management**: Role-based access control with privilege management
- **Advanced Analytics**: Price-Volume analysis, statistical metrics, trend analysis

---

## 🏗️ Current Architecture

### Frontend Stack
- **Framework**: Angular 15.2.7
- **UI Libraries**: 
  - PrimeNG 15.3.0 (Rich UI components)
  - Angular Material 15.2.7
  - Bootstrap 5.3.0
- **Charting**: 
  - Highcharts 10.3.2
  - Plotly.js
  - Canvas.js
- **State Management**: RxJS 6.6.0
- **Authentication**: JWT-based with role delegation
- **Styling**: SCSS

### Project Structure

```
src/
├── app/
│   ├── admin/                          # Admin modules for configuration
│   │   ├── admin-countries/            # Country management
│   │   ├── admin-forecast-vs-actual/   # Forecast validation
│   │   ├── admin-generator-outages/    # Generator outage tracking
│   │   ├── admin-iex-profilepicture/   # IEX profile management
│   │   ├── admin-igx-gasdata/          # IGX gas data
│   │   ├── admin-india-trends/         # Trend analysis
│   │   ├── admin-individual-entities/  # Entity management
│   │   ├── admin-market-areas/         # Market area configuration
│   │   ├── admin-market-hierarchy/     # Market structure
│   │   ├── admin-market-provider/      # Market provider setup
│   │   ├── admin-market-type/          # Market type configuration
│   │   ├── admin-model-wise-forecast/  # Forecast model analytics
│   │   ├── admin-rldcs/                # RLDC (Regional Load Dispatch Center) management
│   │   ├── admin-roles/                # Role-based access control
│   │   ├── admin-rtm192/               # Real-time Market 192-block access
│   │   ├── admin-states/               # State management
│   │   ├── admin-status/               # System status monitoring
│   │   ├── admin-users/                # User management
│   │   ├── directives/                 # Custom directives
│   │   ├── generator-grouping/         # Generator grouping logic
│   │   ├── home/                       # Dashboard/home page
│   │   ├── layout/                     # Layout components
│   │   ├── npp-india-map/              # India map visualization
│   │   ├── routing/                    # Admin routing
│   │   └── services/                   # Shared admin services
│   │
│   ├── auth/                           # Authentication module
│   │   ├── auth.service.ts
│   │   ├── login/                      # Login components
│   │   └── routing/
│   │
│   ├── services/                       # Core application services
│   │   ├── http.service.ts             # HTTP communication wrapper
│   │   ├── global.service.ts           # Global app state
│   │   ├── common-utility.service.ts   # Utility functions
│   │   └── router-guard.service.ts     # Route protection
│   │
│   ├── material-module/                # Angular Material configuration
│   ├── primeng-module/                 # PrimeNG configuration
│   └── app.module.ts
│
├── assets/
│   ├── fonts/                          # Custom fonts
│   ├── images/                         # Image assets
│   └── india/                          # GIS data
│       ├── india-map.json
│       └── npp-map.json
│
├── environments/                       # Environment configurations
│   └── environment.ts                  # Dev environment
│
└── index.html, main.ts, styles.scss
```

---

## 📊 Feature Breakdown

### 1. **User & Access Management**
- User registration and profile management
- Role-based access control (RBAC)
- Privilege assignment and management
- Multi-tenant support

### 2. **Market Configuration**
- **Countries**: Multi-country market setup
- **States**: Sub-national divisions
- **RLDCs**: Regional Load Dispatch Centers
- **Market Areas**: Coverage areas for market operations
- **Market Providers**: Entities managing market operations
- **Market Types**: DAM, RTM, RTM192, etc.
- **Entities**: Individual market participants

### 3. **Real-time Data Ingestion**
- **IEX Status**: Indian Energy Exchange data
- **WBES Status**: Renewable energy status
- **IGX Status**: IEX Gas data
- **Forecast Status**: Model-based forecasts
- **RTM Status**: Real-time market forecasts

### 4. **Analytics & Visualization**
- **Price vs Demand (PVD)**: Historical trends and statistics
- **Price vs Volume (PVV)**: Market depth analysis
- **Forecast vs Actual**: DAM/RTM/RTM192 validation
- **Model-wise Forecast**: Different forecasting model comparison
- **India Map Data**: Generator locations and capacity visualization
- **Generator Outages**: Real-time outage tracking

### 5. **Market Data Analysis**
- DAM (Day Ahead Market) metrics
- RTM (Real-Time Market) metrics
- RTM192 (192 block access) metrics
- IGX (IEX Gas) price/volume analysis
- IRNS (Indian Renewable Energy) scheduling

---

## 🔄 Current API Integration

The frontend communicates with a backend API at `http://10.88.0.42:8002`.

### API Endpoints Structure (Expected Backend Implementation)

#### **User Management**
- `GET /get_user_list/` - Fetch all users
- `POST /admin/create_user/` - Create new user
- `PATCH /update_user/` - Update user details
- `DELETE /delete_user/?user_id={id}` - Delete user
- `GET /user/{id}` - Get user by ID

#### **Role Management**
- `GET /get_role_list/` - Fetch all roles
- `POST /admin/create_role/` - Create new role
- `GET /get_active_roles/` - Active roles only
- `PATCH /update_role/` - Update role
- `DELETE /delete_role/?role_id={id}` - Delete role

#### **Market Configuration**
- Countries, States, RLDCs, Market Areas, Market Providers, Market Types
- CRUD operations for each entity
- Cross-entity dependencies and queries

#### **Real-time Data**
- Status endpoints for IEX, WBES, Forecast, RTM, IGX, PXIL
- Graph data endpoints for analytics
- Forecast metrics and time-series data

#### **Analytics**
- `GET /get_graphdata_price_vs_demand/` - PVD data
- `GET /get_graphdata_price_vs_volume/` - PVV data
- `GET /dam_forecast_metrics_graph_data/` - DAM forecast analytics
- `GET /gdam_forecast_metrics_graph_data/` - GDAM forecast analytics
- `GET /get_rtm_forecast_vs_actual_data/` - RTM forecast validation
- And many more...

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- npm 8+
- Angular CLI 15+

### Installation

```bash
# Clone repository
git clone <repo-url>
cd GEMATS

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

### Running Tests
```bash
npm test          # Unit tests
npm run e2e       # End-to-end tests
npm run lint      # Linting
```

### Environment Configuration

Update `src/environments/environment.ts` with appropriate backend API endpoint.

---

## 📦 Backend Requirements (To Be Implemented)

### **Technology Stack**
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Task Queue**: Celery (for background jobs)
- **Caching**: Redis
- **Authentication**: JWT tokens
- **API Documentation**: Swagger/OpenAPI

### **Core Modules**

1. **Authentication & Authorization**
   - User login/registration
   - JWT token generation
   - Role-based access control
   - Permission management

2. **User Management**
   - User CRUD operations
   - Profile management
   - Privilege assignment

3. **Market Configuration Management**
   - Country/State/RLDC management
   - Market Area configuration
   - Provider management
   - Entity management

4. **Real-time Data Ingestion**
   - IEX data polling
   - WBES integration
   - Forecast data ingestion
   - RTM data aggregation
   - Data parsing and validation

5. **Data Processing & Analytics**
   - Price-Volume aggregation
   - Forecast vs Actual calculation
   - Statistical analysis
   - Time-series data management

6. **API Endpoints**
   - RESTful API for all admin operations
   - Real-time data endpoints
   - Analytics and graph data endpoints
   - File upload/download endpoints

---

## 🚀 Next Steps

1. ✅ **Analysis Complete** - Frontend architecture documented
2. ⏳ **Backend Structure** - Ready to create FastAPI + MongoDB structure
3. ⏳ **Database Schema** - Design data models
4. ⏳ **API Implementation** - Develop backend endpoints
5. ⏳ **Data Integration** - Connect external data sources
6. ⏳ **Testing & Deployment** - QA and production setup

---

## 📝 License

Proprietary - EnergySync Real-time Energy Market Platform

## 🤝 Contributors

Project Team - EnergySync Development