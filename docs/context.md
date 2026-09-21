# AI-Powered Discovery Engine for Google Photos
## Project Context Document

---

## 1. Problem Statement

Users of Google Photos accumulate thousands of photos, videos, screenshots, documents, and visual memories over years. While **known-item search** works well (e.g., "sunset in Goa"), **memory-based retrieval** breaks down when users have **incomplete or fuzzy recollections** of what they are looking for.

### The Memory Problem (Not a Search Problem)

> [!IMPORTANT]
> This project is strictly focused on the **memory problem** — the gap between what a user *remembers* about a photo and what the system *needs* to retrieve it. This is NOT about improving keyword search, indexing, or search ranking.

**Examples of the memory problem:**
- *"That small café we went to during our Goa trip"* — User remembers a place and context but not the photo's metadata
- *"The picture of the medicine I took when I was sick last year"* — User remembers an object and a vague time, but not location or album
- *"That funny face my daughter made at someone's birthday party"* — User remembers an emotion and event type, but not whose party or when
- *"The screenshot of that recipe someone sent me"* — User knows it exists but has no visual memory of the photo itself

### Why This Matters

Users **know** the photo exists. They have a **memory** of the moment. But the retrieval path fails because:
1. The information they remember doesn't map cleanly to the system's retrieval capabilities
2. They don't know the right keywords, dates, locations, or album names
3. The system doesn't support the way human memory works (associative, contextual, emotional)

---

## 2. Who This Is For

| Attribute | Detail |
|---|---|
| **Primary User** | Product Manager on the Core Experience team at Google Photos |
| **Purpose** | Understand user pain points around memory-based photo retrieval at scale |
| **Output** | Actionable insights, prioritized opportunities, and user interview guides |
| **Audience for Insights** | Google Photos product team, design team, engineering leadership |

---

## 3. What This Engine Does

This is an **AI-powered insights dashboard** that analyzes publicly available user feedback to uncover how people remember old visual information, where the existing retrieval experience breaks down, and what opportunities exist to meaningfully improve successful retrieval.

### Core Capabilities

| Capability | Description |
|---|---|
| **Pain Point Discovery** | Identify and categorize user struggles with memory-based photo retrieval |
| **Memory Cue Taxonomy** | Classify what users remember (people, places, events, time, emotions, objects) vs. what they forget |
| **Retrieval Failure Analysis** | Map the user journey: trigger → search attempt → failure point → workaround → outcome |
| **Geographic Segmentation** | Segment pain points by geography (US and India primarily) and user behavior |
| **Opportunity Identification** | Surface unaddressed needs and prioritize opportunity areas |
| **Competitive Context** | Track what Google Photos has already done in 2026 to address these problems |
| **Interview Guide Generation** | Auto-generate user research discussion guides with open-ended questions, probes, and scenarios |
| **Export & Reporting** | Generate PDF/CSV reports for stakeholder presentations |

### What This Engine Does NOT Do

- ❌ Summarize reviews superficially or do basic sentiment analysis
- ❌ Address search-related problems (keyword matching, indexing, ranking)
- ❌ Provide real-time monitoring or alerting
- ❌ Make product decisions — it provides evidence for the PM to make decisions

---

## 4. Data Sources

The engine collects and analyzes user feedback from the following publicly available sources, **restricted to the last 6–8 months (2026 only)**:

| Source | Type | Geography Focus |
|---|---|---|
| Google Play Store reviews | App reviews | US, India |
| Apple App Store reviews | App reviews | US, India |
| Reddit (r/googlephotos, r/google, r/photography, r/Android, r/ios) | Community discussions | Global (US-heavy) |
| Google Photos Help Community | Official support forum | Global |
| Twitter/X | Social media conversations | US, India |
| YouTube comments | Video comments on Google Photos related content | Global |
| Tech forums (XDA, MacRumors, etc.) | Forum discussions | Global |

> [!NOTE]
> Data collection uses a **pre-collected dataset approach** — scripts will scrape/collect data first, then the engine analyzes the stored dataset. No live web scraping at runtime.

---

## 5. Analytical Frameworks

The engine applies the following analytical frameworks to transform raw user feedback into actionable insights:

### 5.1 Impact Severity Matrix
Classifies each pain point by severity:
- **Critical** — Complete retrieval failure; user cannot find the photo at all
- **High** — Significant friction; user eventually finds it but with extreme effort
- **Medium** — Moderate friction; user finds it with workarounds
- **Low** — Minor annoyance; slightly suboptimal experience

### 5.2 Frequency of Mention
Quantifies how often each pain point appears across sources, weighted by source credibility and recency.

### 5.3 Retrieval Success vs. Failure Scenarios
Categorizes user stories into:
- **Success** — User found what they were looking for
- **Partial Success** — User found something related but not the exact photo
- **Failure** — User could not find the photo despite knowing it exists
- **Abandonment** — User gave up trying

### 5.4 Memory Cue Taxonomy
Classifies the types of information users remember about photos they are trying to retrieve:

| Memory Cue Type | Example |
|---|---|
| **People** | "A photo with my grandmother" |
| **Places** | "That café in Goa" |
| **Events** | "At someone's birthday party" |
| **Time** | "Sometime last monsoon" |
| **Emotions** | "That funny moment" |
| **Objects** | "The medicine bottle I photographed" |
| **Activities** | "When we were hiking" |
| **Context** | "Something someone shared with me" |
| **Visual Attributes** | "A photo with lots of greenery" |

