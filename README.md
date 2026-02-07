
# BizFlow SaaS Dashboard

BizFlow is a production-ready Business Management Dashboard for SMEs. It features a full-stack architecture (simulated in this demo) with React, TypeScript, and Tailwind CSS.

## 🚀 Core Features
- **KPI Dashboard**: Real-time business metrics and data visualization.
- **CRM (Customer Management)**: Robust CRUD operations for client data.
- **Transaction Ledger**: Track revenue and filter by status/date.
- **AI Insights**: Integrated Gemini API for automated business performance analysis.
- **Authentication**: Secure role-based access control (Admin/User).

## 🛠 Backend Architecture (System Design)
While this demo uses a mocked service layer, a production deployment would use:

### Database Schema (MySQL)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    status ENUM('Active', 'Inactive', 'Lead') DEFAULT 'Lead',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Completed', 'Pending', 'Cancelled') DEFAULT 'Pending',
    category VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

### API Endpoints (Express Example)
- `POST /api/auth/login`: Authenticate user and return JWT.
- `GET /api/dashboard/stats`: Aggregated KPI data.
- `GET /api/customers`: Paginated customer list.
- `POST /api/customers`: Create new customer.
- `GET /api/transactions`: Full transaction history.

## 📦 Deployment Steps
1. **Frontend**: Build using `npm run build` and host the static files on AWS S3 + CloudFront or Vercel.
2. **Backend**: Deploy Node.js/Express to AWS EC2 or a VPS using PM2 for process management.
3. **Database**: Use a managed MySQL service like AWS RDS for high availability.
4. **Proxy**: Configure Nginx as a reverse proxy to handle SSL and route `/api` requests to the backend.

## 🧪 Interview Highlights
- **Clean Code**: Adheres to SOLID principles and functional React patterns.
- **UI/UX**: Mobile-first responsive design with a premium SaaS aesthetic.
- **Scalability**: Decoupled API service layer allows for easy transition from mock to production.
- **AI-Powered**: Practical application of LLMs for data-driven business decisions.
