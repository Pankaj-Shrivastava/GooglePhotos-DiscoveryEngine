# Architecture — AI-Powered Discovery Engine
## MVP Architecture Document

> [!NOTE]
> This is an **MVP architecture**. The goal is to deliver real value — actionable insights for a PM — with the simplest system that covers all requirements. We avoid over-engineering while ensuring the data pipeline is robust enough to produce trustworthy insights.

---

## 1. System Overview

The Discovery Engine is a **two-phase system**:

1. **Phase 1 — Data Pipeline (Python, offline):** Collect, clean, normalize, and enrich user feedback using Python scripts + Gemini API. Runs locally, produces static JSON files.
2. **Phase 2 — Dashboard (React SPA, online):** Read the pre-computed JSON files and render an interactive insights dashboard. Deployed to Vercel.

```
┌─────────────────────────────────────────────────────────┐
│                 PHASE 1: DATA PIPELINE                  │
│                   (Python, runs locally)                 │
│                                                         │
│  ┌───────────┐   ┌───────────┐   ┌──────────────────┐  │
│  │ Collectors │──▶│ Cleaner & │──▶│ Gemini Enricher  │  │
│  │ (per src)  │   │ Normalizer│   │ (classify, tag,  │  │
│  └───────────┘   └───────────┘   │  score, segment)  │  │
│                                  └────────┬─────────┘  │
│                                           │             │
│                                  ┌────────▼─────────┐  │
│                                  │   Aggregator      │  │
│                                  │ (compute insights │  │
│                                  │  & framework data)│  │
│                                  └────────┬─────────┘  │
│                                           │             │
│                                  ┌────────▼─────────┐  │
│                                  │  Static JSON      │  │
│                                  │  output files     │  │
│                                  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │  JSON files committed to repo
                        │  (or copied to /public)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 PHASE 2: DASHBOARD                      │
│              (Vite + React + Tailwind CSS)               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Reads static JSON → Renders dashboard sections  │   │
│  │  Filters, drill-downs, charts, export            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│                   Deployed on Vercel                     │
└─────────────────────────────────────────────────────────┘
```

### Why This Architecture?

| Design Choice | Rationale |
|---|---|
| **No backend server** | The dashboard reads static JSON — no API server needed. Simplest possible deployment. |
| **Python pipeline runs offline** | Data collection and AI enrichment happen before the dashboard runs. No runtime API calls from the frontend. |
| **JSON as the interface** | The pipeline outputs JSON files; the dashboard reads them. Clean separation between data processing and visualization. |
| **No database** | For an MVP analyzing ~1,000–5,000 feedback entries, JSON files are sufficient. No DB setup, no ORM, no migrations. |

---

## 2. Project Structure

