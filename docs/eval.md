# Evaluation Criteria — AI-Powered Discovery Engine

> How we measure whether the engine is working correctly and delivering trustworthy insights.

---

## 1. Pipeline Evaluation

### 1.1 Data Collection Quality

| Metric | Target | How to Measure |
|---|---|---|
| **Entry count** (P0 sources) | 1,000–5,000 raw entries | Count entries in `data/raw/*.json` |
| **Date range coverage** | Jan 2026 – Sep 2026 (no gaps > 30 days) | Histogram of entries by month |
| **Source balance** | No single source > 80% of total entries | `count_by_source / total` |
| **Minimum Reddit entries** | ≥ 400 | Count entries in `reddit.json` |
| **Minimum Play Store entries** | ≥ 500 | Count entries in `play_store.json` |
| **No empty fields** | < 5% of entries have empty `text` field | Validate after collection |

**Evaluation script:**
```python
def evaluate_collection(raw_dir):
    # Count entries per source
    # Plot date distribution histogram
    # Flag sources with < 100 entries
    # Flag months with zero entries
    # Report empty text field %
```

---

### 1.2 Cleaning Effectiveness

| Metric | Target | How to Measure |
|---|---|---|
| **Duplicate removal rate** | 5–15% of raw entries removed | `(raw - deduped) / raw` |
| **Spam removal rate** | 5–10% removed | Count after spam filter step |
| **Relevance retention rate** | ≥ 40% of raw data survives relevance filtering | `cleaned / raw` |
| **False positive check** | < 5% of removed entries were actually relevant | Manually review 50 removed entries |
| **False negative check** | < 5% of kept entries are irrelevant | Manually review 50 kept entries |
| **PII scrub coverage** | 0 emails/phone numbers remaining in cleaned data | Regex scan of cleaned output |

> [!IMPORTANT]
> If relevance filtering removes > 70% of data, the keyword allowlist is too aggressive. If it removes < 20%, it's too permissive. Either case needs tuning.

**Evaluation script:**
```python
def evaluate_cleaning(raw_data, cleaned_data, removed_data):
    # Compute removal rates per filter step
    # Sample 50 removed entries → manually label as "correct removal" or "false positive"
    # Sample 50 kept entries → manually label as "relevant" or "false negative"
    # Regex scan cleaned data for residual PII
```

---

### 1.3 Normalization Accuracy

| Metric | Target | How to Measure |
|---|---|---|
| **Schema compliance** | 100% of entries match unified schema | JSON schema validation |
| **Date format compliance** | 100% ISO 8601 | Regex check `^\d{4}-\d{2}-\d{2}$` |
| **Geography inference accuracy** | ≥ 70% correct (on manually labeled sample) | Manually label 50 entries, compare to inferred |
| **Platform inference accuracy** | ≥ 80% correct | Manually label 50 entries, compare to inferred |
| **No ID collisions** | 0 duplicate IDs in normalized dataset | `len(ids) == len(set(ids))` |
| **"Unknown" geography rate** | < 50% of entries | Count `geography == "Unknown"` |

---

### 1.4 AI Enrichment Quality

This is the **most critical evaluation** — if enrichment is wrong, all insights are wrong.

| Metric | Target | How to Measure |
|---|---|---|
| **Memory vs. search classification accuracy** | ≥ 85% agreement with human labels | Manually label 100 entries, compare to Gemini |
| **Pain point cluster accuracy** | ≥ 75% agreement | Manually label 100 entries, compare |
| **Memory cue tagging precision** | ≥ 80% (tagged cues are actually present in text) | Review 50 entries — are tagged cues supported by the text? |
| **Memory cue tagging recall** | ≥ 70% (cues present in text are tagged) | Review 50 entries — are obvious cues missed? |
| **Severity scoring consistency** | Cohen's kappa ≥ 0.6 with human ratings | 2 human raters + Gemini on 50 entries |
| **Average confidence score** | ≥ 0.7 | Mean of all `confidence` values |
| **Low confidence entries** | < 10% of total | Count `confidence < 0.5` |
| **Batch success rate** | ≥ 95% of batches return valid JSON | `successful_batches / total_batches` |

