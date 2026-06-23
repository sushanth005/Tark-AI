# Interview Preparation: Tark AI (MERN Stack Project)

This document covers the core concepts, packages, and specific implementations (like Dark Mode) used in this project, tailored for interview preparation.

## 1. MERN Stack Core Concepts

### MongoDB (Database)
- **What it is:** A NoSQL database that stores data in JSON-like documents (BSON).
- **Why use it:** Flexible schema, highly scalable, and integrates seamlessly with JavaScript/Node.js since data is represented as objects.
- **Key Concepts:** Collections (tables), Documents (rows), Schema validation (using Mongoose).
- **Interview Question:** "Why did you choose MongoDB over SQL for this project?" 
  - *Answer:* For its flexibility with unstructured data (like LLM responses or varied user metadata) and seamless JSON data flow from backend to frontend.

### Express.js (Backend Framework)
- **What it is:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Why use it:** It simplifies building API endpoints, handling HTTP requests, and managing middleware.
- **Key Concepts:** Routing, Middleware (functions that have access to the request and response objects), Error Handling.
- **Interview Question:** "What is middleware in Express?"
  - *Answer:* Functions that execute during the request-response cycle. In this project, we use middleware for CORS, parsing JSON, and authentication (verifying JWT tokens before accessing protected routes).

### React.js (Frontend Library)
- **What it is:** A JavaScript library for building user interfaces using a component-based architecture.
- **Why use it:** Reusability of components, Virtual DOM for efficient rendering, and a massive ecosystem.
- **Key Concepts:** Components, State, Props, Hooks (`useState`, `useEffect`, `useContext`), React Router for SPA navigation.
- **Interview Question:** "How do you manage state in your application?"
  - *Answer:* For local component state, we use `useState`. For global state like Authentication (tokens, user info), we use the Context API (`AuthContext`) to avoid prop drilling.

### Node.js (Runtime Environment)
- **What it is:** An asynchronous event-driven JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Why use it:** Allows using JavaScript on the backend, enabling full-stack JavaScript development. Non-blocking I/O makes it great for handling concurrent requests.
- **Key Concepts:** Event Loop, Asynchronous programming (Promises, async/await), NPM (Node Package Manager).

---

## 2. Packages Used in the Project

### Frontend Dependencies
- **React & React DOM (`react`, `react-dom`):** Core UI libraries.
- **Vite (`vite`):** Extremely fast build tool and development server.
- **React Router (`react-router-dom`):** Handles client-side routing (e.g., navigating from `/login` to `/dashboard` without reloading the page).
- **Axios (`axios`):** Promise-based HTTP client to make API calls to the backend. Preferred over `fetch` for automatic JSON transformation and better error handling.
- **Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`):** Utility-first CSS framework for rapid UI styling directly in JSX.
- **Lucide React (`lucide-react`):** Clean and customizable SVG icons.
- **Recharts (`recharts`):** Composable charting library for rendering graphs/analytics in the dashboard.
- **File Generation (`docx`, `html2pdf.js`, `file-saver`):** Used for generating and downloading reports/documents on the client side.

### Backend Dependencies
- **Express (`express`):** API framework.
- **Mongoose (`mongoose`):** Object Data Modeling (ODM) library for MongoDB. Enforces schemas and provides an easy API for database operations.
- **JSON Web Token (`jsonwebtoken`):** Used for stateless authentication. Generates a token upon login which the frontend sends in the headers of subsequent requests.
- **Bcrypt.js (`bcryptjs`):** Hashes user passwords before storing them in the database so plaintext passwords are never exposed.
- **Cors (`cors`):** Middleware to enable Cross-Origin Resource Sharing, allowing the frontend to securely communicate with the backend.
- **Dotenv (`dotenv`):** Loads environment variables from a `.env` file (like DB URIs and secret keys).
- **Multer (`multer`):** Middleware for handling `multipart/form-data`, primarily used for file uploads.
- **Groq SDK (`groq-sdk`):** SDK to interact with Groq's LLM API for AI-powered features (like the Mock Interview evaluator).

---

## 3. How Dark/Light Mode Works (Technical Implementation)

In interviews, they often ask how you implemented Dark Mode to test your understanding of the DOM, State, and CSS frameworks.

### The Strategy Used: Tailwind's `class` Strategy
This project is configured to use the manual toggle strategy via `tailwind.config.js`:
```javascript
export default {
  darkMode: 'class', // <--- This enables manual toggling
  // ...
}
```
This means Tailwind will only apply `dark:` utility classes when the `dark` class is present on a parent element (usually the `<html>` root tag).

### The Logic (Inside `Navbar.jsx`)

1. **Checking Initial State (`useEffect`):**
   When the app loads, the `Navbar` component runs a `useEffect` to determine the initial theme.
   - It checks `localStorage` to see if the user previously saved a preference.
   - If nothing is saved, it checks the OS-level system preference using `window.matchMedia('(prefers-color-scheme: dark)').matches`.
   - Based on this, it applies the `dark` class to `document.documentElement` (the `<html>` tag) and sets the React state `isDarkMode`.

2. **Toggling the Theme (`toggleTheme` function):**
   When the user clicks the Sun/Moon icon in the Navbar:
   - **If currently dark:** It removes the `dark` class from `<html>`, saves `'light'` to `localStorage`, and updates the state.
   - **If currently light:** It adds the `dark` class to `<html>`, saves `'dark'` to `localStorage`, and updates the state.

3. **Styling in Components:**
   Throughout the app's components, you write standard Tailwind classes for light mode, and prefix them with `dark:` for dark mode.
   *Example from `App.jsx`:*
   ```jsx
   <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
   ```
   
**Interview Talking Point:** 
> *"Using Tailwind's `dark:` modifier combined with manipulating the root `<html>` class list allows for a highly performant and easily manageable dark mode system without needing heavy CSS-in-JS runtimes or massive stylesheet overrides."*
