<div align="center">

# 📊 Karan Pandre | Executive Portfolio & Interactive BI Analytics Suite

**B.Tech Information Technology Graduate • Senior Associate at Physics Wallah • Data Analytics & Business Intelligence Specialist**

[![Live Web Application](https://img.shields.io/badge/🌐_Live_Demo-Applet_Deployment-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ais-pre-xfqmv47wknjdg247newaoi-340336038490.asia-southeast1.run.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🌐 Live Web Application URL

You can access and interact with the live deployed application here:
👉 **[https://ais-pre-xfqmv47wknjdg247newaoi-340336038490.asia-southeast1.run.app](https://ais-pre-xfqmv47wknjdg247newaoi-340336038490.asia-southeast1.run.app)**

> 📌 **How to Export / Sync to your GitHub Repository:**
> 1. Click on the **Settings / Export** menu in the top-right corner of Google AI Studio.
> 2. Select **"Export to GitHub"** or **"Download ZIP"**.
> 3. If exporting to GitHub, connect your GitHub account (`karanpandre`) and push directly to your repository!
> 4. All project files—including this `README.md`—will automatically synchronize with your GitHub account.

---

## 🎯 Executive Overview

This application is a **high-performance, Apple + Material 3 inspired Business Intelligence & Analytics Portfolio Suite** built specifically for **Karan Pandre**. It bridges corporate marketing operations (Physics Wallah), enterprise data engineering (Infosys), and network security/SOC auditing (Cisco).

### ⚡ Core Highlights

- 📈 **Interactive Power BI & SQL Data Sandbox**: Real-time DAX formula simulation, SQL query execution, and campaign attribution modeling.
- 🤖 **Integrated AI Career Assistant**: Built with the **Google Gemini API** to act as a 24/7 AI representative for recruiters.
- 📑 **ATS Resume Keyword Matcher**: Upload or paste job descriptions to evaluate match percentages against Karan's profile.
- 🎓 **Cryptographically Verified Credentials Gallery**: 14 industry certifications from Google, IBM, Cisco, University of Washington, and Infosys Springboard with live seal inspection.
- 💼 **Interactive Career & Academic Timeline**: Detailed accomplishments, impact metrics, and course histories for B.Tech IT & Physics Wallah experience.

---

## 🏗️ Application Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT (React 18)                          │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │   Hero & Executive    │  │ Power BI & SQL Data   │  │ Core Competency │ │
│  │   Metrics Overview    │  │   Analytics Sandbox   │  │ Track Selection │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘ │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │ Verified Credentials  │  │   Gemini AI Career    │  │  ATS Keyword    │ │
│  │     14 Badges & Seals │  │   Recruiter Chatbot   │  │   Match Engine  │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ Proxy Requests (/api/ai/chat)
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         EXPRESS.JS BACKEND SERVER                           │
│                                                                             │
│  • Vite Development Middleware / Static Production Bundler                  │
│  • Google Gemini 2.5 AI SDK Agent Handler                                   │
│  • Secure Server-Side Key Management (GEMINI_API_KEY)                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack & Libraries

| Category | Technology / Package | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 5, TypeScript | Reactive SPA Architecture & Type Safety |
| **Styling** | Tailwind CSS 3.4, Lucide Icons | Responsive Glassmorphism & UI Design |
| **Animations** | Motion (`motion/react`) | Apple-style Micro-interactions & Page Motion |
| **Data Visualization** | Recharts, Custom Canvas Modules | Interactive Sales Funnels, ROI & SOC Charts |
| **AI Integration** | `@google/genai` (Gemini API) | Server-Side Recruiter Q&A & Profile Reasoning |
| **Backend** | Express.js, Node.js | API Gateway & Secure Key Proxying |

---

## 🚀 Local Development Guide

### Prerequisites
- **Node.js**: v18.0.0+
- **npm**: v9.0.0+

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/karanpandre/karan-pandre-portfolio.git
   cd karan-pandre-portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📂 Repository Directory Tree

```text
.
├── public/                 # Static assets (Resume PDF, profile images, favicon)
├── src/
│   ├── components/        # Modular UI Components
│   │   ├── AICareerAssistant.tsx     # Gemini AI chat interface
│   │   ├── ATSResumeOptimizer.tsx    # ATS keyword scanner
│   │   ├── CertificationsGrid.tsx    # Certified credentials grid & modal
│   │   ├── ContactSection.tsx        # Contact form & social channels
│   │   ├── CoreCompetencies.tsx      # Analytics & PM track selector
│   │   ├── ExperienceTimeline.tsx    # Work experience & education
│   │   ├── Hero.tsx                  # Profile header & KPI badges
│   │   ├── InteractiveDashboards.tsx # Power BI & SQL interactive sandbox
│   │   ├── MouseSpotlight.tsx        # Dynamic cursor lighting effect
│   │   ├── Navbar.tsx                # Glassmorphic header & profile menu
│   │   ├── ProjectsSection.tsx       # Production project showcases
│   │   ├── ResumeViewerModal.tsx     # PDF viewer modal
│   │   └── SearchModal.tsx           # Global keyboard shortcut search
│   ├── data/
│   │   └── karanData.ts              # Single source of truth for portfolio data
│   ├── types.ts                      # Shared TypeScript interface definitions
│   ├── App.tsx                       # Root application container
│   └── main.tsx                      # Vite React entrypoint
├── server.ts               # Express backend & Gemini API proxy
├── .env.example            # Environment variables blueprint
├── package.json            # Project dependencies & npm scripts
└── README.md               # GitHub repository documentation
```

---

## 👤 Author Contact & Profile

- **Name**: Karan U. Pandre
- **Role**: Senior Associate (Physics Wallah) | B.Tech Information Technology Graduate
- **Email**: [karanpandre3@gmail.com](mailto:karanpandre3@gmail.com)
- **LinkedIn**: [linkedin.com/in/karanpandre](https://linkedin.com/in/karanpandre)
- **GitHub**: [github.com/karanpandre](https://github.com/karanpandre)

---

<div align="center">
  <sub>Built with ❤️ for Karan Pandre • Powered by Google AI Studio</sub>
</div>

