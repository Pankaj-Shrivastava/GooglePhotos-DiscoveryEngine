# Edge Cases — AI-Powered Discovery Engine

> Catalog of edge cases to handle across the data pipeline and dashboard. Each edge case includes the scenario, what could go wrong, and how to handle it.

---

## 1. Data Collection Edge Cases

### EC-1.1: Reddit API rate limiting or downtime
**Scenario:** PRAW exceeds rate limits or Reddit API is temporarily unavailable.
**What goes wrong:** Collection script crashes mid-run, partial data saved.
**Handling:**
- PRAW handles rate limiting automatically (sleeps and retries)
- Add a try/except wrapper around the full collection loop
- Save entries incrementally (append to file per batch, not all at the end)
- Log the error and continue to the next subreddit
- On script re-run, skip entries with IDs already present (idempotent collection)

### EC-1.2: Play Store returns zero reviews for a date range
**Scenario:** The `google-play-scraper` doesn't support strict date filtering — it returns reviews sorted by newest, and you paginate backward.
**What goes wrong:** If Google Photos has very few recent reviews, or the scraper behavior changes, you may get zero results.
**Handling:**
- Scrape a large batch (5,000+) and filter by date client-side
- If zero entries pass the date filter, log a warning and continue pipeline with available data
- Do NOT fail the pipeline — continue with whatever data we have

### EC-1.3: Reddit post has no body text (title-only posts)
**Scenario:** Many Reddit posts have only a title and no body, or the body is `[removed]` / `[deleted]`.
**What goes wrong:** Empty or useless text field in the dataset.
**Handling:**
- If body is empty/removed/deleted, use the post title as the text field
- If both title and body are empty, discard the entry
- For `[removed]` posts: skip entirely (content was moderated for a reason)

### EC-1.4: Reddit comments vs. posts confusion
**Scenario:** A Reddit post may be about a different topic, but a comment within it specifically discusses Google Photos memory retrieval.
**What goes wrong:** Collecting only posts misses valuable comments. Collecting all comments creates noise.
**Handling:**
- Collect both posts AND top-level comments on relevant posts
- Apply relevance filtering at the comment level too
- Store `entry_type: "post" | "comment"` in raw metadata

### EC-1.5: Play Store reviews in non-English languages
**Scenario:** Even when filtering by US/India, many Indian Play Store reviews are in Hindi, Tamil, Telugu, etc.
**What goes wrong:** Language filter removes a large portion of Indian data, skewing geographic balance.
**Handling:**
- Log the count of non-English Indian reviews for transparency
- Accept this as a known limitation — document in the dashboard
- Future improvement: add multilingual support or translation step

### EC-1.6: Scraper library breaking changes
**Scenario:** `google-play-scraper` or PRAW updates and changes the API or return schema.
**What goes wrong:** Collection script throws unexpected errors.
**Handling:**
- Pin library versions in `requirements.txt`
- Validate raw output schema after collection (check expected keys exist)
- If schema changes, fail fast with a clear error message pointing to the library

### EC-1.7: Google Photos 2026 actions — unreliable sources
**Scenario:** Tech blogs report rumored or unconfirmed features as "launched."
**What goes wrong:** Google Actions section includes features that don't actually exist.
**Handling:**
- Prioritize official Google sources (blog.google, support.google.com)
- Add a `confidence` field to each action: "confirmed" vs. "reported"
- Show confidence indicator in the dashboard

### EC-1.8: Very old or backdated reviews
**Scenario:** A user posts a review in 2026 but describes an experience from 2024.
**What goes wrong:** The review passes the date filter but the pain point described may already be resolved.
**Handling:**
- Accept this as inherent noise — the date filter is based on when the review was posted, not when the experience occurred
- The AI enrichment step can sometimes detect this ("I've had this problem for 2 years") and flag it
- Not worth building complex temporal logic for MVP

---

## 2. Data Cleaning Edge Cases

### EC-2.1: Near-duplicate entries with slight variations
**Scenario:** A user posts the same complaint on Reddit and Play Store, with slightly different wording.
**What goes wrong:** Cross-source duplicates inflate frequency counts for that pain point.
**Handling:**
- Fuzzy matching with `difflib.SequenceMatcher` (threshold 0.85)
- Compare across sources, not just within a source
- If duplicate detected across sources, keep both but link them (document the same user reporting the same issue = stronger signal, not noise)