```
GooglePhotos-DiscoveryEngine/
├── docs/                          # Project documentation
│   ├── context.md
│   ├── decisions.md
│   └── architecture.md            # ← This file
│
├── pipeline/                      # Phase 1: Python data pipeline
│   ├── requirements.txt           # Python dependencies
│   ├── config.py                  # Shared configuration (API keys, date ranges, etc.)
│   │
│   ├── collectors/                # Source-specific data collection scripts
│   │   ├── __init__.py
│   │   ├── base_collector.py      # Abstract base class for all collectors
│   │   ├── play_store.py          # Google Play Store reviews
│   │   ├── app_store.py           # Apple App Store reviews
│   │   ├── reddit.py              # Reddit discussions
│   │   ├── youtube.py             # YouTube comments
│   │   ├── twitter.py             # Twitter/X posts
│   │   ├── forums.py              # Tech forums (XDA, MacRumors, etc.)
│   │   └── google_community.py    # Google Photos Help Community
│   │
│   ├── processing/                # Cleaning, normalization, enrichment
│   │   ├── __init__.py
│   │   ├── cleaner.py             # Dedup, spam filter, language filter, PII scrub
│   │   ├── normalizer.py          # Unified schema mapping, date/geo/platform normalization
│   │   └── enricher.py            # Gemini API calls: classify, tag, score, segment
│   │
│   ├── analysis/                  # Aggregation & framework analysis
│   │   ├── __init__.py
│   │   └── aggregator.py          # Compute insights, framework data, opportunity scores
│   │
│   ├── run_pipeline.py            # Main entry point — runs full pipeline end-to-end
│   │
│   └── data/                      # Pipeline data (gitignored except output/)
│       ├── raw/                   # Raw scraped data (per source JSON)
│       ├── cleaned/               # After cleaning & dedup
│       ├── normalized/            # After normalization (unified schema)
│       ├── enriched/              # After Gemini enrichment
│       └── output/                # Final aggregated insights (consumed by dashboard)
│           ├── pain_points.json
│           ├── memory_cues.json
│           ├── opportunity_areas.json
│           ├── journey_maps.json
│           ├── segmentation.json
│           ├── google_actions_2026.json
│           ├── references.json
│           ├── frameworks.json
│           └── interview_guides.json
│
├── dashboard/                     # Phase 2: Vite + React SPA
│   ├── public/
│   │   └── data/                  # ← Pipeline output JSON copied here for deployment
│   ├── src/
│   │   ├── main.jsx               # App entry point
│   │   ├── App.jsx                # Root component with routing/navigation
│   │   ├── index.css              # Tailwind imports + global styles
│   │   │
│   │   ├── components/            # Shared UI components
│   │   │   ├── Layout.jsx         # Sidebar + main content layout
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── Sidebar.jsx        # Section navigation
│   │   │   ├── FilterBar.jsx      # Global filters (geography, severity, source, etc.)
│   │   │   ├── ExportButton.jsx   # Full dashboard PDF/CSV export trigger
│   │   │   ├── ChartCard.jsx      # Reusable chart container
│   │   │   ├── DataTable.jsx      # Reusable sortable/filterable table
│   │   │   └── QuoteCard.jsx      # User quote display with source attribution
│   │   │
│   │   ├── sections/              # One component per dashboard section
│   │   │   ├── ReferencesSection.jsx
│   │   │   ├── PainPointsSection.jsx
│   │   │   ├── GoogleActionsSection.jsx
│   │   │   ├── SegmentationSection.jsx
│   │   │   ├── OpportunitySection.jsx
│   │   │   ├── FrameworksSection.jsx
│   │   │   └── InterviewGuideSection.jsx
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useData.js         # Load and cache JSON data
│   │   │   └── useFilters.js      # Global filter state management
│   │   │
│   │   └── utils/                 # Utility functions
│   │       ├── exportPdf.js       # PDF generation (jsPDF + html2canvas)
│   │       └── exportCsv.js       # CSV generation
│   │
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS config for Tailwind
│   ├── vite.config.js             # Vite configuration
│   ├── vercel.json                # Vercel deployment config (SPA fallback)
│   ├── package.json
│   └── index.html
│
├── .env.example                   # Environment variable template
├── .gitignore
└── README.md
```

---

## 3. Data Pipeline — Detailed Design

### 3.1 Collectors

Each collector follows the same interface and outputs raw JSON to `pipeline/data/raw/`.

```python
# base_collector.py — Abstract interface
class BaseCollector:
    def __init__(self, config):
        self.source_name = ""          # e.g., "play_store"
        self.date_from = "2026-01-01"
        self.date_to = "2026-09-21"

    def collect(self) -> list[dict]:
        """Fetch raw data from the source. Returns list of raw entries."""
        raise NotImplementedError

    def save(self, entries: list[dict]):
        """Save raw entries to pipeline/data/raw/{source_name}.json"""
```

**MVP source priority** (implement in this order):

| Priority | Source | Method | Why First |
|---|---|---|---|
| P0 | Reddit | PRAW (Reddit API) | Richest narrative data — users describe problems in detail |
| P0 | Google Play Store | google-play-scraper | Highest volume of reviews |
| P1 | App Store | app-store-scraper | iOS perspective |
| P1 | Google Photos Help Community | Web scraping (BeautifulSoup) | Official support = high signal |
| P2 | Twitter/X | Web scraping or Apify | Short-form but wide reach |
| P2 | YouTube comments | YouTube Data API v3 | Comments on Google Photos reviews/tutorials |
| P3 | Tech forums | Web scraping | Supplementary |

> [!TIP]
> For the MVP, **P0 sources (Reddit + Play Store) alone will deliver significant value**. Other sources can be added incrementally without changing the pipeline architecture.

### 3.2 Cleaner

A single `cleaner.py` module processes all raw data through these steps in sequence:

