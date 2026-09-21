# Implementation Plan — AI-Powered Discovery Engine

> This plan is organized into **milestones** that deliver incremental value. Each milestone has a clear deliverable that can be tested independently.

---

## Milestone Overview

| # | Milestone | Deliverable | Est. Effort |
|---|---|---|---|
| M0 | Project Scaffolding | Repo structure, configs, mock data, dev environment | 1 day |
| M1 | Data Collection (P0 Sources) | Reddit + Play Store raw data in JSON | 1–2 days |
| M2 | Data Cleaning & Normalization | Cleaned, deduplicated, unified-schema dataset | 1 day |
| M3 | AI Enrichment (Gemini) | Classified, tagged, scored dataset | 1–2 days |
| M4 | Aggregation & Insight Generation | 9 output JSON files ready for dashboard | 1 day |
| M5 | Dashboard Shell & Layout | Vite + React + Tailwind + Router + Sidebar + Filters | 1–2 days |
| M6 | Dashboard Sections (Core) | Pain Points, Opportunities, Frameworks sections | 2–3 days |
| M7 | Dashboard Sections (Remaining) | References, Google Actions, Segmentation, Interview Guides | 2–3 days |
| M8 | Export & Polish | PDF/CSV export, visual polish, responsive design | 1–2 days |
| M9 | Vercel Deployment | Live dashboard on Vercel | 0.5 day |
| M10 | P1 Data Sources (Optional) | App Store + Google Community collectors | 1–2 days |

**Total estimated effort: 10–17 days**

---

## M0: Project Scaffolding

**Goal:** Set up the complete project structure, dev environment, and mock data so both pipeline and dashboard can be worked on immediately.

### Tasks

#### 0.1 — Pipeline Setup
- [ ] Create `pipeline/` directory structure per architecture
  ```
  pipeline/
  ├── collectors/
  ├── processing/
  ├── analysis/
  ├── data/raw/
  ├── data/cleaned/
  ├── data/normalized/
  ├── data/enriched/
  ├── data/output/
  ├── config.py
  ├── run_pipeline.py
  └── requirements.txt
  ```
- [ ] Create `requirements.txt` with initial dependencies:
  ```
  praw>=7.7
  google-play-scraper>=1.2
  beautifulsoup4>=4.12
  requests>=2.31
  langdetect>=1.0
  google-generativeai>=0.8
  python-dotenv>=1.0
  ```
- [ ] Create `config.py` with:
  - Date range constants (`DATE_FROM = "2026-01-01"`, `DATE_TO = "2026-09-21"`)
  - Source configuration (subreddits, app IDs, etc.)
  - Gemini API settings (batch size, model name, confidence threshold)
  - File path constants for data directories
- [ ] Create `.env.example` with required environment variables:
  ```
  GEMINI_API_KEY=your_key_here
  REDDIT_CLIENT_ID=your_id
  REDDIT_CLIENT_SECRET=your_secret
  REDDIT_USER_AGENT=DiscoveryEngine/1.0
  ```
- [ ] Create `run_pipeline.py` skeleton with step-by-step execution flow

#### 0.2 — Dashboard Setup
- [ ] Initialize Vite + React project in `dashboard/` directory
  ```bash
  cd dashboard
  npx -y create-vite@latest ./ --template react
  ```
- [ ] Install dependencies:
  ```bash
  npm install react-router-dom recharts jspdf html2canvas
  npm install -D tailwindcss @tailwindcss/vite
  ```
- [ ] Configure Tailwind CSS (import in `index.css`)
- [ ] Configure Vite (tailwind plugin)
- [ ] Create `vercel.json` with SPA rewrite rules
- [ ] Create `dashboard/public/data/` directory

#### 0.3 — Mock Data
- [ ] Create mock JSON files for all 9 output schemas in `dashboard/public/data/`:
  - `pain_points.json` — 5 mock pain points with realistic data
  - `memory_cues.json` — distribution with sample counts
  - `opportunity_areas.json` — 3 mock opportunities
  - `journey_maps.json` — stage distribution data
  - `segmentation.json` — US vs India breakdown
  - `google_actions_2026.json` — 3 mock feature launches
  - `references.json` — 10 mock source references
  - `frameworks.json` — all 6 framework aggregations
  - `interview_guides.json` — 2 mock interview guides
