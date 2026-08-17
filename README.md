# TripNest ✈️

TripNest is a full-stack travel planning and trip management MVP built with a modern backend and responsive frontend. It enables travelers to create trips, plan daily itineraries, track expenses, and view dynamic budget analysis through a comprehensive dashboard.

---

## 🛠️ Tech Stack & Technologies

### Backend
- **Core**: Spring Boot 3.3.5, Java 21
- **Security**: Spring Security (JWT-based Token Authentication)
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: MySQL / MariaDB

### Frontend
- **Framework**: React 18 (Vite-powered SPA)
- **Styling**: Tailwind CSS v3 & Lucide React (icons)
- **HTTP Client**: Axios (configured with interceptors to automatically forward Bearer tokens)
- **Routing**: React Router v6

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed:
- **Java Development Kit (JDK)**: Version 21 or higher
- **Node.js**: Version 18 or higher (with `npm`)
- **MySQL 8+ / MariaDB 10.6+**: Or use the pre-packaged portable MariaDB included in this project workspace under `.tools/`.

---

## 🗄️ MySQL Setup

TripNest is already configured to use MySQL by default in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties). The backend connects with these defaults unless you override them with environment variables:

- `DB_URL=jdbc:mysql://localhost:3306/tripnest?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `DB_USERNAME=root`
- `DB_PASSWORD=password`

### Option A: Local MySQL

1. Install MySQL Server 8.x.
2. Start the MySQL service.
3. Create a database user if you do not want to use `root`.
4. Optionally create the database yourself, although the backend can create it automatically because of `createDatabaseIfNotExist=true`.
5. Update the environment variables above if your MySQL username or password is different.

Example SQL if you want to create the database manually:

```sql
CREATE DATABASE tripnest;
```

### Option B: Portable MariaDB Included in Repo

If you are on Windows and want the bundled database, start the portable MariaDB from `.tools/` instead of installing MySQL separately.

---

## 🚀 Quick Start (First-Time Setup and Running)

Follow this step-by-step guide from your project root directory using **PowerShell** on Windows.

### Step 1: Start MariaDB Database
The repository comes pre-packaged with a portable database. Run this script in PowerShell to launch MariaDB in the background:

```powershell
$data = Join-Path (Get-Location) ".tools\mariadb-data"
$exe = Join-Path (Get-Location) ".tools\mariadb-11.4.5-winx64\bin\mariadbd.exe"
Start-Process -FilePath $exe -ArgumentList "--datadir=$data","--port=3306","--bind-address=127.0.0.1","--skip-ssl" -WindowStyle Hidden
```

Verify that the database is running and accepting connections:

```powershell
.\.tools\mariadb-11.4.5-winx64\bin\mariadb.exe --host=127.0.0.1 --port=3306 --user=root --password=password --ssl=0 -e "SELECT VERSION();"
```

> [!NOTE]
> Database tables and constraints are managed by Hibernate. On application startup, the backend automatically generates tables via `ddl-auto=update` and runs a setup initializer to insert user/admin roles.

> [!TIP]
> If you are using your own MySQL installation instead of the bundled MariaDB, set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` before starting the backend. For example in PowerShell:
>
> ```powershell
> $env:DB_URL="jdbc:mysql://localhost:3306/tripnest?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
> $env:DB_USERNAME="root"
> $env:DB_PASSWORD="your-password"
> ```

---

### Step 2: Install & Start the Backend API Server
Open a PowerShell window, navigate to the `backend` directory, and run the server using the local Maven installation:

```powershell
cd backend
..\.tools\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

- The API server will boot up and listen on **`http://localhost:8080`**.
- Verify that the server is responding (you should receive a `401 Unauthorized` response which confirms security endpoints are active):
  ```powershell
  Invoke-WebRequest -UseBasicParsing http://localhost:8080/api/dashboard
  ```

---

