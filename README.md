# JobStudio

> Autonomous Job Opportunity Evaluator, Tailored ATS Resume Generator, and Instant PDF Exporter powered by Google Gemini.

JobStudio evaluates candidate profiles against live job descriptions, scores qualification matches, auto-tailors ATS-optimized resumes with 1-page fit constraints, crafts targeted cover letters, and generates 1-click ATS screening form answers.

---

## Features

- **Match Intelligence & Evaluator:** Evaluates job descriptions against a verified candidate master profile, identifying matching strengths, qualification gaps, and tailored action recommendations.
- **ATS Resume Studio:** Single-column ATS typography with 1-page fit algorithms, adjustable layout density, bullet-point editing, and ISO 32000-1 compliant clickable PDF export.
- **Executive Cover Letter Generator:** 3-paragraph tailored cover letters formatted for instant clipboard copying or `.txt` download.
- **ATS Screening Q&A Assistant:** 1-click copy-paste answers tailored to common ATS application portal questions.
- **Live Listing Verification:** Validates and parses live job postings from Oracle HCM, UltiPro, Greenhouse, Lever, Ashby, and LinkedIn.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend:** Express, Node.js (`tsx`)
- **AI / LLM:** Google Gemini API (`@google/genai` with `gemini-3.8-flash`)
- **Export Engine:** `jsPDF`, `html-to-image`

---

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm or bun

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure your Gemini API key:
```bash
cp .env.example .env
```
Add your API key inside `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

- `npm run dev` - Start the full-stack development server with Vite middleware on port 3000
- `npm run build` - Build production assets
- `npm run lint` - Run TypeScript compiler checks (`tsc --noEmit`)
- `npm start` - Run the production server