- [ ] Verify dashboard loads and renders mock data

#### 0.4 — Git & Environment
- [ ] Update `.gitignore`:
  ```
  # Pipeline data (except output)
  pipeline/data/raw/
  pipeline/data/cleaned/
  pipeline/data/normalized/
  pipeline/data/enriched/
  
  # Environment
  .env
  
  # Node
  node_modules/
  dist/
  ```
- [ ] Verify both pipeline and dashboard can start independently

**Deliverable:** Both `python run_pipeline.py` and `npm run dev` run without errors. Dashboard shows mock data.

---

## M1: Data Collection (P0 Sources)

**Goal:** Collect raw user feedback from Reddit and Google Play Store, stored as JSON.

### Tasks

#### 1.1 — Base Collector
- [ ] Implement `base_collector.py`:
  - Abstract `collect()` method
  - `save()` method — writes JSON to `data/raw/{source_name}.json`
  - Logging (entry count, errors, duration)
  - Date filtering support

#### 1.2 — Reddit Collector
- [ ] Implement `reddit.py` using PRAW:
  - Target subreddits: `r/googlephotos`, `r/google`, `r/Android`, `r/ios`, `r/photography`
  - Collect: posts + top-level comments from 2026
  - Search queries: `"google photos" + (find OR search OR remember OR lost OR missing OR album OR memory OR photo)`
  - Store per entry: `id`, `subreddit`, `title`, `body`, `score`, `num_comments`, `created_utc`, `url`, `author`
  - Rate limiting: respect PRAW's built-in rate limits
  - Handle pagination (PRAW's `ListingGenerator`)
- [ ] Test with a small subreddit first, verify output format
- [ ] Full collection run — target: 500–2,000 entries

#### 1.3 — Play Store Collector
- [ ] Implement `play_store.py` using `google-play-scraper`:
  - App ID: `com.google.android.apps.photos`
  - Collect reviews: sort by newest, filter 2026 only
  - Filter by country: US, India
  - Store per entry: `reviewId`, `content`, `score`, `at` (date), `thumbsUpCount`, `reviewCreatedVersion`
  - Pagination: collect in batches of 200
- [ ] Test collection, verify date filtering works
- [ ] Full collection run — target: 1,000–3,000 entries

#### 1.4 — Google Photos 2026 Actions Collector
- [ ] Create a lightweight web research script that:
  - Searches for "Google Photos 2026 update/feature/launch/announcement"
  - Scrapes key tech blogs (9to5Google, The Verge, Android Authority, Google Blog)
  - Outputs: `google_actions_raw.json` with title, date, description, source URL
  - This feeds into `google_actions_2026.json` in the output

#### 1.5 — Pipeline Integration
- [ ] Update `run_pipeline.py` Step 1 to run all collectors
- [ ] Add CLI flags: `--source reddit`, `--source play_store`, `--source all`
- [ ] Add logging: total entries per source, date range coverage

**Deliverable:** `pipeline/data/raw/` contains `reddit.json`, `play_store.json`, `google_actions_raw.json` with real 2026 data.

---

## M2: Data Cleaning & Normalization

**Goal:** Clean, deduplicate, and normalize all raw data into a unified schema.

### Tasks

#### 2.1 — Cleaner
- [ ] Implement `cleaner.py` with the following pipeline:
  ```
  load_raw() → deduplicate() → filter_spam() → filter_language() → filter_relevance() → scrub_pii() → save_cleaned()
  ```
- [ ] **Deduplication**:
  - Exact text match (hash-based, O(n))
  - Fuzzy matching using `difflib.SequenceMatcher` (threshold ≥ 0.85)
  - Log duplicate count
- [ ] **Spam filter**:
  - Remove entries with <10 words
  - Keyword blocklist: "download now", "use code", "promo", "earn money", etc.
  - Remove entries that are just star ratings with no text
- [ ] **Language filter**:
  - Use `langdetect` — keep only `en` (English)
  - Log filtered-out count by detected language
- [ ] **Relevance filter**:
  - Keyword allowlist (must contain at least one): `photo`, `picture`, `image`, `search`, `find`, `remember`, `forgot`, `album`, `memory`, `lost`, `missing`, `locate`, `browse`, `scroll`, `look for`, `can't find`
  - Log filtered-out count
- [ ] **PII scrub**:
  - Regex: email addresses, phone numbers, @-mentions
  - Replace with `[REDACTED]`
- [ ] Output: `data/cleaned/all_cleaned.json`

#### 2.2 — Normalizer
- [ ] Implement `normalizer.py`:
  - Map Reddit raw schema → unified schema
  - Map Play Store raw schema → unified schema
  - Map Google Actions raw schema → unified schema
- [ ] **Date normalization**: All dates to ISO 8601 (`YYYY-MM-DD`)
- [ ] **Geography inference**:
  - Play Store: use country parameter from scraper
  - Reddit: keyword scan for Indian cities/states, US states, currency (₹, $), cultural references
  - Default: `"Unknown"`
- [ ] **Platform inference**:
  - Play Store → `"android"`
  - Reddit: scan for "iPhone/iOS" → `"ios"`, "Android" → `"android"`, default `"unknown"`
- [ ] **ID generation**: `{source}_{original_id}` (e.g., `reddit_abc123`, `play_store_gp_456`)
- [ ] Output: `data/normalized/all_normalized.json`

#### 2.3 — Quality Report
- [ ] Generate a cleaning summary:
  ```
  Raw entries:           3,450
  After dedup:           3,120 (removed 330)
  After spam filter:     2,890 (removed 230)
  After language filter: 2,650 (removed 240)
  After relevance:       1,980 (removed 670)
  After PII scrub:       1,980 (redacted 45 entries)
  
  By source: Reddit 820, Play Store 1,160
  By geography: US 680, India 520, Unknown 780
  ```
- [ ] Print summary to console and save as `data/cleaned/cleaning_report.json`

**Deliverable:** `data/normalized/all_normalized.json` — a clean, deduplicated, unified-schema dataset ready for AI enrichment.

---

## M3: AI Enrichment (Gemini)

**Goal:** Classify every entry using Gemini API — memory vs. search, pain point clustering, memory cue tagging, severity scoring.

### Tasks

#### 3.1 — Enricher Setup
- [ ] Implement `enricher.py` with `GeminiEnricher` class:
  - `__init__`: configure Gemini API with key from `.env`
  - Model: `gemini-2.0-flash`
  - Structured JSON output mode
  - Retry logic: 3 retries with exponential backoff (2s, 4s, 8s)
  - Rate limiting: respect Gemini free tier limits (15 RPM / 1M TPM)

#### 3.2 — Classification Prompt
- [ ] Design and test the classification prompt (per architecture Section 3.4):
  - `problem_type`: memory | search | other | not_a_problem
  - `pain_point_cluster`: predefined cluster labels
  - `memory_cues`: array of cue types
  - `severity`: critical | high | medium | low
  - `journey_stage`: trigger | search_attempt | failure | workaround | outcome
  - `user_segment`: casual | power_user | family | professional
  - `confidence`: 0.0–1.0
- [ ] Define pain point cluster labels (initial set, refined after first run):
  ```
  - event_photo_retrieval: Finding photos from specific life events
  - temporal_recall: Finding photos from a vague time period
  - person_based_retrieval: Finding photos of/with specific people
  - location_based_recall: Finding photos from a remembered place
  - object_document_retrieval: Finding photos of specific objects/documents
  - shared_received_content: Finding photos someone shared with you
  - screenshot_retrieval: Finding specific screenshots
  - emotional_moment_recall: Finding photos tied to an emotion/feeling
  - activity_based_retrieval: Finding photos from a specific activity
  - visual_attribute_recall: Finding a photo by how it looked
  ```
- [ ] Test prompt with 10 hand-picked entries, verify output quality

#### 3.3 — Batch Processing
- [ ] Implement batching logic:
  - Batch size: 15 entries per API call
  - Process all normalized entries
  - Merge Gemini output with original entry data
  - Save after each batch (checkpoint/resume capability)
- [ ] Handle edge cases:
  - Gemini returns fewer results than input → retry that batch
  - Confidence < 0.5 → flag entry for manual review
  - JSON parse error → retry with smaller batch
- [ ] Token usage tracking: log tokens used per batch, estimate total cost
- [ ] Output: `data/enriched/all_enriched.json`

#### 3.4 — Enrichment Quality Check
- [ ] Print classification distribution:
  ```
  problem_type: memory 45%, search 25%, other 20%, not_a_problem 10%
  avg confidence: 0.82
  low confidence entries (<0.5): 34
  ```
- [ ] Spot-check: manually review 30 random entries for classification accuracy
- [ ] Save quality report: `data/enriched/enrichment_report.json`

**Deliverable:** `data/enriched/all_enriched.json` — every entry classified with problem type, pain points, memory cues, severity, and more.

---

## M4: Aggregation & Insight Generation

**Goal:** Compute all framework metrics, cluster pain points, rank opportunities, and generate interview guides. Produce the 9 output JSON files.

### Tasks

#### 4.1 — Pain Point Aggregation
- [ ] Cluster entries by `pain_point_cluster`
- [ ] For each cluster, compute:
  - `frequency`: count of entries
  - `severity`: weighted average severity score
  - `memory_cues_involved`: union of all memory cues in the cluster
  - `affected_segments`: union of all user segments
  - `affected_geographies`: union of all geographies
  - `quotes`: top 5 most representative quotes (highest confidence + engagement)
  - `journey_stage_distribution`: counts per stage
- [ ] Rank by composite score: `frequency × severity_weight`
- [ ] Output: `data/output/pain_points.json`

#### 4.2 — Memory Cue Analysis
- [ ] Compute memory cue distribution (count per cue type across all memory entries)
- [ ] For each cue type: top 3 example quotes
- [ ] Cross-tabulate: cue type × severity
- [ ] Output: `data/output/memory_cues.json`

#### 4.3 — Opportunity Areas
- [ ] Generate opportunities by combining related pain point clusters
- [ ] Use a final Gemini call: send top 10 pain points with evidence → ask for opportunity synthesis
  - Problem statement per opportunity
  - Supporting pain points
  - Impact score (1–10)
  - Suggested direction
  - Mark highest-impact as `is_primary_recommendation: true`
- [ ] Output: `data/output/opportunity_areas.json`

#### 4.4 — Framework Computations
- [ ] **Severity matrix**: count of pain points per severity level
- [ ] **Frequency of mention**: source-weighted frequency per pain point
- [ ] **Retrieval outcomes**: count entries by success/partial/failure/abandonment
- [ ] **Memory cue distribution**: counts (already computed in 4.2, reformat for charts)
- [ ] **Gap analysis**: for each memory cue type, rate Google Photos' current support level (via Gemini call)
- [ ] **Journey stage distribution**: count entries per stage
- [ ] Output: `data/output/frameworks.json`

#### 4.5 — Journey Maps
- [ ] Extract journey data from enriched entries
- [ ] Group by pain point: what's the typical flow for each problem?
- [ ] Output: `data/output/journey_maps.json`

#### 4.6 — Segmentation Data
- [ ] Geographic breakdown: US vs India vs Unknown for each pain point
- [ ] Behavioral breakdown: casual vs power_user vs family vs professional
- [ ] Cross-tabulate: geography × pain point cluster
- [ ] Output: `data/output/segmentation.json`

#### 4.7 — Google Photos 2026 Actions
- [ ] Process the Google Actions raw data (from M1.4)
- [ ] Use Gemini to map each Google action to pain point clusters it might address
- [ ] Flag which pain points remain unaddressed
- [ ] Output: `data/output/google_actions_2026.json`

#### 4.8 — References
- [ ] Compile all source URLs grouped by pain point cluster
- [ ] Include: source URL, date, quote excerpt, source type, pain point ID
- [ ] Output: `data/output/references.json`

#### 4.9 — Interview Guide Generation
- [ ] Gemini call with top pain points + opportunity areas
- [ ] Prompt: generate per pain point:
  - 5–7 open-ended questions
  - 2–3 probes/follow-ups per question
  - 2–3 scenario-based prompts per opportunity area
- [ ] Output: `data/output/interview_guides.json`

#### 4.10 — Pipeline Completion
- [ ] Update `run_pipeline.py` to run Steps 1–5 end-to-end
- [ ] Add a `--step` flag to run individual steps (e.g., `--step enrich`)
- [ ] Print final summary:
  ```
  Pipeline complete!
  Sources: 2 | Raw entries: 3,450 | After cleaning: 1,980
  Memory problems: 890 | Pain point clusters: 10
  Opportunities: 5 | Output files: 9
  ```
- [ ] Copy output to `dashboard/public/data/`

**Deliverable:** All 9 output JSON files in `data/output/`, ready for the dashboard.

---

## M5: Dashboard Shell & Layout

**Goal:** Build the dashboard skeleton — layout, routing, sidebar, filter bar, data loading. No section content yet.

### Tasks

#### 5.1 — Layout & Navigation
- [ ] Implement `Layout.jsx`: sidebar + main content area
- [ ] Implement `Sidebar.jsx`:
  - Links to all 7 routes with icons
  - Active route highlighting
  - Collapsible on mobile
- [ ] Implement `Navbar.jsx`:
  - "Discovery Engine" title/logo
  - Export Dashboard button
  - Responsive design

#### 5.2 — Routing
- [ ] Set up React Router in `App.jsx`:
  ```
  /                → PainPointsSection (default)
  /references      → ReferencesSection
  /google-actions  → GoogleActionsSection
  /segmentation    → SegmentationSection
  /opportunities   → OpportunitySection
  /frameworks      → FrameworksSection
  /interview-guide → InterviewGuideSection
  ```
- [ ] All routes share the same `Layout` wrapper
- [ ] 404 fallback → redirect to `/`

#### 5.3 — Data Loading
- [ ] Implement `useData.js` hook:
  - Fetch all 9 JSON files from `/data/` on mount
  - Loading state + error state
  - Cache data in state (no re-fetching)
- [ ] Wrap app in a `DataProvider` context
- [ ] Show loading spinner while data loads
- [ ] Show error state if JSON files are missing

#### 5.4 — Filter System
- [ ] Implement `useFilters.js` hook:
  - Filter state: `{ geography, severity, source, userSegment, memoryCue }`
  - `setFilter(key, value)` and `resetFilters()` functions
- [ ] Wrap app in `FilterProvider` context
- [ ] Implement `FilterBar.jsx`:
  - Dropdown for each filter dimension
  - "Reset filters" button
  - Active filter count badge
  - Sticky/fixed position at top of content area

#### 5.5 — Shared Components
- [ ] `ChartCard.jsx` — container with title, subtitle, and chart slot
- [ ] `DataTable.jsx` — sortable, filterable table (basic implementation)
- [ ] `QuoteCard.jsx` — user quote with source badge, date, and link
- [ ] Loading/empty state components

#### 5.6 — Design System
- [ ] Configure Tailwind with custom theme:
  - Color palette: dark mode base with accent colors for severity levels
  - Typography: Inter or similar modern font (Google Fonts)
  - Spacing, border-radius, shadow tokens
- [ ] Placeholder section components that show section title + "Coming soon"

**Deliverable:** Dashboard runs with sidebar navigation, routing, filters, and placeholder sections. Loads and caches mock/real JSON data.

---

## M6: Dashboard Sections (Core)

**Goal:** Build the three highest-value sections: Pain Points, Opportunity Areas, Analytical Frameworks.

### Tasks

#### 6.1 — Pain Points Section (`/`)
- [ ] Severity-ranked list of pain point cards
- [ ] Each card shows:
  - Pain point title + severity badge (color-coded)
  - Frequency count
  - Memory cues involved (tag chips)
  - Affected geographies + segments
  - Top 2–3 user quotes (QuoteCard)
  - Whether addressed by Google or not (badge)
- [ ] Responds to global filters (geography, severity, source, segment, cue)
- [ ] Sort options: by severity, by frequency, by recency

#### 6.2 — Opportunity Areas Section (`/opportunities`)
- [ ] Prioritized opportunity cards
- [ ] Each card shows:
  - Opportunity title + impact score
  - Problem statement
  - Supporting pain point count + links
  - Affected geographies + segments
  - Suggested direction
  - Primary recommendation highlight (special styling)
- [ ] Bar chart: impact score comparison across opportunities (Recharts)

#### 6.3 — Analytical Frameworks Section (`/frameworks`)
- [ ] **Severity heatmap**: pain points × severity level (Recharts bar/heatmap)
- [ ] **Memory cue distribution**: pie chart or bar chart of cue type frequency
- [ ] **Retrieval outcomes funnel**: success → partial → failure → abandonment
- [ ] **Gap analysis matrix**: table with cue type, user frequency, Google support level, gap level
- [ ] **Journey stage distribution**: bar chart of entries per stage
- [ ] **Frequency of mention**: bar chart per pain point cluster
- [ ] Each chart in a `ChartCard` container with title and description

**Deliverable:** Three core sections fully functional with real data, filters, and charts.

---

## M7: Dashboard Sections (Remaining)

**Goal:** Build the remaining four sections.

### Tasks

#### 7.1 — References Section (`/references`)
- [ ] Filterable table (DataTable) with columns:
  - Source type (badge: Reddit, Play Store, etc.)
  - Date
  - Quote excerpt (truncated, expandable)
  - Pain point it maps to (link)
  - Source URL (external link icon)
- [ ] Sort by date, source, pain point
- [ ] Filter by source type

#### 7.2 — Google Actions 2026 Section (`/google-actions`)
- [ ] List of Google Photos features/updates launched in 2026
- [ ] Each item shows:
  - Feature title + launch date
  - Description
  - Source link
  - Which pain points it addresses (tags, linked to pain points)
  - Which pain points it does NOT address (gap indicator)
- [ ] Summary stat: X of Y pain points addressed / Z remaining

#### 7.3 — Segmentation Section (`/segmentation`)
- [ ] **Geographic comparison**:
  - Side-by-side bar charts: US vs India pain point distribution
  - Notable differences highlighted
- [ ] **Behavioral segments**:
  - Bar chart: pain point distribution by user segment
  - Segment profiles: what each segment struggles with most
- [ ] Responds to global filters

#### 7.4 — Interview Guide Section (`/interview-guide`)
- [ ] Accordion/expandable cards per pain point
- [ ] Each card contains:
  - Pain point title + context summary
  - Open-ended questions (numbered list)
  - Probes/follow-ups (indented under each question)
  - Scenario-based prompts (highlighted box)
- [ ] Separate section for opportunity-based scenarios

**Deliverable:** All 7 dashboard sections fully functional.

---

## M8: Export & Polish

**Goal:** Implement full dashboard export and polish the UI.

### Tasks

#### 8.1 — PDF Export
- [ ] Implement `exportPdf.js`:
  - Capture each section using `html2canvas`
  - Compile into multi-page PDF using `jsPDF`
  - Add header: "Discovery Engine — Google Photos Memory Retrieval Analysis"
  - Add footer: page numbers, generation date
  - Add table of contents
- [ ] Export button in Navbar triggers PDF generation
- [ ] Loading indicator during export

#### 8.2 — CSV Export
- [ ] Implement `exportCsv.js`:
  - Flatten all JSON data into tabular rows
  - Separate CSV files per section (zipped together)
  - Or single CSV with section column
- [ ] Export button dropdown: "Export PDF" / "Export CSV"

#### 8.3 — Visual Polish
- [ ] Dark mode theme (primary) with professional color palette
- [ ] Smooth page transitions between routes
- [ ] Hover effects on cards and interactive elements
- [ ] Empty states for filtered-out views
- [ ] Responsive design: works on desktop and tablet
- [ ] Loading skeleton animations

#### 8.4 — UX Refinements
- [ ] Persistent filter state across route changes
- [ ] URL query params for filters (shareable filtered views)
- [ ] Scroll to top on route change
- [ ] Keyboard navigation support
- [ ] Dashboard summary stats at the top of Pain Points (default) page:
  - Total entries analyzed
  - Memory problems found
  - Pain point clusters
  - Top opportunity area

**Deliverable:** Polished, export-ready dashboard.

---

## M9: Vercel Deployment

**Goal:** Deploy the dashboard to Vercel.

### Tasks

- [ ] Ensure `vercel.json` is correct (SPA rewrites)
- [ ] Ensure `dashboard/public/data/` contains latest pipeline output
- [ ] Connect GitHub repo to Vercel
- [ ] Set root directory to `dashboard/`
- [ ] Test deployment: verify all routes, data loading, export
- [ ] Share URL with team

**Deliverable:** Live dashboard at `*.vercel.app`.

---

## M10: P1 Data Sources (Optional)

**Goal:** Add App Store and Google Photos Help Community collectors for broader coverage.

### Tasks

- [ ] Implement `app_store.py` collector (app-store-scraper)
- [ ] Implement `google_community.py` collector (BeautifulSoup)
- [ ] Add new sources to cleaner/normalizer (schema mapping)
- [ ] Re-run full pipeline with expanded dataset
- [ ] Verify dashboard reflects new data
- [ ] Update data coverage stats

**Deliverable:** Dataset expanded to 4 sources, dashboard updated.

---

## Execution Order & Dependencies

```
M0 ─────────────────────┐
                        │
M1 (collect) ──────────►│
                        │
M2 (clean) ◄────────────┘
  │
M3 (enrich) ◄───────────┘
  │
M4 (aggregate) ◄────────┘
  │
  │    M5 (dashboard shell) ◄──── can start in parallel with M1-M4
  │      │                         using mock data
  │    M6 (core sections)
  │      │
  │    M7 (remaining sections)
  │      │
  ├────► M8 (export & polish) ◄─── needs real data from M4
  │      │
  └────► M9 (deploy) ◄──────────── needs both M4 + M8
           │
         M10 (optional P1 sources)
```

> [!TIP]
> **Parallel work opportunity:** M5 (dashboard shell) can start **immediately** using mock data from M0, while M1–M4 (pipeline) are being built. Swap in real data when M4 completes.

---

## Gemini API Key Setup

Before starting M1, you'll need a Gemini API key:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key
6. Add to `.env` file: `GEMINI_API_KEY=your_key_here`

> [!NOTE]
> The free tier provides 15 requests/minute and 1 million tokens/day — sufficient for this MVP's pipeline workload.

---

## Reddit API Setup

Before M1.2, you'll need Reddit API credentials:

1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Click "create another app"
3. Select "script" type
4. Set redirect URI to `http://localhost:8080`
5. Copy the client ID (under app name) and client secret
6. Add to `.env`:
   ```
   REDDIT_CLIENT_ID=your_id
   REDDIT_CLIENT_SECRET=your_secret
   REDDIT_USER_AGENT=DiscoveryEngine/1.0
   ```

---

## Verification Checklist

After each milestone, verify:

| Milestone | Verification |
|---|---|
| M0 | `python run_pipeline.py` runs (no-op). `npm run dev` shows mock dashboard. |
| M1 | `data/raw/` has JSON files with 1,000+ entries. Spot-check 10 entries. |
| M2 | `data/normalized/all_normalized.json` has unified schema. Cleaning report shows reasonable filter rates. |
| M3 | `data/enriched/all_enriched.json` has classifications. Memory vs. search split looks reasonable. Spot-check 30. |
| M4 | All 9 output JSON files present. `pain_points.json` has ranked clusters. `frameworks.json` has chart data. |
| M5 | Dashboard loads, sidebar navigates between routes, filters render, data context works. |
| M6 | Pain points, opportunities, and frameworks show real data with working filters. |
| M7 | All 7 sections functional. |
| M8 | PDF downloads correctly. CSV contains all data. UI is polished. |
| M9 | Vercel URL loads. All routes work. Export works. Shareable links work. |

---

*Document Version: 1.0*
*Created: September 21, 2026*
*References: [architecture.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/architecture.md), [context.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/context.md)*
