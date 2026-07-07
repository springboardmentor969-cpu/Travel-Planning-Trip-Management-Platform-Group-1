# TripNest

TripNest is a full-stack travel planning MVP built with Spring Boot 3, Java 21, MySQL, React, Vite, Axios, React Router, Tailwind CSS, and Lucide React.

## Features

- Create, view, and update users
- Create, edit, delete, view, and list trips
- Add, edit, and delete itinerary days
- Track expenses and remaining budget
- Dashboard with trip count, upcoming trips, total expenses, and remaining budget

## Project Structure

```text
backend/   Spring Boot REST API
frontend/  React Vite app
docs/      SQL schema, sample data, API docs, Postman collection
```

## Quick Start On This Machine

This workspace already has local runtime tools downloaded under `.tools/`:

- Maven: `.tools/apache-maven-3.9.11`
- Portable MariaDB: `.tools/mariadb-11.4.5-winx64`
- MariaDB data directory: `.tools/mariadb-data`

Use these commands from the project root in PowerShell.

### 1. Start MariaDB

```powershell
$data = Join-Path (Get-Location) ".tools\mariadb-data"
$exe = Join-Path (Get-Location) ".tools\mariadb-11.4.5-winx64\bin\mariadbd.exe"
Start-Process -FilePath $exe -ArgumentList "--datadir=$data","--port=3306","--bind-address=127.0.0.1","--skip-ssl" -WindowStyle Hidden
```

Verify the database is running:

```powershell
.\.tools\mariadb-11.4.5-winx64\bin\mariadb.exe --host=127.0.0.1 --port=3306 --user=root --password=password --ssl=0 -e "SELECT VERSION();"
```

### 2. Load Schema And Sample Data

```powershell
.\.tools\mariadb-11.4.5-winx64\bin\mariadb.exe --host=127.0.0.1 --port=3306 --user=root --password=password --ssl=0 -e "source D:/Projects/TripNest/docs/schema.sql; source D:/Projects/TripNest/docs/sample-data.sql;"
```

### 3. Start The Backend

```powershell
cd backend
..\.tools\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

The API runs at `http://localhost:8080/api`.

Check it:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8080/api/dashboard
```

### 4. Start The Frontend

Open a second PowerShell window:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

The web app runs at `http://localhost:5173`.

## Standard Backend Setup

Requirements: Java 21, Maven, MySQL or MariaDB.

Create the database:

```sql
CREATE DATABASE tripnest;
```

Configure MySQL using environment variables or edit `backend/src/main/resources/application.properties`.

```text
DB_URL=jdbc:mysql://localhost:3306/tripnest?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=password
```

Run the API:

```bash
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080/api`.

## Standard Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

Set `VITE_API_URL` if your backend is not on `http://localhost:8080/api`.

## Database Artifacts

- Schema: `docs/schema.sql`
- Sample data: `docs/sample-data.sql`

You can load both with MySQL:

```bash
mysql -u root -p < docs/schema.sql
mysql -u root -p < docs/sample-data.sql
```

## API Documentation

See `docs/api.md`.

## Postman

Import `docs/postman_collection.json` into Postman.

## MVP Scope

This project intentionally excludes authentication, OAuth, Spring Security, email, notifications, maps, weather APIs, payments, analytics, Docker, cloud deployment, and file uploads.
