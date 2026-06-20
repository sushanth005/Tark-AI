# 🚀 ATS Resume Optimization Engine & Cover Letter Generator

An enterprise-grade, full-stack application that analyzes resumes against target job descriptions using the Llama-3.1-8b-instant AI model (via Groq). It extracts structural data, scores ATS compatibility, identifies missing skills, and dynamically generates tailored cover letters.

## 📌 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Detailed Architecture & Tech Stack](#detailed-architecture--tech-stack)
  - [Frontend (Client-Side)](#frontend-client-side)
  - [Backend (Server-Side)](#backend-server-side)
  - [Theming (Light/Dark Mode)](#theming-lightdark-mode)
- [Workflow Pipeline](#workflow-pipeline)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [API Endpoints](#api-endpoints)
- [Deployment Guide](./DEPLOYMENT.md)

## 📖 Overview
Job seekers struggle to get past automated Applicant Tracking Systems (ATS). This platform allows users to upload their PDF resume and target job description, receiving an uncompromising, granular ATS score and actionable rewrite suggestions. With the click of a button, it can also automatically generate a tailored DOCX cover letter based on the exact requirements of the job.

## ✨ Key Features
- **Granular ATS Scoring Engine**: Calculates precise scores broken down into ATS compatibility, recruiter readability, technical depth, and impact statements.
- **AI-Powered Data Extraction**: Parses PDF resumes to automatically extract Name, Job Title, Contact Info, Experience, Education, Hard Skills, and Soft Skills.
- **Actionable Structural Feedback**: Provides highly specific, point-by-point feedback.
- **Keyword Density Matrix**: Highlights the top technical keywords from your resume and compares them against the core requirements of the job description.
- **Tailored Cover Letter Generation**: One-click generation of professional cover letters.
- **Export & Download**: Export your ATS analysis report as a sleek PDF, and download your generated Cover Letter as an editable `.docx` file.
- **Secure Assessment History**: Fully authenticated user accounts safely store past resume scans.
- **Advanced Theme Support**: Implements a robust Light/Dark mode design system with granular component-level control.

## 🛠 Detailed Architecture & Tech Stack

This project is built using a modern JavaScript ecosystem, separated into a high-performance React frontend and a secure Express Node.js backend.

### Frontend (Client-Side)
The frontend is responsible for providing a highly interactive, responsive, and visually appealing user interface.

- **React 19**: The core UI library used to build the reusable component-driven architecture.
- **Vite**: Used as the build tool and development server, chosen for its lightning-fast Hot Module Replacement (HMR) and optimized build processes.
- **Tailwind CSS**: The primary styling framework. It provides utility-first CSS classes allowing for rapid, responsive design development directly within JSX.
- **React Router DOM (v7)**: Manages client-side routing, enabling a seamless Single Page Application (SPA) experience without page reloads across Dashboard, History, Login, and Registration views.
- **Recharts**: A composable charting library built on React components, used here to render the dynamic radial and bar charts for ATS scoring visualization.
- **Lucide React**: Provides a consistent, crisp set of scalable SVG icons used throughout the application's UI.
- **html2pdf.js**: A client-side library utilized to capture specific DOM elements (like the ATS report) and convert them directly into downloadable PDF files.
- **docx**: Programmatically constructs structured, properly formatted `.docx` files entirely in the browser for the generated cover letters.
- **file-saver**: Facilitates the triggering of file downloads (`.pdf` and `.docx`) securely on the client-side.
- **Axios**: A promise-based HTTP client used to seamlessly communicate with the backend REST APIs.

### Backend (Server-Side)
The backend acts as the secure processing engine, handling file parsing, database interactions, and communication with the AI models.

- **Node.js**: The JavaScript runtime environment executing the server-side code.
- **Express.js**: A minimal and flexible web application framework that structures the robust RESTful API routing system.
- **MongoDB**: The NoSQL database used for persistent, scalable storage of user profiles and historical scan logs.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB, providing rigorous schema validation and relationship mapping (e.g., linking Scans to Users).
- **JSON Web Tokens (JWT)**: Used for stateless, secure user authentication and protecting sensitive API routes.
- **bcryptjs**: Safely hashes user passwords before storing them in the database, protecting against security breaches.
- **Groq SDK**: Connects the backend directly to Groq's high-performance inference cloud, leveraging the ultra-fast `llama-3.1-8b-instant` LLM to process resumes and generate cover letters with near-zero latency.
- **pdf-ts**: A robust library used to parse and extract raw textual data from the uploaded PDF resumes.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used here to process file uploads (the PDF resumes) directly into server memory for immediate parsing.
- **CORS & Dotenv**: Middleware for handling Cross-Origin Resource Sharing securely, and managing environment-specific configurations respectively.

### Theming (Light/Dark Mode)
A significant focus was placed on creating a premium visual aesthetic through a comprehensive theming engine.

- **Tailwind's `darkMode: 'class'`**: The application uses Tailwind CSS's class-based dark mode strategy. This approach offers granular, developer-defined control over exactly how every single component reacts to the theme change via the `dark:` utility prefix.
- **Dynamic Utility Variants**: Instead of maintaining separate CSS files, the application utilizes inline utility variants (e.g., `bg-white dark:bg-slate-900/50`). This ensures that theme toggling is immediate and styles are collocated directly with their respective React components.
- **Glassmorphism & Gradients**: The dark theme isn't just a simple inversion of colors. It utilizes specific deep slate backgrounds (`bg-slate-900/50`), subtle backdrop blurs (`backdrop-blur-xl`), and glowing accent gradients (`dark:bg-indigo-600/20` and `dark:bg-purple-600/10`) to create a deep, immersive, and premium UI experience.
- **Smooth Transitions**: Micro-animations and transition utilities (`transition-colors duration-1000`) are applied globally to ensure that switching between Light and Dark visual states is a fluid, pleasing experience rather than a jarring flash.

## ⚙️ Workflow Pipeline
1. **Secure Access**: Users create an account or login. JWTs are issued.
2. **Upload & Input**: The user uploads a PDF resume and inputs a Target Job Role + Job Description.
3. **Data Extraction**: The Node.js backend receives the file via `multer` memory storage and uses `pdf-ts` to parse the raw text.
4. **AI Processing**: The extracted text and JD are passed to the Groq Cloud Inference engine.
5. **Results Generation**: The LLM responds with a strictly structured JSON payload detailing missing skills, rewrite suggestions, etc.
6. **Dashboard Visualization**: React processes the JSON, rendering the analysis beautifully into radial graphs and dynamic lists.
7. **Cover Letter Crafting**: A secondary AI pipeline is triggered, using the parsed data to write a tailored cover letter.
8. **Export**: Users download their ATS report and cover letter.

## 📂 Project Structure
```
Gemini-Grader/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas (User, Scan)
│   ├── routes/          # Express API routes (Auth, Scan pipelines)
│   ├── server.js        # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React Context for global Auth state
    │   ├── pages/       # Core views (Dashboard, History, Login, Register)
    │   ├── App.jsx      # Main router and layout
    │   └── index.css    # Tailwind entry and global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Local Development Setup
*(Prerequisites: Node.js (v18+), MongoDB, Groq API Key)*

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Gemini-Grader
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_api_key
```
Start the backend server in development mode:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```
Your application should now be running on `http://localhost:5173`.

## 🔌 API Endpoints
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Scan**: `POST /api/scan/analyze`, `GET /api/scan/`, `POST /api/scan/generate-cover-letter/:scanId`

## 🌍 Deployment
For detailed instructions on how to push your code to GitHub and deploy the application using **Render** (Backend) and **Vercel** (Frontend), please see the **[Deployment Guide](DEPLOYMENT.md)**.
