# 🌿 Plant Knowledge System

A full-stack system for managing **plant taxonomy and botanical
knowledge** including species, varieties, morphology, and distribution
data.

The project is containerized using **Docker Compose** for easy setup and
deployment.

---

# 🚀 Quick Start

## 1️⃣ Clone the repository

```bash
git clone https://github.com/KN-16/Plant-Knowledge-System.git
cd plant-knowledge-system
```

## 2️⃣ Run the system

```bash
docker compose up -d --build
```

Docker will automatically start:

- PostgreSQL
- pgAdmin
- RabbitMQ
- Backend API
- Frontend Web

---

# 🌐 Service Access URLs

Service URL

---

Frontend Web http://localhost:5173
Backend API http://localhost:3000
pgAdmin http://localhost:5050
RabbitMQ Dashboard http://localhost:15672

---

# 🔐 Default Accounts

## Admin web

http://localhost:5173/admin

Credentials:

Username: admin

Password: 123456

## pgAdmin

Login page:

http://localhost:5050

Credentials:

Email: admin@example.com

Password: adminpass

Database connection inside pgAdmin:

Host: postgres

Port: 5432

Database: plant_knowledge_db

Username: admin

Password: adminpass

---

## RabbitMQ Management

Dashboard:

http://localhost:15672

Credentials:

Username: admin

Password: admin

---

# 🗄 Database Information

Database configuration:

Database Name: plant_knowledge_db

User: admin

Password: adminpass

Port: 5432

The database is persisted using Docker volumes so data will remain even
after restarting containers.

---

# 📦 Project Services

The Docker Compose stack contains the following services:

• PostgreSQL (Database)\
• pgAdmin (Database Management UI)\
• RabbitMQ (Message Broker)\
• Backend API (Node.js + Express + Sequelize)\
• Frontend Web (Vite + Nginx)

---

# 🛑 Stop the system

```bash
docker compose down
```

---

# 🧹 Remove containers and volumes

⚠ Warning: this will delete database data.

```bash
docker compose down -v
```

---

# 🔧 Useful Commands

View running containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs -f
```

View logs of a specific service:

```bash
docker compose logs -f backend
```

Rebuild containers after code changes:

```bash
docker compose up -d --build
```

---

# 👨‍💻 Author

Le Nguyen Anh Khoi

Plant Knowledge System

Built with:

- Node.js
- Express
- PostgreSQL
- Sequelize
- RabbitMQ
- Docker
- Vite
- Nginx
