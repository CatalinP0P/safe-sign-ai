# 🛡️ Safe Sign AI - Document Analyzer

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Safe Sign AI** is an intelligent platform that allows users to upload documents, store them securely, and analyze them using AI. The project is fully containerized for a fast and consistent deployment.

---

## 🚀 Key Technologies

- **Backend:** FastAPI (Python 3.11)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Frontend:** React (Vite)
- **Infrastructure:** Docker & Docker Compose

---

## 🛠️ System Architecture

The application is divided into three main containers:

1. **`backend`**: The primary API handling file processing, business logic, and database communication.
2. **`db`**: A PostgreSQL instance for storing metadata, user info, and document statuses.
3. **`frontend`**: The React-based user interface for seamless user interaction.

---

## 🏁 Quick Start (Docker)

### 1. Clone the project
```bash
git clone [https://github.com/user/safe-sign-ai.git](https://github.com/user/safe-sign-ai.git)
cd safe-sign-ai
```

### 2. Launch the infrastructure
```bash
docker compose up --build
```

### 3. Access the services
- **Web Interface:** [http://localhost:5173](http://localhost:5173)
- **API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── database/     # DB Config & Models (SQLAlchemy)
│   │   ├── endpoints/    # API Routes (Upload, Retrieval)
│   │   └── main.py       # API Entry Point
│   ├── uploads/          # Physical PDF storage
│   └── Dockerfile
├── frontend/             # React Application
└── docker-compose.yml    # Infrastructure configuration
```

---

## 🛣️ Roadmap & Status

- [x] **Infrastructure:** Docker Compose & Network setup.
- [x] **Database:** Models for `User` and `Document`.
- [x] **File Management:** Secure upload and metadata persistence.
- [ ] **Security:** JWT Authentication implementation.
- [ ] **AI Engine:** OCR/LLM integration for text analysis.
- [ ] **UI:** Enhanced Dashboard with analysis status and statistics.

---

## 🔧 Maintenance Commands

| Action | Command |
| :--- | :--- |
| **Rebuild Backend** | `docker compose up --build backend` |
| **View Logs** | `docker compose logs -f` |
| **Stop Project** | `docker compose down` |
| **Clean Docker Cache** | `docker system prune -f` |

---

> 💡 **Tip:** Ensure you have your environment variables properly configured in the `docker-compose.yml` or a `.env` file before deploying to production!