```
Raw JSON → Dedup → Spam Filter → Language Filter → Relevance Filter → PII Scrub → Cleaned JSON
```

**MVP approach** — keep it simple:
- **Dedup**: Exact text match + fuzzy matching (difflib, threshold 0.85)
- **Spam filter**: Keyword blocklist + very short entries (<10 words) removal
- **Language filter**: langdetect library — keep English only
- **Relevance filter**: Keyword allowlist (photo, search, find, remember, album, memory, lost, missing, etc.)
- **PII scrub**: Regex patterns for emails, phone numbers, names-after-@ patterns

### 3.3 Normalizer

Maps cleaned data from each source into the **unified schema**:

```json
{
  "id": "reddit_abc123",
  "source": "reddit",
  "source_url": "https://reddit.com/r/googlephotos/comments/...",
  "date": "2026-05-14",
  "text": "I know I took a photo of that restaurant in Jaipur but I can't find it anywhere...",
  "rating": null,
  "geography": "India",
  "platform": "android",
  "raw_metadata": {
    "subreddit": "googlephotos",
    "score": 45,
    "num_comments": 12
  }
}
```

**Geography inference** (MVP):
- Reddit: infer from subreddit (r/india, r/IndiaTech), post content mentions of cities/states/currency
- Play Store/App Store: use the store region if available, otherwise infer from text
- Fallback: "Unknown"

### 3.4 Enricher (Gemini API)

The enricher sends batches of normalized entries to Gemini for AI-powered classification. This is where the engine's intelligence lives.

**Batching strategy (MVP):**
- Send 10–20 entries per API call to maximize context while staying within token limits
- Use structured output (JSON mode) for reliable parsing

**Gemini prompt structure:**
```
You are an expert UX researcher analyzing Google Photos user feedback.
For each entry, classify:

1. problem_type: "memory" | "search" | "other" | "not_a_problem"
   - "memory": User has incomplete/fuzzy recollection of a photo they know exists
   - "search": User knows exactly what to search but the search doesn't work well
   - "other": Unrelated complaint (storage, pricing, UI bugs, etc.)

2. pain_point_cluster: One of the predefined clusters (see below)

3. memory_cues: Array of cue types mentioned:
   ["people", "places", "events", "time", "emotions", "objects", "activities", "context", "visual_attributes"]

4. severity: "critical" | "high" | "medium" | "low"

5. journey_stage: "trigger" | "search_attempt" | "failure" | "workaround" | "outcome"

6. user_segment: "casual" | "power_user" | "family" | "professional"

7. confidence: 0.0 to 1.0 — how confident are you in this classification?

Return JSON array matching the input order.
```

> [!IMPORTANT]
> Entries classified as `problem_type: "search"` or `"other"` are **kept in the dataset but flagged as out-of-scope**. They are excluded from pain point analysis but retained for the gap analysis (showing what proportion of feedback is memory vs. search vs. other).

### 3.5 Aggregator

Reads enriched data and computes all framework outputs:

```python
# aggregator.py — produces output JSON files

def aggregate(enriched_entries: list[dict]) -> dict:
    """
    Produces:
    - pain_points.json: Clustered pain points with frequency, severity, quotes, sources
    - memory_cues.json: Distribution of memory cue types with examples
    - opportunity_areas.json: Ranked opportunities with evidence
    - journey_maps.json: Stage distribution and flow data
    - segmentation.json: Geographic + behavioral breakdowns
    - google_actions_2026.json: Tracked Google Photos updates (from a separate collector)
    - references.json: Source links grouped by pain point
    - frameworks.json: Pre-computed chart data for all 6 analytical frameworks
    - interview_guides.json: Generated interview questions per pain point
    """
```

**Interview guide generation** — the aggregator makes a final Gemini call with the top pain points and asks it to generate:
- 5–7 open-ended questions per pain point
- Probes and follow-ups for each question
- 2–3 scenario-based prompts for each opportunity area

---

## 4. Dashboard — Detailed Design

### 4.1 Data Loading

The dashboard loads static JSON files from `public/data/` at startup. No API calls.

