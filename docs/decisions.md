# Decision Log — AI-Powered Discovery Engine

This document records all key architectural, design, and scope decisions made during the development of the Google Photos Discovery Engine.

---

## Decision 001: Data Sourcing Strategy
**Date:** September 21, 2026
**Decision:** Pre-collected dataset approach
**Options Considered:**
1. Live web research at runtime
2. Pre-collected dataset (scripts scrape/collect first, engine analyzes stored data)
3. Hybrid (pre-collect + live refresh)

**Rationale:** Pre-collection provides control over data quality, avoids rate limiting issues during user sessions, ensures reproducible analysis, and reduces latency in the dashboard. Scripts can be re-run periodically to refresh the dataset.

**Trade-offs:** Data may become stale between collection runs. Mitigated by designing scripts for easy re-execution.

---

## Decision 002: Frontend Technology Stack
**Date:** September 21, 2026
**Decision:** Vite + React (SPA) with Tailwind CSS
**Options Considered:**
1. Simple HTML/CSS/JS
2. Vite + React with Vanilla CSS
3. Vite + React with Tailwind CSS
4. Next.js

**Rationale:** Vite + React offers a modern component architecture ideal for a dashboard with multiple interactive sections, filters, and drill-downs. Tailwind CSS enables rapid UI development with utility classes, consistent design tokens, and responsive layouts out of the box — ideal for a data-dense dashboard. Next.js is overkill since we don't need SSR.

**Trade-offs:** Tailwind adds a build dependency but dramatically accelerates UI development. The utility-first approach keeps the CSS footprint small and the design system consistent.

---

## Decision 003: AI/LLM Choice
**Date:** September 21, 2026
**Decision:** Google Gemini API
**Options Considered:**
1. Google Gemini API
2. OpenAI GPT-4o
3. Claude API (Anthropic)

**Rationale:** User has access to Gemini API. It aligns with the Google ecosystem context of this project. Free tier available for development. Steps to generate an API key will be documented in the setup guide.

**Trade-offs:** May have different strengths/weaknesses compared to other LLMs for analysis tasks. Gemini's large context window is advantageous for processing batches of user reviews.

---

## Decision 004: Geographic Focus
**Date:** September 21, 2026
**Decision:** Primarily US and India
**Options Considered:**
1. Global top markets (US, India, UK, Brazil, Japan, Germany)
2. US and India only
3. Data-driven (whatever emerges)
4. Custom list

**Rationale:** US and India represent the two largest Google Photos user bases with distinct cultural contexts for photo retrieval behavior. Focusing on two regions enables meaningful comparison without data dilution.

**Trade-offs:** May miss pain points unique to other markets (e.g., Japan, Brazil). Can be expanded in future iterations.

---

## Decision 005: Interaction Model
**Date:** September 21, 2026
**Decision:** Dashboard-style with pre-computed insights, filters, and drill-downs
**Options Considered:**
1. Dashboard only (pre-computed insights)
2. Conversational (chat interface)
3. Both (dashboard + chat)

**Rationale:** A dashboard approach provides structured, reproducible insights that are easier to share with stakeholders. Filters and drill-downs offer sufficient interactivity for exploration. A chat interface adds complexity without proportional value for the primary use case of stakeholder presentations and prioritization.

**Trade-offs:** Less flexible for ad-hoc questions. Mitigated by comprehensive filtering and the ability to re-run analysis scripts with different parameters.

---

## Decision 006: Analytical Frameworks
**Date:** September 21, 2026
**Decision:** All six frameworks included
**Frameworks Selected:**
1. ✅ Impact severity matrix (critical / high / medium / low)
2. ✅ Frequency of mention (how often each pain point appears)
3. ✅ Retrieval success vs. failure scenarios
4. ✅ Memory cue taxonomy (people, places, events, time, emotions, objects)
5. ✅ Gap analysis: user memory vs. system support
6. ✅ User journey mapping (trigger → search attempt → failure point → workaround → outcome)

**Rationale:** User indicated all frameworks are important. Each provides a unique analytical lens. Together they create a comprehensive picture of the memory-retrieval problem space.

**Trade-offs:** More complex UI with multiple views. Mitigated by clear section organization and filtering. Display all on screen with clear navigation.

---

## Decision 007: Interview Guide Generation
**Date:** September 21, 2026
**Decision:** Full interview guide generation (questions, probes, and scenarios)
**Options Considered:**
1. Full discussion guides with questions, probes, and scenarios
2. Simple question lists per pain point
3. No auto-generation

**Rationale:** Full discussion guides provide the most value for qualitative user research. Auto-generating scenarios based on discovered pain points ensures interview questions are grounded in real user evidence.

**Trade-offs:** Requires more sophisticated LLM prompting. Quality depends on the richness of the underlying data.

---

## Decision 008: Google Photos 2026 Actions Tracking
**Date:** September 21, 2026
**Decision:** Auto-research with no manual editing
**Options Considered:**
1. Auto-research only
2. User-provided list
3. Both (auto-research + manual edits)