**Evaluation protocol:**
1. Randomly sample 100 entries from `all_enriched.json`
2. Two human reviewers independently label each entry for:
   - `problem_type` (memory / search / other / not_a_problem)
   - `pain_point_cluster` (from predefined list)
   - `memory_cues` (list of cue types present)
   - `severity` (critical / high / medium / low)
3. Compare human labels to Gemini labels
4. Compute accuracy, precision, recall, and inter-rater agreement (Cohen's kappa)
5. If accuracy < target, iterate on the prompt

**Prompt iteration cycle:**
```
Evaluate → Identify error patterns → Refine prompt → Re-run batch → Re-evaluate
```

---

### 1.5 Aggregation Correctness

| Metric | Target | How to Measure |
|---|---|---|
| **Pain point count matches** | Sum of entries across clusters = total memory entries | `sum(cluster_counts) == memory_entries` |
| **Frequency counts are correct** | Spot-check 3 clusters manually | Count entries with matching `pain_point_cluster` in enriched data |
| **Severity scores are reasonable** | No cluster has severity out of expected range | Verify weighted averages |
| **Opportunity areas have evidence** | Every opportunity links to ≥ 2 pain points | Check `supporting_pain_points` arrays |
| **Interview guides are grounded** | Questions reference actual discovered pain points | Read 2 full interview guides |
| **No data leakage** | Out-of-scope entries (search/other) don't appear in pain point analysis | Filter check |
| **All 9 output files present** | 9 files in `data/output/` | File existence check |

---

## 2. Dashboard Evaluation

### 2.1 Functional Correctness

| Criterion | Pass Condition |
|---|---|
| **Data loading** | All 9 JSON files load without errors. Loading spinner shown while loading. |
| **Routing** | All 7 routes render the correct section. 404 redirects to `/`. |
| **Deep links** | Pasting a route URL (e.g., `/opportunities`) directly navigates to that section. |
| **Filters** | Selecting a filter updates all visible data in the current section. |
| **Filter persistence** | Filters persist when navigating between routes. |
| **Filter reset** | "Reset filters" clears all filters and shows unfiltered data. |
| **Sort** | Sort options (severity, frequency) correctly reorder items. |
| **External links** | Source URL links open in a new tab. |
| **Empty states** | Filtering to zero results shows an "empty state" message, not a broken UI. |

### 2.2 Section-Specific Checks

| Section | What to Verify |
|---|---|
| **Pain Points** | Cards rank by severity. Quotes have source attribution. Severity badges are color-coded. |
| **Opportunities** | Impact scores visible. Primary recommendation is highlighted. Links to supporting pain points work. |
| **Frameworks** | All 6 charts render. Charts respond to filters. Gap analysis matrix is populated. |
| **References** | Table sorts correctly. External links work. Pain point mapping is accurate. |
| **Google Actions** | Feature list is populated. Gap indicators show which pain points are unaddressed. |
| **Segmentation** | US vs India charts show different distributions. Behavioral segments are populated. |
| **Interview Guides** | Accordions expand/collapse. Questions are grouped by pain point. Probes are visible. |

### 2.3 Export Evaluation

| Criterion | Pass Condition |
|---|---|
| **PDF generates** | Clicking "Export PDF" produces a downloadable PDF file |
| **PDF content** | PDF includes all sections with header, footer, page numbers |
| **PDF readability** | Charts are legible, text is not cut off, tables are formatted |
| **CSV generates** | Clicking "Export CSV" produces a downloadable CSV file |
| **CSV completeness** | CSV includes data from all sections |
| **CSV parseability** | CSV opens correctly in Excel/Google Sheets without formatting errors |

### 2.4 Performance

| Metric | Target |
|---|---|
| **Initial page load** | < 3 seconds (including JSON fetch) |
| **Route navigation** | < 200ms |
| **Filter application** | < 500ms (no visible lag) |
| **PDF export time** | < 15 seconds |
| **Largest JSON file** | < 2MB (browser-friendly) |

### 2.5 Deployment Checks

| Criterion | Pass Condition |
|---|---|
| **Vercel build succeeds** | `npm run build` exits with code 0 |
| **All routes work on Vercel** | Direct navigation to any route loads correctly (SPA fallback) |
| **Data files served** | JSON files in `/data/` are accessible on deployed URL |
| **No console errors** | Browser console shows no JavaScript errors on any route |
| **HTTPS** | Deployed URL uses HTTPS |

---

## 3. Insight Quality Evaluation

> Beyond technical correctness — are the insights actually useful for a PM?

### 3.1 Pain Point Validity

| Criterion | How to Evaluate |
|---|---|
| **Are the pain points real?** | Each pain point should be supported by ≥ 3 distinct user quotes from ≥ 2 sources |
| **Are they memory problems (not search)?** | Verify top 10 pain points are clearly about incomplete/fuzzy memory, not keyword search failures |
| **Are they distinguishable?** | No two pain point clusters should be >80% overlapping in content |
| **Are they actionable?** | A PM should be able to imagine a product solution for each pain point |
| **Are severity ratings believable?** | "Critical" pain points should describe complete retrieval failures, not minor annoyances |

### 3.2 Opportunity Area Validity

| Criterion | How to Evaluate |
|---|---|
| **Evidence-backed** | Every opportunity traces to ≥ 2 pain point clusters with ≥ 50 combined entries |
| **Non-obvious** | At least 2 opportunities should reveal something a PM wouldn't discover from casual review reading |
| **Distinct from each other** | Opportunities should represent different solution directions, not variations of the same idea |
| **Primary recommendation justified** | The top-ranked opportunity should have the highest combined evidence + severity |

### 3.3 Interview Guide Usefulness

| Criterion | How to Evaluate |
|---|---|
| **Questions are open-ended** | No yes/no questions. All start with "How", "What", "Tell me about", "Describe" |
| **Questions are grounded** | Each question relates to a discovered pain point, not generic UX questions |
| **Probes add depth** | Follow-up probes dig deeper into the specific scenario, not repeat the question |
| **Scenarios are realistic** | Scenario prompts describe situations that real users encounter |
| **Coverage** | At least one question per top-5 pain point |

### 3.4 Segmentation Validity

| Criterion | How to Evaluate |
|---|---|
| **Geographic differences are real** | US vs India should show at least 2 pain points with meaningfully different rankings |
| **Behavioral segments are distinguishable** | Each segment should have at least 1 unique top pain point |
| **Not dominated by "Unknown"** | Geography should be inferred for ≥ 50% of entries |

---

## 4. End-to-End Evaluation Checklist

Run this before every Vercel deployment:

- [ ] Pipeline runs end-to-end without errors (`python run_pipeline.py`)
- [ ] All 9 output JSON files are generated
- [ ] Cleaning report shows reasonable filter rates (40–60% retained)
- [ ] Enrichment quality: ≥ 85% memory/search accuracy (spot-check 30)
- [ ] Dashboard loads with real data (`npm run dev`)
- [ ] All 7 routes render correctly
- [ ] Filters work across all sections
- [ ] PDF export produces a readable document
- [ ] CSV export opens in Google Sheets without errors
- [ ] Top 3 pain points make intuitive sense (PM gut-check)
- [ ] Primary opportunity recommendation is justified by evidence
- [ ] No PII visible anywhere in the dashboard
- [ ] No console errors in browser
- [ ] Vercel build succeeds and deployed site works

---

*Document Version: 1.0*
*Created: September 21, 2026*
