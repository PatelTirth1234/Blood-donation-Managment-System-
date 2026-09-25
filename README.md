# 🩸 RaktSetu / HemaCare OS — Enterprise Blood Bank Management System (Node.js & JavaScript Backend)

A production-grade, fault-tolerant Blood Bank Management System backed by a relational **PostgreSQL Database**, a high-performance **Node.js Express REST API** (with `pg` connection pooling), and a clinical Single-Page Application (SPA) frontend.

---

## 🏗️ Project Architecture & Layout

```
DBMS/
├── .env                  # PostgreSQL connection credentials (local only)
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusion rules
├── package.json          # Node.js dependencies & scripts (Express, pg, cors, dotenv)
├── server.js             # Enterprise Node.js Express REST Server (Port 5000)
├── app.js                # Node.js application entry point
├── db.js                 # PostgreSQL Pool Manager & auto-migration engine (Node.js pg)
├── index.html            # Semantic HTML5 Application Interface
│
├── database/             # Relational Database Engineering
│   ├── schema.sql        # Full DDL table definitions, foreign keys & indexes
│   ├── seeds.sql         # Sample clinical seed dataset
│   ├── queries.sql       # Analytical, diagnostic & reporting queries
│   ├── migrate.js        # Database migration & integrity verification (Node.js)
│   ├── reset_and_seed.js # Rich seed population script (Node.js)
│   ├── test_sync.js      # Bidirectional sync test script (Node.js)
│   └── test_all_endpoints.js # Automated API test suite (Node.js)
│
├── docs/                 # Documentation & Reports
│   ├── ARCHITECTURE.md   # System architecture & data flow diagrams
│   └── API_REFERENCE.md  # REST API endpoint specifications
│
├── css/                  # Styling & Tokens
│   └── styles.css        # Clinical Design System & CSS variables
│
└── js/                   # Client-Side Application Modules
    ├── api.js            # REST Client with retry logic & auto-reconnect
    ├── store.js          # In-memory store & LocalStorage fallback
    ├── charts.js         # Pure SVG vector charting engine (zero dependencies)
    ├── toast.js          # Stacked toast notification engine
    └── app.js            # Main UI controller & two-way PostgreSQL sync
```

---

## 🚀 Quick Start Guide

### 1. Configure PostgreSQL Credentials
Ensure `.env` contains your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Initialize / Migrate Database
```bash
npm run db:migrate
# or: node database/migrate.js
```

### 4. Start the Application
```bash
npm start
# or: node server.js
# or for auto-reloading dev mode: npm run dev
```

### 5. Access the Web Application
Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | PostgreSQL connection diagnostic & status |
| `GET` | `/api/dashboard/stats` | Storage units, active donors, and pending request totals |
| `GET` | `/api/donors` | List all donors with filtering (`city`, `bloodGroup`, `clearance`, `search`) |
| `GET` | `/api/donors/cities` | Aggregated donor metrics across cities |
| `GET` | `/api/donors/:id` | Fetch specific donor with donation history |
| `POST` | `/api/donors` | Register new donor and screen clearance + auto-matching |
| `PUT` | `/api/donors/:id` | Update donor clinical details |
| `DELETE` | `/api/donors/:id` | Delete donor record & cascaded donations |
| `GET` | `/api/matches` | Smart match feed for emergency requests & nearby donors |
| `POST` | `/api/matches/link` | Link request with matched donor and dispatch |
| `GET` | `/api/inventory` | Real-time blood units from `blood_inventory` |
| `GET` | `/api/requests` | Hospital emergency requisitions from `blood_request` |
| `POST` | `/api/requests` | Create urgent dispatch and decrement storage unit |
| `GET` | `/api/camps` | Scheduled donation drives from `blood_donation_camp` |
| `POST` | `/api/camps` | Schedule new blood donation camp |
| `PUT` | `/api/camps/:id` | Update camp details |
| `DELETE` | `/api/camps/:id` | Delete donation camp |
| `POST` | `/api/donations` | Log donation unit into `donation` & increment stock |
| `POST` | `/api/auth/login` | User & donor authentication |
| `POST` | `/api/auth/register` | User & donor registration |
| `GET` | `/api/auth/me` | Current authenticated user profile |
| `POST` | `/api/auth/logout` | Session logout & audit recording |
| `GET` | `/api/audit` | Immutable compliance ledger |

---

## 📊 Available Commands

- `npm start` (or `node server.js`) — Starts the Node.js Express REST API server on port 5000
- `npm run dev` (or `node --watch server.js`) — Starts the server with Node 20+ native auto-reload on file change
- `npm run db:migrate` (or `node database/migrate.js`) — Checks and applies PostgreSQL database schema and seeds
- `npm run db:seed` (or `node database/reset_and_seed.js`) — Resets and seeds realistic clinical dataset
- `npm run test:api` (or `node database/test_all_endpoints.js`) — Runs full automated endpoint test suite
- `npm run test:sync` (or `node database/test_sync.js`) — Verifies two-way database synchronization
- `npm run test:db` — Tests PostgreSQL connectivity and prints diagnostics
"# Blood-donation-Managment-System-" 
