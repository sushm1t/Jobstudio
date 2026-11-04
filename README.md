# Job Studio — Autonomous Career Workspace & ATS Optimization

AI-powered career suite connecting to corporate ATS backends, tailoring metric-backed resumes, generating personalized cover letters, and preparing you for interviews with structured STAR guidance.

## Development

```sh
npm install
npm run dev
```

The application runs on `http://localhost:8080`.

## Testing & Build

```sh
npm test       # Run vitest test suite
npm run build  # Compile client & SSR bundles
```

## Tech Stack

- **Framework**: TanStack Start / React 19 / TypeScript
- **Styling**: Tailwind CSS / Lucide React
- **Backend / API**: Nitro / Express handlers / Google Gemini API (`gemini-3.8-flash`)
- **Database & Auth**: Supabase
- **Animation**: GSAP ScrollTrigger & Lenis