```javascript
// hooks/useData.js
const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/pain_points.json').then(r => r.json()),
      fetch('/data/memory_cues.json').then(r => r.json()),
      fetch('/data/opportunity_areas.json').then(r => r.json()),
      fetch('/data/journey_maps.json').then(r => r.json()),
      fetch('/data/segmentation.json').then(r => r.json()),
      fetch('/data/google_actions_2026.json').then(r => r.json()),
      fetch('/data/references.json').then(r => r.json()),
      fetch('/data/frameworks.json').then(r => r.json()),
      fetch('/data/interview_guides.json').then(r => r.json()),
    ]).then(([painPoints, memoryCues, opportunities, journeys,
             segmentation, googleActions, references, frameworks,
             interviewGuides]) => {
      setData({ painPoints, memoryCues, opportunities, journeys,
                segmentation, googleActions, references, frameworks,
                interviewGuides });
    });
  }, []);

  return data;
};
```

### 4.2 Global Filters

A `FilterBar` component provides cross-section filtering:

| Filter | Values | Applied To |
|---|---|---|
| Geography | US, India, All | All sections |
| Severity | Critical, High, Medium, Low | Pain points, Opportunities |
| Source | Reddit, Play Store, App Store, etc. | References, Pain points |
| User Segment | Casual, Power User, Family, Professional | Segmentation, Pain points |
| Memory Cue | People, Places, Events, Time, etc. | Frameworks, Pain points |

Filters are managed via React context (`useFilters` hook) so all sections respond to the same filter state.

### 4.3 Section Components

Each section is a self-contained React component that:
1. Reads from the shared data context
2. Applies global filters
3. Renders its specific visualization

| Section | Key Visualizations | Charting Library |
|---|---|---|
| References | Filterable table with source links | DataTable component |
| Pain Points | Severity-ranked cards with user quotes | Cards + QuoteCard |
| Google Actions 2026 | Timeline + gap mapping table | DataTable + badges |
| Segmentation | Geo comparison charts, behavioral segment bars | Recharts |
| Opportunity Areas | Prioritized list with impact/effort scoring | Cards + Recharts |
| Analytical Frameworks | Heatmap, pie charts, funnel, flow diagram, gap matrix | Recharts |
| Interview Guides | Expandable question cards per pain point | Accordion component |

**Charting library choice: Recharts**
- React-native, composable, lightweight
- Supports bar, pie, radar, funnel, heatmap — everything we need
- Good enough for MVP, can be swapped later

### 4.4 Export

A single "Export Dashboard" button generates:

**PDF**: Uses `jsPDF` + `html2canvas` to capture the rendered dashboard as a formatted PDF report.

**CSV**: Uses a utility function to flatten all JSON data into tabular format and trigger a browser download.

```javascript
// utils/exportPdf.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportDashboardPdf = async () => {
  const sections = document.querySelectorAll('[data-export-section]');
  const pdf = new jsPDF('p', 'mm', 'a4');
  // Iterate sections, capture each as image, add to PDF pages
};
```

### 4.5 Navigation

Single-page app with a **sidebar** and **React Router** for route-based navigation. Each section gets its own URL, enabling shareable deep links on Vercel (e.g., `app.vercel.app/opportunities`).

```
┌─────────────────────────────────────────────────────┐
│  Navbar: "Discovery Engine" logo + Export button     │
├─────────┬───────────────────────────────────────────┤
│ Sidebar │  Main Content Area                        │
│         │                                           │
│ ○ Refs  │  ┌─────────────────────────────────────┐  │
│ ○ Pain  │  │  Current Route Section               │  │
│ ○ Goog  │  │  (one section per route)             │  │
│ ○ Segm  │  │                                     │  │
│ ○ Opps  │  │  [FilterBar across top]              │  │
│ ○ Frmk  │  │                                     │  │
│ ○ Intv  │  └─────────────────────────────────────┘  │
│         │                                           │
└─────────┴───────────────────────────────────────────┘

Routes:
  /                → Pain Points (default landing)
  /references      → References
  /google-actions   → Google Photos Actions 2026
  /segmentation    → Geographic & Behavioral Segmentation
  /opportunities   → Opportunity Areas
  /frameworks      → Analytical Frameworks
  /interview-guide → Interview Guide Generator
```

---

## 5. Output JSON Schemas

