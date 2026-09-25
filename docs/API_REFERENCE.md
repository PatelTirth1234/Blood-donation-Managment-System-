# 📡 RaktSetu (रक्तसेतु) — REST API Reference Guide

All API endpoints are mounted on `/api` and return standardized JSON responses.

---

## 1. Authentication & Access Control

### `POST /api/auth/login`
Authenticates an administrator, phlebotomist, hospital authority, or donor into RaktSetu.

**Request Body:**
```json
{
  "email": "tirth.patel@raktsetu.org",
  "password": "admin123",
  "role": "Super Administrator"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Welcome back, Tirth Patel! Signed in to RaktSetu.",
  "token": "4aa73741ee3d8feab8561de45afcbe53af1bdc6feddaecd4",
  "user": {
    "id": 1001,
    "name": "Tirth Patel",
    "email": "tirth.patel@raktsetu.org",
    "role": "Super Administrator",
    "avatar": "TP",
    "city": "Ahmedabad"
  }
}
```

### `POST /api/auth/register`
Creates a new system account with designated role and clinical profile.

**Request Body:**
```json
{
  "name": "Tirth Patel",
  "email": "tirth.patel@raktsetu.org",
  "phone": "9876543210",
  "city": "Ahmedabad",
  "role": "Super Administrator",
  "bloodGroup": "B+",
  "password": "adminpassword"
}
```

### `GET /api/auth/me`
Fetches the active authenticated operator profile and permission tier.

### `POST /api/auth/logout`
Terminates the active session and creates an audit trail entry.

---

## 2. System Diagnostics

### `GET /api/health`
Checks active PostgreSQL connection and returns database metadata.

**Response `200 OK`:**
```json
{
  "status": "online",
  "message": "PostgreSQL Database Connected Successfully",
  "database": "postgres",
  "user": "postgres",
  "version": "PostgreSQL 18.4...",
  "timestamp": "2026-09-09T10:18:24.000Z"
}
```

---

## 2. Dashboard Analytics

### `GET /api/dashboard/stats`
Returns aggregated metrics for the executive overview cards and inventory stock.

**Response `200 OK`:**
```json
{
  "success": true,
  "stats": {
    "totalUnits": 345,
    "totalDonors": 1420,
    "pendingRequests": 3,
    "totalCamps": 5
  },
  "inventory": [...]
}
```

---

## 3. Donor Management

### `GET /api/donors`
Fetches registered donors with optional multi-criteria filtering and screening status.

**Query Parameters:**
- `city` (string, optional): Filter by city location (e.g., `Ahmedabad`, `Surat`, `Vadodara`). Default `ALL`.
- `bloodGroup` or `blood_group` (string, optional): Filter by blood group (e.g., `O+`, `A-`). Default `ALL`.
- `clearance` (string, optional): Filter by clinical screening status (`Cleared` or `Pending`). Default `ALL`.
- `search` (string, optional): Keyword search matching donor name, ID, city, phone, or address.

**Example Request:**
```
GET /api/donors?city=Surat&bloodGroup=A+&clearance=Cleared
```

### `GET /api/donors/cities`
Returns aggregated donor metrics, active donation counts, and distinct blood types across all cities.

**Response Body:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "city": "Ahmedabad",
      "total_donors": 12,
      "total_donations": 28,
      "available_blood_groups": ["A+", "B+", "O+", "AB+"]
    }
  ]
}
```

### `GET /api/donors/:id`
Fetches an individual donor profile with complete historical donation records.

### `POST /api/donors`
Registers a new donor record, screens clearance status, and executes immediate real-time auto-matching against open hospital requests in the same city.

**Request Body:**
```json
{
  "name": "Aarav Sharma",
  "bloodGroup": "O+",
  "city": "Ahmedabad",
  "phone": "9876543210",
  "age": 25,
  "gender": "Male",
  "disease": "None",
  "email": "aarav@example.com",
  "address": "Navrangpura"
}
```

### `PUT /api/donors/:id`
Updates an existing donor's information (name, city, phone, blood group, address, age, gender, disease) and re-evaluates city-level matching.

**Request Body:**
```json
{
  "name": "Tirth Patel",
  "city": "Ahmedabad",
  "address": "A-101 Green Residency, Navrangpura",
  "phone": "9876543210",
  "bloodGroup": "B+",
  "age": 22,
  "gender": "Male",
  "disease": "None",
  "email": "tirth.patel@gmail.com"
}
```

### `DELETE /api/donors/:id`
Deletes a donor from the database and cascades related donation logs.

---

## 4. Blood Inventory & Cold Chain

### `GET /api/inventory`
Retrieves real-time unit counts, capacity, and cold-chain rack IDs for all 8 blood groups.

---

## 5. Hospital Requisitions (Requests)

### `GET /api/requests`
Retrieves all patient/hospital requests.

### `POST /api/requests`
Creates a new urgent requisition and decrements the corresponding blood inventory stock atomically.

---

## 6. Donation Camps & Intake

### `GET /api/camps`
Retrieves all scheduled and past donation camps with live collection unit tallies.

### `POST /api/camps`
Organizes and schedules a new blood donation camp.

**Request Body:**
```json
{
  "name": "Gujarat University Youth Blood Drive 2026",
  "date": "2026-09-30",
  "time": "09:00 AM - 05:00 PM",
  "location": "Gujarat University Convention Hall, Navrangpura",
  "city": "Ahmedabad",
  "targetUnits": 200,
  "inchargeStaff": "Tirth Patel",
  "phone": "9876543210",
  "status": "Active",
  "notes": "Mega youth drive organized under RaktSetu lead administration",
  "operator": "Tirth Patel"
}
```

### `PUT /api/camps/:id`
Updates camp schedule, operational venue, target units, or status (`Active`, `Upcoming`, `Completed`).

### `DELETE /api/camps/:id`
Cancels and removes a scheduled blood donation camp.

### `POST /api/donations`
Logs a completed donation session, increments inventory stock, and logs an immutable audit event.

---

## 7. Audit Compliance Ledger

### `GET /api/audit`
Retrieves immutable cryptographic compliance ledger logs.
