# 🚀 ATS Resume Optimization Engine & Cover Letter Generator

An enterprise-grade, full-stack application that analyzes resumes against target job descriptions using the Llama-3.1-8b-instant AI model (via Groq). It extracts structural data, scores ATS compatibility, identifies missing skills, and dynamically generates tailored cover letters.

## 📌 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Workflow Pipeline](#workflow-pipeline)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [API Endpoints](#api-endpoints)
- [Deployment Guide](./DEPLOYMENT.md)

## 📖 Overview
Job seekers struggle to get past automated Applicant Tracking Systems (ATS). This platform allows users to upload their PDF resume and target job description, receiving an uncompromising, granular ATS score and actionable rewrite suggestions. With the click of a button, it can also automatically generate a tailored DOCX cover letter based on the exact requirements of the job.

## ✨ Key Features

- **Granular ATS Scoring Engine**: Calculates precise scores broken down into ATS compatibility, recruiter readability, technical depth, and impact statements.
- **AI-Powered Data Extraction**: Parses PDF resumes to automatically extract Name, Job Title, Contact Info, Experience, Education, Hard Skills, and Soft Skills. Equipped with an Auto-Correction pipeline to fix common PDF/OCR misreads.
- **Actionable Structural Feedback**: Provides highly specific, point-by-point feedback. Instead of generic advice, it targets existing project names and company bullet points found in your resume, telling you exactly what phrasing or metrics to inject.
- **Keyword Density Matrix**: Highlights the top technical keywords from your resume and compares them against the core requirements of the job description to find missing priority items.
- **Tailored Cover Letter Generation**: One-click generation of professional cover letters that dynamically merge your parsed resume history with the employer's exact job requirements.
- **Export & Download**: Export your beautiful ATS analysis report as a sleek PDF, and download your generated Cover Letter as an editable `.docx` file.
- **Secure Assessment History**: Fully authenticated user accounts safely store past resume scans in MongoDB for future reference and comparison.

## 🛠 Architecture & Tech Stack

### Frontend (Client-Side)
- **Framework**: React 19 built with Vite for lightning-fast HMR and compilation.
- **Styling**: TailwindCSS for utility-first, modern, responsive design (including dark-mode optimizations and glassmorphism elements).
- **Icons**: Lucide React for consistent, crisp SVG iconography.
- **Data Visualization**: Recharts for rendering the dynamic radial score charts.
- **Document Generation**: 
  - `html2pdf.js` for capturing the DOM and generating the ATS PDF reports.
  - `docx` and `file-saver` for programmatically structuring and downloading the cover letter.
- **Routing & State**: React Router DOM for SPA navigation.

### Backend (Server-Side)
- **Runtime**: Node.js & Express.js.
- **Database**: MongoDB (via Mongoose ODM) for persistent storage of user profiles and historical scan logs.
- **Authentication**: Custom JWT (JSON Web Tokens) and `bcryptjs` for secure password hashing and route protection.
- **AI Inference Engine**: Groq SDK connecting to `llama-3.1-8b-instant` for ultra-fast, near-instantaneous LLM processing.
- **File Parsing**: `pdf-ts` for robust PDF text extraction, handled in memory via `multer`.

## ⚙️ Workflow Pipeline

1. **Secure Access**: Users create an account or login. JWTs are issued and stored in local storage.
2. **Upload & Input**: The user uploads a PDF resume and inputs a Target Job Role + Job Description.
3. **Data Extraction**: The Node.js backend receives the file via `multer` memory storage and uses `pdf-ts` to parse the raw text.
4. **AI Processing**: The extracted text and JD are passed to the Groq Cloud Inference engine with an advanced, strict system prompt.
5. **Results Generation**: The LLM responds with a strictly structured JSON payload detailing missing skills, rewrite suggestions, keyword density, extracted sections, and an overall score.
6. **Dashboard Visualization**: React processes the JSON, rendering the analysis beautifully into graphs, dynamic lists, and visual UI components.
7. **Cover Letter Crafting**: With a single click, a secondary AI pipeline is triggered, using the parsed data to write a professional cover letter specifically tailored to the target JD.
8. **Export**: Users download their ATS report and cover letter, while the scan is automatically archived to their history.

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
    │   ├── components/  # Reusable UI components (Navbar, Footer)
    │   ├── context/     # React Context for global Auth state
    │   ├── pages/       # Core views (Dashboard, History, Login, Register)
    │   ├── App.jsx      # Main router and layout
    │   └── index.css    # Tailwind entry and global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local installation or MongoDB Atlas Cluster URI)
- Groq API Key (Free tier available at console.groq.com)

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
# or
nodemon server.js
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

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user account.
- `POST /login`: Authenticate and receive a JWT.
- `GET /me`: Validate token and fetch current user profile.

### Scan Routes (`/api/scan`)
- `POST /analyze`: Upload a PDF and JD to run the core ATS AI optimization pipeline.
- `GET /`: Retrieve all historical scan logs for the authenticated user.
- `POST /generate-cover-letter/:scanId`: Trigger the LLM to generate a custom cover letter for a specific historical scan.

## 🌍 Deployment

For detailed instructions on how to push your code to GitHub and deploy the application using **Render** (Backend) and **Vercel** (Frontend), please see the **[Deployment Guide](DEPLOYMENT.md)**.