### 5.1 pain_points.json
```json
{
  "pain_points": [
    {
      "id": "pp_001",
      "title": "Cannot find photos from specific life events",
      "description": "Users remember attending an event but cannot locate photos from it...",
      "severity": "critical",
      "frequency": 147,
      "memory_cues_involved": ["events", "time", "people"],
      "affected_segments": ["casual", "family"],
      "affected_geographies": ["US", "India"],
      "quotes": [
        {
          "text": "I know I took photos at my cousin's wedding but searching 'wedding' shows hundreds of random results...",
          "source": "reddit",
          "source_url": "https://reddit.com/...",
          "date": "2026-03-15",
          "geography": "India"
        }
      ],
      "journey_stage_distribution": {
        "trigger": 12,
        "search_attempt": 45,
        "failure": 78,
        "workaround": 30,
        "outcome": 15
      },
      "addressed_by_google": false,
      "related_google_action_ids": []
    }
  ],
  "total_entries_analyzed": 2340,
  "memory_only_entries": 890,
  "date_range": { "from": "2026-01-01", "to": "2026-09-21" }
}
```

### 5.2 opportunity_areas.json
```json
{
  "opportunities": [
    {
      "id": "opp_001",
      "title": "Context-aware photo retrieval using associative memory cues",
      "problem_statement": "Users frequently remember contextual details (who they were with, what they were doing) but have no way to query photos using these associative cues.",
      "supporting_pain_points": ["pp_001", "pp_003", "pp_007"],
      "impact_score": 9.2,
      "evidence_count": 234,
      "affected_geographies": ["US", "India"],
      "affected_segments": ["casual", "family", "power_user"],
      "suggested_direction": "Explore conversational retrieval interfaces that allow users to describe memories naturally.",
      "is_primary_recommendation": true
    }
  ]
}
```

### 5.3 frameworks.json
```json
{
  "severity_matrix": {
    "critical": 5,
    "high": 8,
    "medium": 12,
    "low": 4
  },
  "memory_cue_distribution": {
    "people": 234, "places": 189, "events": 312,
    "time": 156, "emotions": 87, "objects": 134,
    "activities": 98, "context": 201, "visual_attributes": 45
  },
  "retrieval_outcomes": {
    "success": 120, "partial_success": 340,
    "failure": 580, "abandonment": 210
  },
  "gap_analysis": [
    {
      "memory_cue": "events",
      "user_frequency": 312,
      "google_photos_support": "partial",
      "gap_level": "high",
      "notes": "Google Photos groups by date but doesn't connect to life events"
    }
  ],
  "journey_stage_distribution": {
    "trigger": 250, "search_attempt": 450,
    "failure": 580, "workaround": 300, "outcome": 210
  }
}
```

---

## 6. Technology Stack — Final

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Pipeline runtime** | Python | 3.11+ | Data collection, cleaning, enrichment |
| **Reddit API** | PRAW | latest | Reddit data collection |
| **Play Store scraper** | google-play-scraper | latest | Play Store reviews |
| **App Store scraper** | app-store-scraper-dyn | latest | App Store reviews |
| **Web scraping** | BeautifulSoup4 + requests | latest | Forums, community pages |
| **Language detection** | langdetect | latest | English filtering |
| **AI/LLM** | Google Gemini API | gemini-2.0-flash | Classification, enrichment, interview guides |
| **Frontend framework** | React | 18+ | Dashboard UI |
| **Routing** | React Router | v6+ | Shareable deep links per section |
| **Build tool** | Vite | 6+ | Dev server + production build |
| **Styling** | Tailwind CSS | 4+ | Utility-first CSS |
| **Charts** | Recharts | latest | Data visualizations |
| **PDF export** | jsPDF + html2canvas | latest | Dashboard PDF generation |
| **CSV export** | Custom utility | — | Flatten JSON to CSV |
| **Deployment** | Vercel | — | Static SPA hosting |

---

## 7. Key Interfaces

### 7.1 Pipeline → Dashboard Interface

The **only contract** between the Python pipeline and the React dashboard is the set of JSON files in `pipeline/data/output/`. These files are copied to `dashboard/public/data/` before build/deployment.

```bash
# Copy pipeline output to dashboard (part of build script)
cp -r pipeline/data/output/* dashboard/public/data/
```

This means:
- Pipeline and dashboard can be developed independently
- Dashboard can be tested with mock JSON data before the pipeline is complete
- Pipeline can be improved/re-run without touching dashboard code