**Rationale:** Auto-research reduces manual effort and ensures comprehensive coverage. Data collection scripts will scrape tech blogs, official Google announcements, and changelog sources.

**Trade-offs:** May miss internal/unannounced features. May include inaccurate information from unofficial sources. Mitigated by source attribution and confidence scoring.

---

## Decision 009: Deployment Model
**Date:** September 21, 2026
**Decision:** Vercel deployment
**Options Considered:**
1. Local only
2. Vercel
3. Netlify
4. Self-hosted

**Rationale:** Vercel provides first-class support for Vite + React SPAs, automatic preview deployments for PRs, free tier for personal projects, and seamless GitHub integration. Starting with local development, deploying to Vercel when ready to share with team.

**Trade-offs:** Vendor dependency on Vercel. Mitigated by the fact that the app is a static SPA — can be deployed anywhere that serves static files.

---

## Decision 010: Export Capabilities
**Date:** September 21, 2026
**Decision:** Full dashboard PDF/CSV export (no individual section export)
**Options Considered:**
1. Full dashboard-level PDF/CSV export only
2. Section-level export per section
3. Both section-level and full dashboard export
4. No export (dashboard only)

**Rationale:** User explicitly requires exportable reports for stakeholder presentations. A single combined PDF export provides a comprehensive, stakeholder-ready report. CSV enables further analysis in spreadsheets. Individual section export adds unnecessary UI complexity without proportional value.

**Trade-offs:** PMs cannot export a single section in isolation. Mitigated by the combined export including all sections in a well-structured format.

---

## Decision 011: Data Time Window
**Date:** September 21, 2026
**Decision:** 2026 only (January – September 2026)
**Rationale:** Ensures insights reflect the current state of user problems and account for features already shipped in 2026. Older data may reference problems that have already been addressed.

---

## Decision 012: Scope Boundary — Memory vs. Search
**Date:** September 21, 2026
**Decision:** Strictly memory-based retrieval problems only
**Rationale:** The user explicitly framed this as a memory problem, not a search problem. The engine will filter out feedback related to keyword search quality, indexing speed, or search ranking. Focus is on: incomplete memory, fuzzy recollection, associative retrieval, and contextual recall.

**Implication for Data Processing:** All analysis prompts and classification logic will include explicit instructions to distinguish between:
- **Memory problem** (user can't formulate what to search for) ← IN SCOPE
- **Search problem** (user searches correctly but system returns wrong results) ← OUT OF SCOPE

---

## Decision 013: Analytical Frameworks as UI Section
**Date:** September 21, 2026
**Decision:** Dedicate a full dashboard section to interactive analytical framework visualizations
**Options Considered:**
1. Analytical frameworks drive backend logic only, results shown in other sections
2. Dedicated UI section with interactive visualizations of all frameworks
3. Split framework views across multiple sections

**Rationale:** The user wants analytical frameworks visible in the UI to help understand the problem space deeply. A dedicated section with interactive charts (heatmaps, funnels, flow diagrams, gap matrices) makes the analytical reasoning transparent and explorable. This section is also exportable as PDF/CSV.

**Trade-offs:** Adds a data-dense section requiring charting libraries (e.g., Recharts, Chart.js). Worth the complexity because it directly supports problem framing.

---

## Decision 014: Data Pipeline — Scraping, Cleaning & Normalization
**Date:** September 21, 2026
**Decision:** Build a robust multi-stage data pipeline: scrape → clean → deduplicate → normalize → enrich → aggregate
**Options Considered:**
1. Minimal pipeline (scrape + basic filtering)
2. Full pipeline with cleaning, dedup, normalization, and AI enrichment
3. Use a third-party ETL tool

**Rationale:** The quality of insights depends entirely on the quality of the data. A comprehensive pipeline ensures:
- No duplicate entries inflating frequency counts
- No spam or irrelevant content skewing pain point analysis
- A unified schema so data from Play Store, Reddit, YouTube, etc. are comparable
- AI-powered enrichment to classify memory vs. search problems, tag memory cues, and score severity
- Clear provenance: every insight traces back to a clean, normalized source

**Trade-offs:** More upfront development time for the pipeline. Strongly justified because bad data → wrong problem framing → solving the wrong problem.

---

## Decision 015: Problem Framing Focus
**Date:** September 21, 2026
**Decision:** Entire engine is oriented toward framing the right problem statement, not just listing pain points
**Rationale:** The ultimate output of this engine is not a list of complaints — it's a clearly framed problem statement that tells the Google Photos team exactly which memory-retrieval problem is most pressing and why. Every design decision (robust data pipeline, analytical frameworks, severity scoring, gap analysis) serves this goal. The dashboard should give a PM confidence that the data is clean, the analysis is sound, and the top opportunity area is the right one to invest in.

**Implication:** The Opportunity Areas section should culminate in a recommended "primary problem to solve" backed by evidence from all frameworks.

---

*This document is updated as new decisions are made throughout the project.*
