# 🎓 AdmitGenius: The College Admissions Super App

AdmitGenius is an AI-powered full-stack application designed to help high school students navigate the complex college admissions process. It leverages advanced LLMs to provide real-time essay feedback, predictive admission chancing, and personalized extracurricular brainstorming.

## ✨ Features

- **📝 AI Essay Assistant:** Get real-time structural, grammatical, and thematic feedback for Ivy League-level college essays.
- **📊 Real-Time Admission Chancing:** Predictive analytics based on your GPA, SAT/ACT scores, and "X-Factor" extracurriculars.
- **💡 Extracurricular Brainstormer:** Generate unique, personalized project ideas and a 30-day roadmap based on your specific interests.
- **🔍 College Discovery:** Deep-dive analytics into universities, including top majors, acceptance rates, and notable alumni.
- **🔐 Secure Authentication:** Seamless Google Sign-In powered by Clerk.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **AI/LLM:** Groq SDK (LLaMA 3 70B & 8B Models)
- **Authentication:** Clerk Auth
- **PWA:** Vite PWA Plugin (Installable as a native desktop/mobile app)

## 🚀 Running Locally

To run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/AKSHAT9122/admit-genius.git
cd admit-genius
```

### 2. Install Dependencies
This is a unified repository. The root package.json handles both frontend and backend dependencies.
```bash
npm install
```

### 3. Set up Environment Variables
You need to create two `.env` files for the API keys.

**In the root directory (`/`), create a `.env` file:**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**In the `server/` directory, create another `.env` file:**
```env
GROQ_API_KEY_1=your_primary_groq_api_key
GROQ_API_KEY_2=your_fallback_groq_api_key
PORT=3000
```

### 4. Start the Development Servers
You will need two terminals to run the frontend and backend simultaneously during development.

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
node server.js
```

## 🌍 Production Deployment

This app is configured to be deployed on Render.com or similar platforms.
- The `npm run build` command compiles the React frontend into the `dist/` directory.
- The Node.js Express server (`server/server.js`) is configured to serve the `dist/` static files and handle all API requests on a single port.
- Start command for production: `npm start`