### 7.2 Gemini API Interface

All Gemini API calls go through a single `enricher.py` module with:
- Structured JSON output mode
- Retry logic with exponential backoff
- Token usage tracking
- Confidence thresholds (discard classifications below 0.5 confidence)

```python
# enricher.py — simplified interface
import google.generativeai as genai

class GeminiEnricher:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def enrich_batch(self, entries: list[dict]) -> list[dict]:
        """Send batch of entries, get structured classifications back."""
        prompt = self._build_prompt(entries)
        response = self.model.generate_content(prompt)
        return self._parse_response(response, entries)
```

---

## 8. Deployment

### 8.1 Local Development

```bash
# Pipeline
cd pipeline
pip install -r requirements.txt
cp ../.env.example ../.env  # Add GEMINI_API_KEY
python run_pipeline.py

# Dashboard
cd dashboard
npm install
cp -r ../pipeline/data/output/* public/data/
npm run dev
```

### 8.2 Vercel Deployment

```json
// dashboard/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deployment flow:**
1. Run pipeline locally → produces JSON output files
2. Copy output to `dashboard/public/data/`
3. Commit & push to GitHub
4. Vercel auto-deploys from the `dashboard/` directory

> [!NOTE]
> The Gemini API key is **only used during pipeline execution** (local). The deployed dashboard has no API keys or secrets — it only serves static files.

---

## 9. MVP Scope & Simplification Decisions

| Full Vision | MVP Simplification |
|---|---|
| All 7 data sources | Start with **Reddit + Play Store** (P0). Add others incrementally. |
| Complex dedup (ML-based) | **Exact match + fuzzy string matching** (difflib) |
| Real-time geography detection | **Keyword-based inference** from text + store metadata |
| Complex PII detection | **Regex-based** (emails, phone numbers) |
| Interactive drill-down on every chart | **Filters + route-based sections**. No deep chart interactivity. |
| Complex nested routing | **Flat routes** — one route per section, shared layout |
| Database storage | **JSON files** (sufficient for ~5K entries) |
| Backend API server | **No backend** — static JSON served directly |
| Real-time data refresh | **Manual re-run** of pipeline scripts |
| Complex scoring algorithms | **Gemini-powered scoring** in structured output |

---

## 10. Data Flow Summary

```
Step 1: COLLECT
  reddit.py        → data/raw/reddit.json
  play_store.py     → data/raw/play_store.json
  app_store.py      → data/raw/app_store.json
  ...

Step 2: CLEAN
  cleaner.py        → data/cleaned/all_cleaned.json
  (dedup, spam, language, relevance, PII)

Step 3: NORMALIZE
  normalizer.py     → data/normalized/all_normalized.json
  (unified schema, date/geo/platform normalization)

Step 4: ENRICH (Gemini API)
  enricher.py       → data/enriched/all_enriched.json
  (memory vs search, pain point cluster, memory cues,
   severity, journey stage, user segment, confidence)

Step 5: AGGREGATE
  aggregator.py     → data/output/*.json
  (compute all framework metrics, cluster pain points,
   rank opportunities, generate interview guides)

Step 6: DEPLOY
  Copy data/output/* → dashboard/public/data/
  npm run build → deploy to Vercel
```

---

## 11. Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| **API rate limiting** during collection | Incomplete dataset | Respect rate limits, implement backoff, collect incrementally |
| **Gemini API costs** | Budget overrun | Use gemini-2.0-flash (cheapest), batch entries (10-20 per call), cache responses |
| **Low relevance data** | Noisy insights | Multi-stage filtering (keyword → AI classification → confidence threshold) |
| **Memory vs. search misclassification** | Wrong problem framing | Explicit prompt instructions + confidence scoring + manual spot-check of 50 entries |
| **Geographic inference errors** | Skewed segmentation | Accept "Unknown" gracefully, report coverage % per geography |
| **JSON files too large for browser** | Slow dashboard load | Aggregate aggressively — the dashboard loads pre-computed summaries, not raw entries |

---

*Document Version: 1.0*
*Created: September 21, 2026*
*References: [context.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/context.md), [decisions.md](file:///c:/Users/panka/Documents/Pankaj_CodeSpace/AI_Projects/GooglePhotos-DiscoveryEngine/docs/decisions.md)*
