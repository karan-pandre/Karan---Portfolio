<div align="center">

# Karan Pandre Portfolio

### Interactive Data Analytics & Cybersecurity Portfolio (React + Vite + Express)

A polished, recruiter-focused portfolio experience with interactive analytics modules, a private cybersecurity dashboard, CMS-driven content updates, and optional Gemini-powered assistant endpoints.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Highlights](#highlights)
- [Demo & Visuals](#demo--visuals)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Usage Notes](#usage-notes)
- [Deployment](#deployment)
- [Accessibility & Responsive Design](#accessibility--responsive-design)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## Overview

This repository powers Karan Pandre’s portfolio application. It combines:

- a modern React frontend,
- an Express backend with multiple `/api/*` endpoints,
- editable portfolio data persistence via `cms_data.json`,
- interactive modules for analytics, ATS matching, and cybersecurity simulation.

> Built for educational and portfolio presentation use.

---

## Highlights

| Area | What’s implemented (verified in code) |
|---|---|
| Portfolio UI | Hero, role filter, competency sections, projects, certifications, contact, footer |
| Recruiter tools | ATS resume optimizer, recruiter quick brief modal, interview booking modal |
| AI integration | Gemini client initialization when `GEMINI_API_KEY` is configured |
| CMS workflow | View/edit portfolio data and persist updates through `/api/portfolio-data` |
| Cybersecurity mode | Dedicated auth + private dashboard routes (`#secure-login`, `#cybersecurity-dashboard`) |
| Backend APIs | Health, contact, SQL simulator, ATS match, chat, Wazuh connectors, detection-rule endpoints |

---

## Demo & Visuals

- **Configured public URL in metadata/SEO:** https://karanpandre.dev/
- **Profile image asset:**

<p align="center">
  <img src="public/karan_profile.jpg" alt="Karan Pandre profile" width="220" />
</p>

> `index.html` references `/assets/og-preview.png`, but that image is not present in this repository.

---

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Motion, Recharts, D3

### Backend
- Node.js + Express
- Vite middleware in development
- Static `dist/` serving in production

### Integrations
- Google Gemini SDK (`@google/genai`)
- Firebase (Auth + Firestore initialization)

---

## Architecture

```text
Client (React + Vite)
  ├─ Portfolio sections & recruiter modules
  ├─ CMS admin panel + preview flows
  └─ Private cybersecurity routes/dashboard
          │
          ▼
Server (Express)
  ├─ /api/portfolio-data (read/write CMS store)
  ├─ /api/chat, /api/ats-match, /api/sql-simulator
  ├─ /api/connectors/wazuh/*
  └─ /api/detection-rules/*
          │
          ▼
Persistence
  └─ cms_data.json (+ static/public asset updates for avatar)
```

---

## Project Structure

```text
.
├── src/
│   ├── components/                 # Portfolio + cybersecurity UI modules
│   ├── data/                       # Portfolio and cybersecurity data sources
│   ├── utils/                      # Utility helpers (e.g., sound effects)
│   ├── App.tsx                     # Main app composition + route/hash handling
│   ├── main.tsx                    # React entrypoint
│   └── firebase.ts                 # Firebase app/auth/firestore initialization
├── public/
│   ├── karan_profile.jpg
│   └── Karan_Pandre_Resume.pdf
├── server.ts                       # Express API + dev/prod serving logic
├── cms_data.json                   # Persistent CMS data store
├── .env.example                    # Environment variable template
├── vercel.json                     # Vercel build/output + SPA rewrite
└── README.md
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env` and set values as needed:

```bash
cp .env.example .env
```

### 3) Start development server

```bash
npm run dev
```

App runs on `http://localhost:3000` via `tsx server.ts`.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Runs the Express + Vite development server |
| `npm run build` | Builds frontend with Vite and bundles `server.ts` to `dist/server.cjs` |
| `npm run start` | Starts production server from `dist/server.cjs` |
| `npm run lint` | Type-checks with `tsc --noEmit` |
| `npm run clean` | Removes build artifacts (`dist`, `server.cjs`) |

---

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Enables Gemini-backed API behavior when valid key is provided |
| `APP_URL` | Optional | Present in `.env.example`; useful for hosted app URL context |
| `NODE_ENV` | Runtime | Used to switch dev middleware vs production static serving |
| `DISABLE_HMR` | Optional | Controls Vite HMR/watch behavior in `vite.config.ts` |

---

## Usage Notes

- Main portfolio is available at the root route.
- Keyboard shortcut support includes:
  - `Ctrl/Cmd + K` → toggle search modal
  - `Ctrl/Cmd + Shift + S` → jump to cybersecurity dashboard route
- CMS updates are served through backend API endpoints and persisted to `cms_data.json`.

---

## Deployment

This repository includes `vercel.json` configured for Vite:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA rewrite from `/(.*)` to `/index.html`

General production flow:

```bash
npm run build
npm run start
```

---

## Accessibility & Responsive Design

Implemented signals in code include:

- responsive viewport meta configuration,
- dark/light theme support,
- keyboard-driven shortcuts,
- smooth scrolling and adaptive UI sections.

---

## Contributing

Contributions are welcome for portfolio polish, bug fixes, and UX improvements.

1. Fork the repository
2. Create a feature branch
3. Commit focused changes
4. Open a pull request with clear context

---

## Contact

- **Name:** Karan Pandre
- **Email:** [karanpandre3@gmail.com](mailto:karanpandre3@gmail.com)
- **LinkedIn:** [linkedin.com/in/karanpandre3](https://linkedin.com/in/karanpandre3)
- **GitHub:** [github.com/karanpandre3](https://github.com/karanpandre3)

---

## License

No repository-wide license file is currently present.