### EC-2.2: A single user posts dozens of reviews/comments
**Scenario:** One passionate user creates 30+ posts/comments about the same problem.
**What goes wrong:** That user's voice disproportionately inflates one pain point cluster.
**Handling:**
- Track author/user ID in raw metadata
- In aggregation: cap contribution per unique user to 3 entries per pain point cluster
- Log users who exceed the cap for transparency

### EC-2.3: Reviews that are about Google Photos but NOT about retrieval
**Scenario:** "Google Photos keeps crashing" or "Storage is too expensive" — valid complaints but irrelevant to memory/retrieval.
**What goes wrong:** Relevance filter may pass them (they mention "photos").
**Handling:**
- The keyword allowlist is a first pass; the Gemini enrichment step (`problem_type: "other"`) is the real filter
- Both filters together should handle this — keyword filter catches obvious irrelevance, Gemini catches subtle irrelevance

### EC-2.4: langdetect misidentifies language
**Scenario:** Short English sentences or Hinglish (Hindi-English mix) are misidentified as non-English.
**What goes wrong:** Legitimate English-language Indian feedback is lost.
**Handling:**
- Set a minimum text length for language detection (skip detection for entries < 15 words — assume English if from US/India sources)
- If `langdetect` confidence is low, keep the entry rather than discard it
- Log language detection confidence distribution

### EC-2.5: PII in unexpected formats
**Scenario:** User includes their real name, address, or other PII that doesn't match standard regex patterns.
**What goes wrong:** PII appears in the dashboard.
**Handling:**
- Regex catches the most common patterns (email, phone)
- For displayed quotes in the dashboard, use only the first 200 characters (reduces PII exposure surface)
- Add a disclaimer in the dashboard footer: "User quotes are from public sources. Report any PII concerns to [admin]."
- Advanced: use Gemini to flag entries containing potential PII during enrichment

### EC-2.6: Empty text after cleaning
**Scenario:** After removing PII, spam keywords, and short text, some entries become empty strings.
**What goes wrong:** Empty entries pollute the dataset.
**Handling:**
- After all cleaning steps, remove any entry where `len(text.strip()) < 10`
- Log the count of entries removed due to post-cleaning emptiness

---

## 3. AI Enrichment Edge Cases

### EC-3.1: Gemini returns invalid JSON
**Scenario:** Gemini's response is not valid JSON, or the JSON structure doesn't match the expected schema.
**What goes wrong:** Parse error crashes the enrichment step.
**Handling:**
- Wrap JSON parsing in try/except
- On parse failure: retry the same batch (up to 3 retries)
- On persistent failure: reduce batch size to 5 entries and retry
- On final failure: skip the batch, log the failed entries for manual review
- Save progress after every successful batch (checkpoint/resume)

### EC-3.2: Gemini returns fewer results than input batch
**Scenario:** You send 15 entries but Gemini returns classifications for only 12.
**What goes wrong:** 3 entries are unenriched — can't match output to input.
**Handling:**
- Require Gemini output to include the entry ID for matching
- If count mismatch: retry the missing entries individually
- If Gemini consistently drops specific entries, flag them for manual review

