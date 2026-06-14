# 🌍 GitHub & Production Deployment Guide

This guide details exactly how to push your code to GitHub and deploy the application for free using **Render** (for the Node.js Backend) and **Vercel** (for the React Frontend).

## Phase 1: Push Code to GitHub

Before deploying, ensure you push your code to a single GitHub repository.

1. Open a terminal at the root of your project (`Gemini-Grader`).
2. Ensure both `backend` and `frontend` folders contain a `.gitignore` file that ignores the `node_modules` folder and `.env` files.
3. Run the following git commands:
```bash
git init
git add .
git commit -m "Initial commit for ATS Resume Engine"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Phase 2: Important URL Updates Before Frontend Deployment

Currently, the frontend points to `http://localhost:5000` to communicate with the backend during local development. You **must** update this before deploying to Vercel!

1. Open the following files in `frontend/src/pages/`:
   - `Register.jsx`
   - `Login.jsx`
   - `Dashboard.jsx`
   - `History.jsx`
2. **Find and Replace** `http://localhost:5000` with the actual Render URL you will generate in Phase 3 (e.g., `https://gemini-grader-backend.onrender.com`).
   *(Pro-Tip: Alternatively, you can replace them with `import.meta.env.VITE_API_URL` and set that variable in Vercel's Environment Variables panel!)*
3. Save the files and push these changes to GitHub:
```bash
git add .
git commit -m "Update API URLs for production deployment"
git push
```

## Phase 3: Deploy Backend on Render

1. Go to [Render.com](https://render.com) and sign in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `Gemini-Grader` repository.
4. Fill in the following configurations:
   - **Name**: `gemini-grader-backend` (or similar)
   - **Root Directory**: `backend` 
     > ⚠️ **CRITICAL:** You must specify `backend` as the Root Directory so Render looks in the right folder!
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Scroll down to **Environment Variables** and add your `.env` keys:
   - `MONGO_URI`: (Your MongoDB connection string)
   - `JWT_SECRET`: (Your secure JWT Secret Key)
   - `GROQ_API_KEY`: (Your Groq API Key)
6. Click **Create Web Service**. Wait 2-3 minutes for the build to finish.
7. Copy the generated URL (e.g., `https://gemini-grader-backend.onrender.com`). 
   > **Don't forget to use this URL to update your frontend files if you skipped Phase 2!**

## Phase 4: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your `Gemini-Grader` repository.
4. In the **Configure Project** screen, set the following:
   - **Project Name**: `gemini-grader-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` 
     > ⚠️ **CRITICAL:** Click the edit button and select the `frontend` folder!
5. The **Build and Output Settings** should auto-fill to:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**. Vercel will build your React application in seconds!
7. Once finished, click **Continue to Dashboard** and visit your shiny new live web app!
