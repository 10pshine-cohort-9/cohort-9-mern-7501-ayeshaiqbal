# Cohort 9 MERN Notes App

A full-stack Notes Management Application developed using React.js, Node.js, Express.js, and MySQL as part of the **10Pearls Shine Internship Program — Cohort 9**.

The application allows authenticated users to create, view, update, delete, search, and manage their personal notes. It also includes password recovery, rich text editing, dark/light mode, logging, exception handling, automated testing, and SonarQube code quality analysis.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Authentication](#authentication)
* [Notes Management](#notes-management)
* [User Interface](#user-interface)
* [Security and Code Quality](#security-and-code-quality)
* [Testing](#testing)
* [SonarQube Analysis](#sonarqube-analysis)
* [Installation and Setup](#installation-and-setup)
* [Environment Variables](#environment-variables)
* [Running the Application](#running-the-application)
* [Git Workflow](#git-workflow)
* [Documentation](#documentation)
* [Repository Information](#repository-information)

---

## Project Overview

The **Cohort 9 MERN Notes App** is a full-stack web application designed to provide users with a secure and organized platform for managing personal notes.

The project follows a client-server architecture:

* The frontend is developed using React.js.
* The backend is developed using Node.js and Express.js.
* MySQL is used for persistent data storage.
* REST APIs are used for communication between the frontend and backend.
* JWT is used for authentication.
* Pino is used for application logging.
* Mocha and Chai are used for automated testing.
* SonarQube is used for static code quality and security analysis.

---

## Features

### Authentication

* User Sign Up
* User Login
* User Logout
* JWT-based authentication
* Password hashing
* Forgot Password
* Password Reset
* Protected routes and authenticated API requests

### Notes Management

* Create notes
* View notes
* Edit notes
* Delete notes
* Search notes
* Search suggestions
* User-specific notes
* Rich text note editing
* Checklist / Todo items
* Text formatting
* Text color and highlighting
* Image upload within notes
* Note sharing
* Note export

### User Interface

* Responsive design
* Light mode
* Dark mode
* Clean and user-friendly dashboard
* Rich text editor
* Search interface with suggestions
* Responsive note management interface

### Backend and Application Features

* RESTful APIs
* Middleware-based request handling
* JWT authentication middleware
* Centralized exception handling
* Application logging
* Database integration
* Input validation
* Secure password storage

### Testing and Code Quality

* Automated backend tests
* Frontend tests
* Mocha and Chai testing
* Code coverage reports
* SonarQube static code analysis
* Quality Gate analysis
* Security analysis
* Reliability analysis
* Maintainability analysis
* Code duplication analysis

---

## Technology Stack

| Category          | Technology                    |
| ----------------- | ----------------------------- |
| Frontend          | React.js                      |
| Build Tool        | Vite                          |
| Styling           | Tailwind CSS                  |
| Backend           | Node.js                       |
| Framework         | Express.js                    |
| Database          | MySQL                         |
| Authentication    | JWT                           |
| Password Security | bcrypt                        |
| Logging           | Pino / pino-http              |
| Testing           | Mocha, Chai, Supertest, Sinon |
| Code Coverage     | NYC                           |
| Code Quality      | SonarQube                     |
| Version Control   | Git / GitHub                  |

---

## Project Structure

```text
cohort-9-mern-7501-ayeshaiqbal/
│
├── backend/
│   ├── src/
│   ├── test/
│   ├── coverage/
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── tests/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
│
├── docs/
│   └── sonarqube/
│       ├── SonarQube_Code_Quality_Report.docx
│       ├── backend-scan-success.PNG
│       └── frontend-scan-success.PNG
│
├── sonar-project.properties
├── .gitignore
└── README.md
```

---

## Authentication

The application provides a complete authentication flow for users.

### Sign Up

New users can create an account using their credentials. Passwords are securely hashed before being stored in the database.

### Login

Registered users can log in using their credentials. Successful authentication generates a JWT token that is used to access protected resources.

### Logout

Users can securely log out of the application and end their authenticated session.

### Forgot Password

Users can request a password reset if they forget their password.

### Password Reset

A password reset flow allows users to create a new password using the reset mechanism provided by the application.

---

## Notes Management

Authenticated users can manage their notes through CRUD operations.

### Create

Users can create new notes using the note editor.

### Read

Users can view their saved notes from the dashboard.

### Update

Existing notes can be edited and updated.

### Delete

Users can delete notes that are no longer required.

### Search

Users can search through their notes using keywords.

### Search Suggestions

The application provides search suggestions to make note discovery easier.

---

## Rich Text Editing

The notes editor supports rich text functionality, including:

* Bold text
* Italic text
* Underline
* Font size
* Text color
* Highlighting
* Checklists
* Images
* Rich text formatting

---

## Security and Code Quality

The application includes several practices to improve security and maintainability:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Authentication middleware
* Exception handling
* Application logging
* Automated testing
* Code coverage
* Static code analysis using SonarQube

Sensitive credentials such as database passwords, JWT secrets, and SonarQube authentication tokens are not committed to the repository.

---

## Testing

The project includes automated tests for application functionality and API behavior.

### Backend Tests

To run the backend test suite:

```bash
cd backend
npm test
```

### Generate Coverage

Coverage can be generated using NYC:

```bash
npx nyc npm test
```

The generated coverage report can be used by SonarQube during code quality analysis.

---

## SonarQube Analysis

SonarQube was configured to analyze the frontend and backend independently.

### Frontend Analysis

The frontend was analyzed as the `frontend` SonarQube project.

```text
Project Key: frontend
```

### Backend Analysis

The backend was analyzed as the `notes-app` SonarQube project.

```text
Project Key: notes-app
```

Both analyses were successfully completed and uploaded to the local SonarQube server.

### SonarQube Results

| Metric                 | Frontend | Backend |
| ---------------------- | -------: | ------: |
| Quality Gate           |   Passed |  Passed |
| Security Rating        |        A |       B |
| Reliability Rating     |        C |       A |
| Maintainability Rating |        A |       A |
| Coverage               |     2.7% |   27.2% |
| Duplications           |     1.2% |    7.3% |

The detailed SonarQube report and scan evidence are available in:

```text
docs/sonarqube/
```

The SonarQube authentication token used during analysis is not included in this repository.

---

## Installation and Setup

### Prerequisites

Make sure the following software is installed:

* Node.js
* npm
* MySQL
* Git
* SonarQube (required only for SonarQube analysis)

### Clone the Repository

```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-7501-ayeshaiqbal.git
cd cohort-9-mern-7501-ayeshaiqbal
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Do not commit the `.env` file to GitHub.

---

## Running the Application

### Start the Backend

From the backend directory:

```bash
npm start
```

The backend runs according to the port configured in the application environment.

### Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm run dev
```

The Vite development server will display the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

---

## SonarQube Local Analysis

Start the local SonarQube server and make sure it is available at:

```text
http://localhost:9000
```

### Frontend Scan

```powershell
cd frontend
$env:SONAR_HOST_URL="http://localhost:9000"
$env:SONAR_TOKEN="YOUR_SONAR_TOKEN"
sonar-scanner-npm
```

### Backend Scan

```powershell
cd backend
$env:SONAR_HOST_URL="http://localhost:9000"
$env:SONAR_TOKEN="YOUR_SONAR_TOKEN"
sonar-scanner-npm
```

Never add an actual SonarQube token to this README or commit it to GitHub.

---

## Git Workflow

The project uses feature branches for development.

Example:

```bash
git checkout -b feature/sonarqube-report
```

After completing changes:

```bash
git add .
git commit -m "feat: add SonarQube analysis and code quality report"
git push -u origin feature/sonarqube-report
```

Changes can then be submitted through a Pull Request for review and merging.

---

## Documentation

The SonarQube analysis documentation is available in the repository under:

```text
docs/sonarqube/
```

The folder contains:

* SonarQube analysis report
* Frontend scan evidence
* Backend scan evidence

Detailed project documentation and analysis evidence are maintained separately from the application source code to keep the repository organized.

---

## Repository Information

| Field        | Details                           |
| ------------ | --------------------------------- |
| Project      | Cohort 9 MERN Notes App           |
| Program      | 10Pearls Shine Internship Program |
| Cohort       | Cohort 9                          |
| Author       | Ayesha Iqbal                      |
| Frontend     | React.js                          |
| Backend      | Node.js / Express.js              |
| Database     | MySQL                             |
| Code Quality | SonarQube                         |

---

## Conclusion

The Cohort 9 MERN Notes App demonstrates a complete full-stack application with authentication, CRUD functionality, search, password recovery, rich text editing, responsive UI, logging, exception handling, automated testing, and SonarQube-based code quality analysis.

The project follows a structured Git workflow with feature branches and Pull Requests to support organized development and code review.
