# Deployment Plan — AI-Powered Discovery Engine Dashboard

> This document covers the end-to-end process for deploying the React dashboard to Vercel, including pre-deployment checklist, environment setup, CI/CD pipeline, and post-deployment verification.

---

## Overview

| Property | Value |
|---|---|
| **Platform** | [Vercel](https://vercel.com) |
| **Framework** | Vite + React 19 |
| **Build Tool** | Vite 8 |
| **Root Directory** | `dashboard/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/` |
| **Node Version** | 20.x (LTS) |
| **Deployment Trigger** | Push to `main` branch |

---

## Pre-Deployment Checklist

### 1. Pipeline Output — Data Readiness

Before deploying, ensure all pipeline output JSON files are present in `dashboard/public/data/`:

```
dashboard/public/data/
├── pain_points.json          ✅ required
├── memory_cues.json          ✅ required
├── opportunity_areas.json    ✅ required
├── journey_maps.json         ✅ required
├── segmentation.json         ✅ required
├── google_actions_2026.json  ✅ required
├── references.json           ✅ required
├── frameworks.json           ✅ required
└── interview_guides.json     ✅ required
```

> [!IMPORTANT]
> These JSON files are served as **static assets** — they must be committed to the repo or generated as part of a pre-build step. The dashboard has no backend; all data is fetched client-side from `/data/*.json`.

To copy fresh pipeline output to the dashboard:
```bash
# From repo root
python pipeline/run_pipeline.py --copy-output
# OR manually
cp pipeline/data/output/*.json dashboard/public/data/
```

### 2. Build Verification (Local)

Run the production build locally and verify it passes:

```bash
cd dashboard
npm install
npm run build
npm run preview
```

Check that:
- [ ] Build completes without errors
- [ ] `dist/` directory is generated
- [ ] `npm run preview` serves the app at `http://localhost:4173`
- [ ] All 7 routes load correctly
- [ ] All 9 data files are fetched without 404 errors
- [ ] PDF export works in preview mode
- [ ] CSV export works in preview mode
- [ ] No console errors in the browser

### 3. Linting

```bash
cd dashboard
npm run lint
```

- [ ] Zero lint errors before deploying

### 4. Vercel Configuration

Confirm `dashboard/vercel.json` exists with SPA rewrite rules:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> [!NOTE]
> This is already in place. Without this, direct URL navigation to routes like `/opportunities` or `/frameworks` will return 404 on Vercel.

---

## Vercel Project Setup (First-Time)

### Step 1 — Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
vercel login
```

### Step 2 — Connect GitHub Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Add New Project"**
3. Import the `GooglePhotos-DiscoveryEngine` GitHub repository
4. Configure project settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `dashboard` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x |

5. Click **"Deploy"**

### Step 3 — Verify Environment Variables

This dashboard is a **fully static** app — it has **no server-side secrets**. All data is pre-baked into the JSON files in `public/data/`.

> [!NOTE]
> No environment variables need to be set in Vercel for the dashboard. The Gemini API key, Reddit credentials, etc. are only needed for the **pipeline** (run locally), not the deployed dashboard.

---

## CI/CD Pipeline

### Auto-Deploy on Push

Once the Vercel project is connected to GitHub, every push to `main` triggers a production deployment automatically.

```
git push origin main
    │
    ▼
Vercel detects push
    │
    ▼
Install: npm install (in dashboard/)
    │
    ▼
Build: npm run build
    │
    ▼
Deploy to CDN edge network
    │
    ▼
Production URL updated
```

### Preview Deployments (PRs)

Every pull request automatically gets a **preview deployment URL**, e.g.:
```
https://google-photos-discovery-engine-git-feature-xyz.vercel.app
```

Use this to review dashboard changes before merging to `main`.

### Recommended Branch Strategy

| Branch | Deployment | Purpose |
|---|---|---|
| `main` | Production (`*.vercel.app`) | Stable, client-facing |
| `dev` | Preview URL | Active development |
| `feature/*` | Preview URL | Feature branches |

---

## Deployment Steps (Subsequent Deploys)

### Option A — Automatic (Recommended)

```bash
# 1. Update pipeline data
python pipeline/run_pipeline.py
cp pipeline/data/output/*.json dashboard/public/data/

# 2. Commit & push
git add dashboard/public/data/
git add .
git commit -m "chore: update pipeline output data [YYYY-MM-DD]"
git push origin main

# Vercel auto-deploys on push
```

### Option B — Manual via Vercel CLI

```bash
cd dashboard
npm run build
vercel --prod
```

### Option C — Force Redeploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select the project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment

---

## Domain & URL Configuration

### Default URL

Vercel assigns a permanent URL in the format:
```
https://<project-name>.vercel.app
```

### Custom Domain (Optional)

To attach a custom domain:

1. Go to **Project Settings → Domains** in Vercel
2. Add domain (e.g., `discovery.yourdomain.com`)
3. Update DNS: add a CNAME record pointing to `cname.vercel-dns.com`
4. Vercel auto-provisions SSL/TLS via Let's Encrypt

---

## Post-Deployment Verification

After every deployment, run through this checklist:

### Functional Checks

| Check | URL | Expected |
|---|---|---|
| Default route loads | `/` | Pain Points section renders |
| Opportunities route | `/opportunities` | Cards load with data |
| Frameworks route | `/frameworks` | Charts render (Recharts) |
| References route | `/references` | Table with source data |
| Google Actions route | `/google-actions` | Feature timeline renders |
| Segmentation route | `/segmentation` | US vs India charts |
| Interview Guide route | `/interview-guide` | Accordion questions load |
| 404 fallback | `/invalid-path` | Redirects to `/` |

### Data Checks

- [ ] All 9 JSON files load without 404 in browser DevTools → Network tab
- [ ] Filter dropdowns populate with values
- [ ] Resetting filters restores full dataset

### Export Checks

- [ ] PDF export generates and downloads a valid PDF
- [ ] CSV export downloads with all expected columns

### Performance Checks

```bash
# Run Lighthouse against the deployed URL
npx lighthouse https://<your-vercel-url>.vercel.app --output=json
```

Target scores:

| Metric | Target |
|---|---|
| Performance | ≥ 85 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 85 |

---

## Rollback Procedure

If a deployment introduces a regression:

### Via Vercel Dashboard (Fastest)

1. Go to **Project → Deployments**
2. Find the last known-good deployment
3. Click **⋯ → Promote to Production**

### Via CLI

```bash
vercel rollback [deployment-url]
```

### Via Git Revert

```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the reverted commit
```

---

## Troubleshooting

### Build Fails on Vercel

| Symptom | Likely Cause | Fix |
|---|---|---|
| `npm install` fails | Wrong Node version | Set Node 20.x in Vercel project settings |
| `vite build` errors | Missing dependency | Run `npm install` locally, commit `package-lock.json` |
| `@rolldown/binding` error | Platform mismatch | Ensure `@rolldown/binding-win32-x64-msvc` is in devDependencies (dev only) |
| Build timeout | Large bundle | Check `dist/` size; code-split heavy sections |

### Routes Return 404 in Production

- **Cause:** Missing SPA rewrite in `vercel.json`
- **Fix:** Verify `dashboard/vercel.json` contains the `"rewrites"` rule shown above

### Data Files Return 404

- **Cause:** JSON files not committed to `dashboard/public/data/`
- **Fix:** Ensure `.gitignore` does **not** exclude `dashboard/public/data/*.json`

  ```gitignore
  # ✅ These are excluded (pipeline intermediate data)
  pipeline/data/raw/
  pipeline/data/cleaned/
  pipeline/data/normalized/
  pipeline/data/enriched/

  # ❌ Do NOT exclude — these must be committed
  # dashboard/public/data/
  ```

### Charts Not Rendering

- **Cause:** Recharts version conflict or SSR mismatch
- **Fix:** Recharts is a client-only library; ensure no SSR is being used (Vite/React is CSR by default — this should not be an issue)

### PDF Export Broken in Production

- **Cause:** `html2canvas` cross-origin issues with external resources
- **Fix:** Ensure all images/fonts are served from the same origin or have CORS headers

---

## Monitoring & Maintenance

### Vercel Analytics (Optional)

Enable **Vercel Web Analytics** in the project dashboard for:
- Page views per route
- Core Web Vitals (LCP, CLS, FID)
- Geographic distribution of users

### Data Refresh Cadence

| Frequency | Action |
|---|---|
| Weekly | Re-run pipeline, update `public/data/*.json`, push to `main` |
| After major Google Photos launch | Re-run M1 (collect) + M4 (aggregate), redeploy |
| Ad hoc | Force redeploy from Vercel dashboard |

---

## Quick Reference

```bash
# Local dev
cd dashboard && npm run dev

# Production build test
cd dashboard && npm run build && npm run preview

# Deploy (CLI)
cd dashboard && vercel --prod

# Deploy (auto) — just push to main
git push origin main

# Rollback
vercel rollback

# Check deployment logs
vercel logs [deployment-url]
```

---

*Document Version: 1.0*
*Created: September 23, 2026*
*References: [implementation-plan.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/implementation-plan.md), [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/architecture.md)*