### 5.5 Gap Analysis: User Memory vs. System Support
Compares what users remember (memory cues) against what Google Photos currently supports for retrieval, identifying gaps.

### 5.6 User Journey Mapping
Maps the complete retrieval journey:
```
Trigger → Search Attempt → Failure Point → Workaround → Outcome
```
- **Trigger**: What prompted the user to look for the photo?
- **Search Attempt**: What did they try? (keyword, scroll, album browse, etc.)
- **Failure Point**: Where did the process break down?
- **Workaround**: Did they try alternative approaches?
- **Outcome**: Did they eventually find it? How did they feel?

---

## 6. UI Sections

The web application provides the following dashboard sections:

### 6.1 📚 References Section
- Links to original sources (reviews, threads, posts) where key pain points were identified
- Grouped by source type (Play Store, Reddit, etc.)
- Each reference includes: source URL, date, relevant quote/excerpt, and which pain point it maps to

### 6.2 🔴 Unaddressed Pain Points & Needs
- Pain points and user needs that are currently NOT being addressed by Google Photos
- Ranked by severity and frequency
- Each pain point includes: description, user quotes, memory cues involved, affected segments

### 6.3 ✅ Google Photos Actions in 2026
- Auto-researched list of features, updates, and announcements Google Photos has made in 2026
- Mapped to which pain points (if any) they address
- Gap analysis: what's still unaddressed

### 6.4 🌍 Geographic & Behavioral Segmentation
- Pain points segmented by geography (US vs. India primarily)
- Behavioral segments: casual users, power users, families, professionals
- Cultural differences in photo retrieval behavior

### 6.5 🎯 Opportunity Areas
- Prioritized list of opportunity areas based on pain point severity, frequency, and addressability
- Each opportunity includes: problem statement, supporting evidence, estimated impact, and suggested direction
- Comparison matrix to evaluate and rank opportunities

### 6.6 🗣️ Interview Guide Generator
- Auto-generated user interview discussion guides
- Open-ended questions organized by pain point and opportunity area
- Includes probes, follow-up questions, and scenario-based prompts
- Designed for qualitative user research sessions

### 6.7 📊 Export & Reports
- PDF report generation for stakeholder presentations
- CSV data export for further analysis
- Pre-formatted summaries suitable for PRDs and design briefs

---

## 7. Key Questions the Engine Helps Answer

These are the **core discovery questions** this engine is designed to help answer:

1. **What kinds of old photos do users struggle to retrieve?**
2. **What information do people actually remember about a photo?**
3. **What information have they forgotten?**
4. **How do users formulate searches when their memory is incomplete?**
5. **Where in the retrieval journey do users fail or give up?**
6. **What workarounds do users currently employ?**
7. **Which pain points are most severe and most frequent?**
8. **How do retrieval struggles differ across geographies and user segments?**
9. **What has Google Photos already done to address these problems in 2026?**
10. **What are the highest-impact, unaddressed opportunity areas?**

---

## 8. Technical Architecture Overview

### Stack
| Layer | Technology |
|---|---|
| **Frontend** | Vite + React (SPA) |
| **Styling** | Vanilla CSS (modern, premium design) |
| **AI/LLM** | Google Gemini API (free tier available) |
| **Data Collection** | Python scripts (pre-collection phase) |
| **Data Storage** | JSON/structured files (local-first) |
| **Export** | PDF generation (client-side), CSV export |

### Architecture Principles
- **Local-first**: Runs on local machine, no cloud dependencies required
- **Deployable**: Architected so it can be deployed later (e.g., to Vercel, Netlify)
- **Pre-collected data**: Scripts collect and structure data; the UI analyzes the stored dataset
- **AI-augmented analysis**: Gemini API powers the insight extraction, taxonomy classification, and interview guide generation

### High-Level Flow
```
[Data Collection Scripts]     →  [Structured Dataset (JSON)]
                                        ↓
                              [Gemini API Analysis]
                                        ↓
                              [Insights & Taxonomies]
                                        ↓
                              [Vite + React Dashboard]
                                        ↓
                              [PM views insights, filters, exports]
```

---

## 9. Data Time Window

> [!IMPORTANT]
> All data collection and analysis is restricted to **2026 only** (approximately January 2026 – September 2026). This ensures insights reflect the current state of user pain points and account for any features Google has already shipped.

---

## 10. Scope Boundaries

### In Scope
- Memory-based retrieval problems
- User feedback analysis from public sources
- Pain point discovery, categorization, and prioritization
- Geographic and behavioral segmentation (US, India)
- Tracking Google Photos 2026 feature launches
- Interview guide generation
- PDF/CSV export

### Out of Scope
- Search-related improvements (keyword matching, indexing, ranking)
- Real-time data streaming or live monitoring
- Non-Google Photos products
- Private/internal data (only publicly available sources)
- Implementation recommendations for engineering (this is a discovery tool)
- User data collection or privacy-sensitive operations

---

## 11. Success Criteria

The engine is successful if a Product Manager can:
1. **Identify** the top 10 unaddressed memory-based retrieval pain points within 30 minutes
2. **Compare** pain points across geographies and user segments
3. **Trace** each insight back to real user quotes and source links
4. **Generate** a user interview discussion guide for deeper discovery
5. **Export** a stakeholder-ready report with prioritized opportunities
6. **Understand** what Google Photos has already done in 2026 and what gaps remain

---

*Document Version: 1.0*
*Created: September 21, 2026*
*Author: AI Discovery Engine Project*