### EC-3.3: Ambiguous memory vs. search classification
**Scenario:** "I searched for 'beach photos' but couldn't find the one from our Goa trip." — Is this a search problem (bad search results) or a memory problem (user doesn't have the right query)?
**What goes wrong:** Gemini may classify inconsistently depending on prompt wording.
**Handling:**
- Include explicit examples in the prompt covering this exact ambiguity
- Instruction: "If the user has a specific memory but can't figure out how to search for it → memory. If the user searched correctly but the results are wrong → search."
- Use the `confidence` score — entries near the boundary will have lower confidence
- These borderline cases are actually valuable insight — they reveal the blurry line between memory and search problems

### EC-3.4: Entry is too short for meaningful classification
**Scenario:** "Photos app sucks" — 3 words, no context for classification.
**What goes wrong:** Gemini guesses randomly or returns low-confidence results.
**Handling:**
- Entries with < 15 words: classify as `confidence: 0.3` by default
- These should be caught by the cleaning step (EC-2.6), but if they survive:
- Don't discard them — they contribute to frequency counts — but weight their signal lower
- The confidence threshold (0.5) will filter them from detailed analysis

### EC-3.5: Gemini API rate limit hit (free tier)
**Scenario:** Free tier is 15 requests/minute. Processing 2,000 entries at batch size 15 = 134 requests = ~9 minutes minimum.
**What goes wrong:** Rate limit errors interrupt the pipeline.
**Handling:**
- Implement a rate limiter: max 14 requests/minute (with 1 req/min buffer)
- Sleep between batches: `time.sleep(4.5)` (60/14 ≈ 4.3 seconds)
- On 429 (rate limit) response: exponential backoff (wait 60s, then 120s)
- Display progress bar: "Enriching... 45/134 batches (33%)"

### EC-3.6: Gemini hallucinates pain point clusters
**Scenario:** Instead of using the predefined cluster labels, Gemini invents new ones like "nostalgic_photo_search" or "emotional_archive_browsing."
**What goes wrong:** Pain point clustering becomes fragmented and inconsistent.
**Handling:**
- Use structured output mode with an enum constraint for `pain_point_cluster`
- In the prompt: explicitly list all valid cluster values and say "You MUST use one of these labels. Do not create new ones."
- Post-processing: if an unknown cluster appears, map it to the closest known cluster or flag for manual review

### EC-3.7: Gemini assigns multiple journey stages to one entry
**Scenario:** A single long review describes the full journey: trigger → search → failure → workaround → outcome.
**What goes wrong:** The schema expects one `journey_stage` per entry.
**Handling:**
- Update schema to allow `journey_stages: string[]` (array)
- In aggregation, count the entry once per stage it appears in
- This is actually higher-quality data — full journey narratives are the most valuable entries

### EC-3.8: Token limit exceeded for large batches
**Scenario:** A batch of 15 entries with long texts exceeds Gemini's input token limit.
**What goes wrong:** API returns a token limit error.
**Handling:**
- Estimate tokens before sending (rough: 1 token ≈ 4 characters)
- If estimated tokens > 90% of limit: reduce batch size dynamically
- Truncate individual entry text to 500 characters for the API call (keep full text in the stored data)

---

## 4. Aggregation Edge Cases

### EC-4.1: A pain point cluster has only 1–2 entries
**Scenario:** After enrichment, one cluster has very few entries — e.g., "visual_attribute_recall" has 2 entries.
**What goes wrong:** Statistical unreliability — can't draw meaningful conclusions from 2 entries.
**Handling:**
- Set a minimum threshold: clusters with < 5 entries are merged into an "other_memory" catch-all
- Alternatively, display them but with a warning badge: "Low data volume — interpret with caution"
- Report cluster sizes in the pipeline summary

### EC-4.2: All entries are classified as "Unknown" geography
**Scenario:** Geography inference fails for most entries — the dataset has 90% "Unknown."
**What goes wrong:** The segmentation section becomes useless.
**Handling:**
- If "Unknown" > 60%: log a warning in the pipeline summary
- Show the actual distribution honestly in the dashboard (including "Unknown")
- Suggest to the user: "Consider adding App Store data for better geographic coverage (store region is more reliable)"
- Don't fake geography data or hide the problem

### EC-4.3: Opportunity areas overlap significantly
**Scenario:** Gemini generates 5 opportunities, but 3 of them are essentially the same idea phrased differently.
**What goes wrong:** PM sees redundant opportunities, reducing trust in the engine.
**Handling:**
- In the Gemini prompt for opportunity synthesis: "Ensure each opportunity is distinct and addresses a different aspect of the problem. Do not create overlapping opportunities."
- Post-processing: compute similarity between opportunity problem statements. If > 0.7 similarity, merge them.
- Flag merged opportunities for the PM to review

### EC-4.4: Google Photos 2026 Actions don't map to any pain points
**Scenario:** Google launches features that address problems outside our scope (e.g., storage, sharing, editing).
**What goes wrong:** The Google Actions section shows items that don't connect to any pain points.
**Handling:**
- This is valid — display them with a "Not related to memory retrieval" label
- Include a summary stat: "X of Y Google actions in 2026 address memory retrieval pain points"
- This is useful information (shows Google hasn't focused on this area)

### EC-4.5: Interview guide generation produces generic questions
**Scenario:** Gemini generates questions like "How do you use Google Photos?" instead of specific questions tied to discovered pain points.
**What goes wrong:** Interview guides are not grounded in evidence, reducing their value.
**Handling:**
- In the prompt: include the specific pain point description, top 3 user quotes, and severity score
- Instruction: "Your questions must directly reference the pain point evidence provided. Do not generate generic UX questions."
- Post-processing: check that each question contains a keyword from the pain point description
- If too generic: retry with more context in the prompt

---

## 5. Dashboard Edge Cases

### EC-5.1: JSON files are missing or malformed
**Scenario:** Pipeline output is incomplete — some JSON files are missing or contain invalid JSON.
**What goes wrong:** Dashboard crashes on load.
**Handling:**
- `useData` hook: wrap each fetch in try/catch individually
- If a specific file fails: show that section with an error state ("Data not available for this section")
- Other sections still load and function
- Show a banner: "Some data files could not be loaded. Run the pipeline to regenerate."

### EC-5.2: Filters result in zero matching entries
**Scenario:** User filters to "Geography: India" + "Severity: Critical" + "Memory Cue: Emotions" → zero results.
**What goes wrong:** Blank screen with no feedback.
**Handling:**
- Every section must have an empty state component
- Empty state shows: "No results match your current filters" + "Reset Filters" button
- Do NOT hide sections or show blank white space

### EC-5.3: Very long user quotes in QuoteCard
**Scenario:** A Reddit post is 2,000+ words. Displaying it in a QuoteCard breaks the layout.
**What goes wrong:** Card overflows, layout breaks, PDF export becomes huge.
**Handling:**
- Truncate quotes to 200 characters in the card view with "..." and "Read more" link
- "Read more" expands to show the full text (up to 500 chars) in a modal
- For the source link, always link to the original post
- In PDF export: use the truncated version

### EC-5.4: Charts with zero data points
**Scenario:** A Recharts chart receives an empty data array.
**What goes wrong:** Chart renders as a blank box or throws an error.
**Handling:**
- Check data length before rendering charts
- If empty: show "No data available" placeholder inside the ChartCard
- For pie charts specifically: Recharts throws on empty data — guard with `data.length > 0 && <PieChart>`

### EC-5.5: PDF export captures a loading/transitional state
**Scenario:** User clicks "Export PDF" while data is still loading or while transitioning between routes.
**What goes wrong:** PDF captures loading spinners or partially rendered content.
**Handling:**
- Disable export button while data is loading
- Before PDF capture: navigate to the first section, wait for render, then capture each section sequentially
- Add a 500ms delay between section captures to allow charts to fully render

### EC-5.6: PDF export with dynamic chart heights
**Scenario:** Charts have different heights depending on data volume (e.g., bar chart with 20 bars vs. 3 bars).
**What goes wrong:** PDF page breaks cut through the middle of charts.
**Handling:**
- Capture each section (marked with `data-export-section`) as a separate image
- Start each section on a new PDF page if it doesn't fit the remaining space
- Use a maximum section height — if a section exceeds one page, scale it down

### EC-5.7: Browser memory issues with html2canvas
**Scenario:** `html2canvas` processes the entire dashboard DOM, causing high memory usage on large datasets.
**What goes wrong:** Browser tab crashes or export hangs.
**Handling:**
- Capture one section at a time, add to PDF, release memory
- Limit the number of visible entries per section during export (e.g., top 10 pain points only)
- Show a progress indicator: "Exporting section 3 of 7..."

### EC-5.8: Sidebar doesn't highlight the active route
**Scenario:** User navigates via URL bar or deep link — sidebar doesn't reflect the current route.
**What goes wrong:** Confusing navigation state.
**Handling:**
- Use React Router's `useLocation()` to determine active route
- Apply active styles based on `location.pathname`, not click state

### EC-5.9: User resizes browser window while viewing charts
**Scenario:** Recharts are rendered at a fixed width, then the user resizes the browser.
**What goes wrong:** Charts overflow or become tiny.
**Handling:**
- Use Recharts' `<ResponsiveContainer>` wrapper for all charts
- Sidebar should collapse to an icon bar on narrow screens (< 768px)

---

## 6. Deployment Edge Cases

### EC-6.1: Vercel SPA fallback not working
**Scenario:** User navigates directly to `/opportunities` — Vercel returns 404 because there's no `opportunities/index.html`.
**What goes wrong:** Deep links fail on deployed site.
**Handling:**
- `vercel.json` must include the rewrite rule:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- Test every route with a direct URL hit after deployment

### EC-6.2: JSON files not included in the Vercel build
**Scenario:** `public/data/` files are gitignored or not copied before deploy.
**What goes wrong:** Dashboard loads but all sections show "Data not available."
**Handling:**
- Ensure `dashboard/public/data/*.json` is NOT gitignored
- Add a pre-build check script: verify all 9 JSON files exist before `npm run build`
- In `package.json`: `"prebuild": "node scripts/check-data.js"`

### EC-6.3: Large JSON files cause slow initial load on Vercel
**Scenario:** Aggregated JSON files are large (> 5MB total), causing slow first load on mobile/slow connections.
**What goes wrong:** Dashboard feels sluggish, user abandons before data loads.
**Handling:**
- Aggregate aggressively — the dashboard should load summaries, not raw entries
- Target: all JSON files combined < 2MB
- Enable Vercel's built-in compression (gzip/brotli)
- Show a loading skeleton UI while data loads (not a blank screen)

---

## 7. Data Integrity Edge Cases

### EC-7.1: Pipeline run produces different results on re-run
**Scenario:** Running the pipeline twice on the same raw data produces different enrichment results (Gemini's non-determinism).
**What goes wrong:** Insights are not reproducible. Pain point rankings change between runs.
**Handling:**
- Set Gemini temperature to 0 for classification tasks (maximum determinism)
- Cache enrichment results — if an entry ID already exists in `all_enriched.json`, skip re-enriching it
- Log a hash of the pipeline output for each run for traceability

### EC-7.2: Data from different pipeline runs get mixed
**Scenario:** User runs the pipeline for Play Store, then later for Reddit, but forgets to re-run aggregation.
**What goes wrong:** Output JSON files are stale — they reflect only one source.
**Handling:**
- `run_pipeline.py` always runs the full pipeline (collect → clean → normalize → enrich → aggregate)
- If user runs `--step enrich`, warn: "Aggregation step not run. Output files may be stale."
- Add a `last_run` timestamp to each output JSON file

### EC-7.3: Reddit API credentials expire or are revoked
**Scenario:** Reddit app credentials are invalidated (user changes password, app is deleted).
**What goes wrong:** Collection step fails silently or with an opaque error.
**Handling:**
- Validate credentials at the start of collection: make a test API call
- If credentials are invalid: print a clear error with setup instructions link
- Don't proceed with collection — fail fast

---

## Summary: Top 10 Most Critical Edge Cases

| Rank | ID | Edge Case | Why Critical |
|---|---|---|---|
| 1 | EC-3.3 | Memory vs. search classification ambiguity | Wrong classification → wrong problem framing |
| 2 | EC-3.1 | Gemini returns invalid JSON | Crashes the pipeline |
| 3 | EC-2.2 | Single user dominates a pain point cluster | Skews frequency analysis |
| 4 | EC-3.6 | Gemini hallucinates pain point clusters | Breaks clustering logic |
| 5 | EC-5.1 | JSON files missing or malformed | Dashboard crashes |
| 6 | EC-4.2 | All geography is "Unknown" | Segmentation section useless |
| 7 | EC-3.5 | Gemini API rate limit hit | Pipeline stalls |
| 8 | EC-5.2 | Filters result in zero entries | Bad UX |
| 9 | EC-1.2 | Play Store returns zero reviews | Incomplete dataset |
| 10 | EC-7.1 | Non-deterministic pipeline results | Trust issue |

---

*Document Version: 1.0*
*Created: September 21, 2026*