### Step 3: Install & Start the Frontend Web App
Open a **second** PowerShell window, navigate to the `frontend` directory, install dependencies, and start Vite:

> [!WARNING]
> On Windows PowerShell, running raw `npm` commands may fail due to the system's script execution policy (`UnauthorizedAccess`). To avoid this, explicitly invoke **`npm.cmd`**.

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

- The web app will start and listen on **`http://localhost:5173/`**.
- Open your browser and navigate to `http://localhost:5173/`. You will be redirected to the login/registration screen to create your user account.

---

## 🧪 Running Integration Tests

An automated, full-flow integration test script is located in `scripts/api_test_flow.js`. This script tests the backend's entire REST API flow including user registration, trip creation, itinerary additions, expense logging, budget updating, and cleanup/deletion.

To execute the test:
1. Ensure both the MariaDB database and Spring Boot backend are running.
2. Open a PowerShell window, navigate to the `frontend` folder (to resolve standard node modules), and execute the script:
   ```powershell
   cd frontend
   node ../scripts/api_test_flow.js
   ```

---

## 📁 Repository Structure

```text
TripNest/
├── backend/            # Spring Boot REST API
│   ├── src/main/java   # Java Source (Entities, Controllers, DTOs, Services, Config)
│   └── pom.xml         # Maven configuration
├── frontend/           # React + Vite client application
│   ├── src/            # Components, Pages, Layouts, Contexts
│   └── package.json    # Frontend package configuration
├── scripts/            # Build, test, and utility scripts
│   └── api_test_flow.js# End-to-end API integration test flow script
└── docs/               # Architecture notes, API specifications, and Postman collections
```

---

## 💡 Troubleshooting & Port Configuration

### Port Conflicts
If you encounter errors saying address is already in use:

1. **Find conflicting process ID (PID)**:
   ```powershell
   # Find process using Port 8080 (Backend)
   netstat -ano | findstr 8080

   # Find process using Port 5173 (Frontend)
   netstat -ano | findstr 5173
   ```
2. **Terminate the process**:
   ```powershell
   taskkill /F /PID <PID_FROM_COMMAND_ABOVE>
   ```

### Custom Configurations
- **Database Connection**: Update `backend/src/main/resources/application.properties` (set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- **Frontend API Endpoint**: Alter the `VITE_API_URL` environment variable or edit `frontend/src/api/client.js` (defaults to `http://localhost:8080/api`).

---

## Production deployment (free student demo)

The included `render.yaml` deploys the Spring API on Render Free, and `frontend/vercel.json` enables Vercel SPA routing. Create a free TiDB Cloud Starter cluster and use its MySQL-compatible TLS connection values in Render:

| Render variable | Value |
| --- | --- |
| `DB_URL` | TiDB JDBC URL, including its required TLS parameters |
| `DB_USERNAME` / `DB_PASSWORD` | TiDB database credentials |
| `JWT_SECRET` | A unique random secret of at least 32 characters |
| `CORS_ALLOWED_ORIGINS` | The exact Vercel URL, for example `https://tripnest.vercel.app` |
| `SPRING_PROFILES_ACTIVE` | `prod` |

1. Push this repository to GitHub and create a Render Web Service from `render.yaml`. Set the variables above before deploying.
2. In Vercel, import the same repository and set the Root Directory to `frontend`. Set `VITE_API_URL` to `https://<render-service>.onrender.com/api` and `VITE_DOCUMENT_UPLOADS_ENABLED=false`.
3. Deploy Vercel, then update Render `CORS_ALLOWED_ORIGINS` with the resulting Vercel URL and redeploy Render.

Both providers supply HTTPS automatically. Render Free services sleep after 15 minutes without traffic; the first request can take about a minute. Document uploads are intentionally disabled in production because Render Free has no persistent filesystem.

### Test commands

```powershell
cd backend
mvn test
cd ..\frontend
npm.cmd run test
npm.cmd run build
node ..\scripts\api_test_flow.js
```
