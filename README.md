# UIDAI Intelligence System

> A comprehensive, AI-powered platform for Aadhaar data analysis, threat detection, and policy intelligence generation

<div align="center">
  
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Last Updated](https://img.shields.io/badge/Updated-January%202026-orange)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Project Components](#project-components)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Usage](#usage)
- [Key Features](#key-features)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)

## 🎯 Overview

The **UIDAI Intelligence System** is an enterprise-grade platform designed to analyze Aadhaar authentication data at scale. It combines machine learning, threat detection, and policy intelligence to provide actionable insights for decision-makers.

### Core Capabilities

- 🔍 **Anomaly Detection** - Identify unusual patterns and potential threats
- 🤖 **AI-Driven Analysis** - Machine learning-based insights
- 🌐 **Multi-Channel Interface** - Web, mobile, and API access
- 📊 **Real-Time Dashboards** - Interactive visualization and monitoring
- 🚨 **Threat Intelligence** - Proactive threat identification and response
- 📈 **Predictive Analytics** - Forecast future anomalies
- 🎯 **Policy Recommendations** - Generate actionable policy frameworks
- 🔐 **Enterprise Security** - Secure authentication and data handling

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    UIDAI INTELLIGENCE SYSTEM                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            PRESENTATION LAYER (Frontend)                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Web Dashboard (React/TypeScript)                      │   │
│  │  • Landing Page                                          │   │
│  │  • Mobile Application                                    │   │
│  │  • Real-time Visualizations                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           API LAYER (Backend Services)                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Node.js/Express REST APIs                            │   │
│  │  • Authentication & Authorization                        │   │
│  │  • Data Validation & Transformation                      │   │
│  │  • Nginx Reverse Proxy & Load Balancing                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        INTELLIGENCE LAYER (ML & Analysis)                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • ML Pipeline (Anomaly Detection)                       │   │
│  │  • FastAPI ML Service                                    │   │
│  │  • ThreatPilot Agentic AI Workflow                       │   │
│  │  • Pattern Recognition & Trend Analysis                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           DATA LAYER (Persistence & Storage)             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Prisma ORM & Database                                 │   │
│  │  • Model Outputs & Cache                                 │   │
│  │  • CSV/JSON Data Storage                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 📦 Project Components

### 1. **aadhaar-backend** - Core Backend Services
> Node.js/TypeScript REST API backend with database integration

**Key Features:**
- Express.js REST APIs
- Prisma ORM for database management
- Nginx configuration for reverse proxy
- Database migrations and seeding
- Authentication middleware
- TypeScript for type safety

**Key Files:**
- `app.ts` - Main application entry
- `package.json` - Dependencies
- `prisma/schema.prisma` - Database schema
- `src/routes/` - API routes
- `nginx.conf` - Web server configuration

**Start:** See [aadhaar-backend/README.md](./aadhaar-backend/README.md)

---

### 2. **aadhaar-frontend** - Web Dashboard
> React/TypeScript web application for interactive data visualization and management

**Key Features:**
- Interactive dashboards and charts
- Real-time data visualization
- User authentication
- Responsive design with Tailwind CSS
- Alert and notification system
- Advanced filtering and search
- Heat map visualizations
- Impact tracking

**Key Components:**
- Dashboard.tsx - Main dashboard
- AlertsPage.tsx - Alert management
- ChartsPage.tsx - Data visualization
- HeatmapPage.tsx - Geographic heatmaps
- NotificationPanel.tsx - Notifications
- LoginPage.tsx - Authentication

**Start:** See [aadhaar-frontend/README.md](./aadhaar-frontend/README.md)

---

### 3. **aadhaar-landing-page** - Public Landing Page
> React/TypeScript landing page showcasing platform features

**Key Features:**
- Hero section with value proposition
- Feature showcase
- Tech stack display
- Interactive documentation
- Call-to-action sections
- Responsive mobile design
- Chat widget integration

**Key Sections:**
- Hero - Main landing section
- Features - Platform capabilities
- TechStack - Technology overview
- Workflow - System workflow
- Documentation - Feature guides
- CallToAction - Engagement CTAs

**Start:** See [aadhaar-landing-page/README.md](./aadhaar-landing-page/README.md)

---

### 4. **adhaar_Mobile_app-main** - Mobile Application
> Next.js-based mobile application for on-the-go access

**Key Features:**
- Mobile-optimized interface
- Core functionality access
- Responsive design
- Fast performance

**Start:** See [adhaar_Mobile_app-main/README.md](./adhaar_Mobile_app-main/README.md)

---

### 5. **Ml model** - Machine Learning Pipeline
> Comprehensive Python-based ML pipeline for anomaly detection and predictive intelligence

**Key Capabilities:**
- Multi-method anomaly detection (Z-Score, IQR, Isolation Forest)
- Baseline calculation using 6-month rolling average
- Pattern recognition and trend analysis
- Geographic aggregation
- Predictive indicators
- Executive report generation
- 8+ CSV output files

**Pipeline Steps:**
1. Data Loading
2. Data Preparation
3. Baseline Calculation
4. Anomaly Detection
5. Pattern Analysis
6. Geographic Aggregation
7. Predictive Indicators
8-14. Report Generation

**Input:** CSV file with Aadhaar data (Year_Month, State, District, Metric_Type, Age_Group, Count)

**Start:** See [Ml model/README.md](./Ml%20model/README.md)

---

### 6. **ThreatPIlot_Agentic_AI_Workflow** - Threat Detection & Remediation
> Advanced AI-driven threat detection and automated remediation system

**Key Features:**
- Agentic AI workflow for threat intelligence
- Network threat remediation
- Infrastructure remediation
- Automated response mechanisms
- Threat scoring and classification
- Incident scheduling

**Components:**
- Dispatcher - Request routing
- Network Remediation - Network threat handling
- Infrastructure Remediation - System-level fixes
- Scheduler - Task scheduling
- Loki MCP - Monitoring integration

**Start:** See [ThreatPIlot_Agentic_AI_Workflow-main/README.md](./ThreatPIlot_Agentic_AI_Workflow-main/ThreatPIlot_Agentic_AI_Workflow-main/README.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (for backend and frontend)
- **Python** 3.8+ (for ML pipeline)
- **Git** (for version control)
- **npm** or **yarn** (package managers)
- **Docker** (optional, for containerization)

### Installation Overview

```bash
# 1. Clone/Extract the repository
cd "UIDAI Intelligence System - Copy"

# 2. Backend Setup
cd aadhaar-backend
npm install
# Configure .env files
npm run dev

# 3. Frontend Setup (new terminal)
cd aadhaar-frontend
npm install
npm run dev

# 4. Landing Page Setup (new terminal)
cd aadhaar-landing-page
npm install
npm run dev

# 5. ML Pipeline Setup (new terminal)
cd "Ml model"
pip install -r requirements.txt
jupyter notebook Copy_of_Untitled22.ipynb
```

### Access Points

| Component | URL | Port |
|-----------|-----|------|
| Landing Page | http://localhost:5173 | 5173 |
| Frontend Dashboard | http://localhost:5174 | 5174 |
| Backend API | http://localhost:3000 | 3000 |
| Mobile App | http://localhost:3001 | 3001 |
| ML Jupyter | http://localhost:8888 | 8888 |

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL/MySQL** - Database
- **Nginx** - Reverse proxy

### Machine Learning
- **Python 3.8+** - Core language
- **Pandas** - Data processing
- **NumPy** - Numerical computing
- **Scikit-learn** - ML algorithms
- **SciPy** - Scientific computing
- **Matplotlib/Seaborn** - Visualization
- **FastAPI** - ML API

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Container orchestration

## 📁 Directory Structure

```
UIDAI Intelligence System - Copy/
│
├── README.md                                    # This file
│
├── aadhaar-backend/                            # Backend API & Services
│   ├── src/                                    # Source code
│   ├── prisma/                                 # Database schema
│   ├── FastAPIML/                              # ML service
│   ├── nginx/                                  # Web server config
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── aadhaar-frontend/                           # Web Dashboard
│   ├── src/                                    # React components
│   ├── components/                             # UI components
│   ├── services/                               # API clients
│   ├── hooks/                                  # React hooks
│   ├── contexts/                               # Context API
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── aadhaar-landing-page/                       # Public Landing Page
│   ├── src/                                    # React components
│   ├── components/                             # Page sections
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── adhaar_Mobile_app-main/                     # Mobile Application
│   ├── app/                                    # Next.js app
│   ├── package.json
│   ├── next.config.js
│   └── README.md
│
├── Ml model/                                   # ML Pipeline
│   ├── Copy_of_Untitled22.ipynb               # Main notebook
│   ├── ModelOutputs/                           # Generated outputs
│   │   ├── outputs/                            # CSV results
│   │   └── scripts/                            # Helper scripts
│   └── README.md
│
└── ThreatPIlot_Agentic_AI_Workflow-main/       # Threat Detection
    ├── dispatcher/                             # Request handler
    ├── network_remediation/                    # Network fixes
    ├── infras_remediation/                     # Infrastructure fixes
    ├── scheduler/                              # Task scheduling
    └── README.md
```

## 📝 Installation Guide

### Step 1: Environment Setup

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Node.js Dependencies

```bash
# Backend
cd aadhaar-backend
npm install

# Frontend
cd ../aadhaar-frontend
npm install

# Landing Page
cd ../aadhaar-landing-page
npm install
```

### Step 3: Install Python Dependencies

```bash
cd "Ml model"
pip install pandas numpy scikit-learn scipy matplotlib seaborn openpyxl
```

### Step 4: Database Setup

```bash
cd aadhaar-backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### Step 5: Environment Configuration

Create `.env.local` files in each component:

**aadhaar-backend/.env.local**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/uidai_db
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
```

**aadhaar-frontend/.env.local**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=UIDAI Intelligence System
```

## ⚙️ Configuration

### Database Configuration
- Edit `aadhaar-backend/prisma/schema.prisma`
- Update connection string in `.env.local`
- Run migrations with `npx prisma migrate dev`

### API Configuration
- API routes in `aadhaar-backend/src/routes/`
- Controllers in `aadhaar-backend/src/controllers/`
- Middleware in `aadhaar-backend/src/middleware/`

### Frontend Configuration
- Tailwind CSS: `aadhaar-frontend/tailwind.config.js`
- Vite: `aadhaar-frontend/vite.config.ts`
- API clients: `aadhaar-frontend/src/services/`

### ML Pipeline Configuration
- Modify sensitivity in `Ml model/Copy_of_Untitled22.ipynb`
- Adjust thresholds in notebook cells
- Configure output paths

## 🎮 Usage

### Development Mode

```bash
# Terminal 1: Backend
cd aadhaar-backend
npm run dev

# Terminal 2: Frontend
cd aadhaar-frontend
npm run dev

# Terminal 3: Landing Page
cd aadhaar-landing-page
npm run dev

# Terminal 4: ML Pipeline
cd "Ml model"
jupyter notebook
```

### Production Build

```bash
# Backend
cd aadhaar-backend
npm run build
npm run start

# Frontend
cd aadhaar-frontend
npm run build
npm run preview

# Landing Page
cd aadhaar-landing-page
npm run build
npm run preview
```

## ✨ Key Features

### Data Analysis
- ✅ Anomaly detection using ensemble methods
- ✅ Pattern recognition and trend analysis
- ✅ Geographic aggregation and comparison
- ✅ Time-series forecasting
- ✅ Statistical analysis and reporting

### User Interface
- ✅ Interactive dashboards
- ✅ Real-time data visualization
- ✅ Advanced filtering and search
- ✅ Heat map visualizations
- ✅ Alert notifications
- ✅ Mobile responsiveness

### Security
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Data encryption
- ✅ Secure API endpoints
- ✅ Environment variable management

### Performance
- ✅ Optimized queries
- ✅ Caching mechanisms
- ✅ Load balancing with Nginx
- ✅ Efficient data processing
- ✅ Scalable architecture

## 📚 Documentation

Comprehensive documentation is available in each component:

| Component | Documentation |
|-----------|--------------|
| Backend | [aadhaar-backend/README.md](./aadhaar-backend/README.md) |
| Frontend | [aadhaar-frontend/README.md](./aadhaar-frontend/README.md) |
| Landing Page | [aadhaar-landing-page/README.md](./aadhaar-landing-page/README.md) |
| Mobile App | [adhaar_Mobile_app-main/README.md](./adhaar_Mobile_app-main/README.md) |
| ML Model | [Ml model/README.md](./Ml%20model/README.md) |
| Threat Detection | [ThreatPIlot_Agentic_AI_Workflow-main/README.md](./ThreatPIlot_Agentic_AI_Workflow-main/ThreatPIlot_Agentic_AI_Workflow-main/README.md) |

### API Documentation
- REST API endpoints documented in backend README
- OpenAPI/Swagger specification available

### Configuration Guides
- Environment variable setup
- Database configuration
- Authentication setup
- Third-party integrations

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow code style guidelines
   - Add comments and documentation
   - Test thoroughly

3. **Commit Your Changes**
   ```bash
   git commit -m "Add meaningful commit message"
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Request review from team members

### Code Standards
- **JavaScript/TypeScript:** Use ESLint configuration
- **Python:** Follow PEP 8 guidelines
- **Database:** Use Prisma migrations
- **Comments:** Document complex logic
- **Testing:** Write unit tests for new features

## 📞 Support

### Getting Help

**For Issues:**
- Open an issue on the GitHub repository
- Provide detailed description and steps to reproduce
- Include error messages and logs

**For Questions:**
- Check component-specific README files
- Review documentation
- Contact the development team

**For Contributions:**
- Fork the repository
- Follow contributing guidelines
- Submit pull requests

### Reporting Security Issues

⚠️ **Do not open public issues for security vulnerabilities**
- Email security team directly
- Include proof-of-concept if applicable
- Allow time for response before disclosure

## 📊 System Requirements

### Minimum
- CPU: Dual-core processor
- RAM: 4GB
- Storage: 5GB free space
- OS: Windows/macOS/Linux

### Recommended
- CPU: Quad-core processor or higher
- RAM: 8GB or more
- Storage: 20GB SSD
- OS: Linux (Ubuntu 20.04+) or macOS

## 🔄 Development Workflow

```
┌─────────────┐
│   Feature   │
│  Planning   │
└──────┬──────┘
       ↓
┌─────────────┐
│   Create    │
│   Branch    │
└──────┬──────┘
       ↓
┌─────────────┐
│  Develop &  │
│    Test     │
└──────┬──────┘
       ↓
┌─────────────┐
│  Code       │
│  Review     │
└──────┬──────┘
       ↓
┌─────────────┐
│   Merge to  │
│   Main      │
└──────┬──────┘
       ↓
┌─────────────┐
│   Deploy    │
│    to Prod  │
└─────────────┘
```

## 📈 Project Status

- **Version:** 1.0.0
- **Status:** Active Development
- **Last Updated:** January 2026
- **Maintained By:** UIDAI Intelligence Team

## 📄 License

This project is proprietary and confidential. All rights reserved to UIDAI.

Unauthorized reproduction, distribution, or use is prohibited.

## 🙏 Acknowledgments

- UIDAI for project initiative
- Development team for implementation
- Contributors and community members
- Open source libraries and frameworks

---

## 📞 Contact & Communication

**Project Lead:** UIDAI Intelligence Team
**Email:** intelligence@uidai.gov.in
**Repository:** Internal Git Repository

---

<div align="center">

**Made with ❤️ for India's Digital Identity System**

**UIDAI Intelligence System © 2026**

</div>
