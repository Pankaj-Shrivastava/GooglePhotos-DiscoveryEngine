"""
Main entry point for the Discovery Engine data pipeline.
Runs all pipeline steps in sequence: collect → clean → normalize → enrich → aggregate.

Usage:
    python run_pipeline.py                    # Run full pipeline
    python run_pipeline.py --step collect     # Run only collection
    python run_pipeline.py --step clean       # Run only cleaning
    python run_pipeline.py --step normalize   # Run only normalization
    python run_pipeline.py --step enrich      # Run only enrichment
    python run_pipeline.py --step aggregate   # Run only aggregation
    python run_pipeline.py --source reddit    # Collect from specific source
    python run_pipeline.py --source play_store
    python run_pipeline.py --source all       # Collect from all sources (default)
"""

import argparse
import json
import shutil
import sys
import time
from pathlib import Path

# Fix Windows console unicode printing issues
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from config import (
    RAW_DIR,
    CLEANED_DIR,
    NORMALIZED_DIR,
    ENRICHED_DIR,
    OUTPUT_DIR,
    DASHBOARD_DATA_DIR,
)


def ensure_directories():
    """Create all required data directories if they don't exist."""
    for directory in [RAW_DIR, CLEANED_DIR, NORMALIZED_DIR, ENRICHED_DIR, OUTPUT_DIR]:
        directory.mkdir(parents=True, exist_ok=True)
    print("✓ Data directories ready")


def step_collect(source: str = "all"):
    """Step 1: Collect raw data from sources."""
    print("\n" + "=" * 60)
    print("STEP 1: DATA COLLECTION")
    print("=" * 60)

    from collectors.reddit import RedditCollector
    from collectors.play_store import PlayStoreCollector
    from collectors.google_actions import GoogleActionsCollector

    if source in ("all", "reddit"):
        RedditCollector().run()

    if source in ("all", "play_store"):
        PlayStoreCollector().run()

    if source in ("all", "google_actions"):
        GoogleActionsCollector().run()

    print("✓ Collection step complete")


def step_clean():
    """Step 2: Clean and deduplicate raw data."""
    print("\n" + "=" * 60)
    print("STEP 2: CLEANING & DEDUPLICATION")
    print("=" * 60)

    # TODO: Implement in M2
    # from processing.cleaner import Cleaner
    print("  → Cleaner: Not yet implemented (M2)")
    print("✓ Cleaning step complete (skeleton)")


def step_normalize():
    """Step 3: Normalize to unified schema."""
    print("\n" + "=" * 60)
    print("STEP 3: NORMALIZATION")
    print("=" * 60)

    # TODO: Implement in M2
    # from processing.normalizer import Normalizer
    print("  → Normalizer: Not yet implemented (M2)")
    print("✓ Normalization step complete (skeleton)")


def step_enrich():
    """Step 4: AI-powered enrichment via Gemini."""
    print("\n" + "=" * 60)
    print("STEP 4: AI ENRICHMENT (Gemini)")
    print("=" * 60)

    # TODO: Implement in M3
    # from processing.enricher import GeminiEnricher
    print("  → Enricher: Not yet implemented (M3)")
    print("✓ Enrichment step complete (skeleton)")


def step_aggregate():
    """Step 5: Aggregate insights and generate output files."""
    print("\n" + "=" * 60)
    print("STEP 5: AGGREGATION & INSIGHT GENERATION")
    print("=" * 60)

    # TODO: Implement in M4
    # from analysis.aggregator import Aggregator
    print("  → Aggregator: Not yet implemented (M4)")
    print("✓ Aggregation step complete (skeleton)")


def copy_to_dashboard():
    """Copy output files to dashboard public/data/ directory."""
    print("\n" + "=" * 60)
    print("STEP 6: COPY TO DASHBOARD")
    print("=" * 60)

    if not OUTPUT_DIR.exists():
        print("  ⚠ No output directory found. Run the full pipeline first.")
        return

    output_files = list(OUTPUT_DIR.glob("*.json"))
    if not output_files:
        print("  ⚠ No output JSON files found. Run the full pipeline first.")
        return

    DASHBOARD_DATA_DIR.mkdir(parents=True, exist_ok=True)

    for f in output_files:
        dest = DASHBOARD_DATA_DIR / f.name
        shutil.copy2(f, dest)
        print(f"  → Copied {f.name}")

    print(f"✓ {len(output_files)} files copied to {DASHBOARD_DATA_DIR}")


def print_summary():
    """Print a final summary of the pipeline run."""
    print("\n" + "=" * 60)
    print("PIPELINE SUMMARY")
    print("=" * 60)

    # Count files in each stage
    stages = {
        "Raw": RAW_DIR,
        "Cleaned": CLEANED_DIR,
        "Normalized": NORMALIZED_DIR,
        "Enriched": ENRICHED_DIR,
        "Output": OUTPUT_DIR,
    }

    for stage_name, stage_dir in stages.items():
        if stage_dir.exists():
            json_files = list(stage_dir.glob("*.json"))
            total_entries = 0
            for f in json_files:
                try:
                    with open(f, "r", encoding="utf-8") as fh:
                        data = json.load(fh)
                        if isinstance(data, list):
                            total_entries += len(data)
                        elif isinstance(data, dict) and "entries" in data:
                            total_entries += len(data["entries"])
                except (json.JSONDecodeError, KeyError):
                    pass
            print(f"  {stage_name:12s}: {len(json_files)} files, ~{total_entries} entries")
        else:
            print(f"  {stage_name:12s}: (not created yet)")

    print("\n✓ Pipeline run complete!")


def main():
    parser = argparse.ArgumentParser(
        description="Discovery Engine Data Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--step",
        choices=["collect", "clean", "normalize", "enrich", "aggregate", "copy"],
        help="Run a specific pipeline step (default: run all steps)",
    )
    parser.add_argument(
        "--source",
        choices=["reddit", "play_store", "google_actions", "all"],
        default="all",
        help="Which source to collect from (default: all)",
    )
    args = parser.parse_args()

    print("Discovery Engine — Data Pipeline")
    print(f"   Started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    ensure_directories()

    if args.step:
        # Run a specific step
        step_map = {
            "collect": lambda: step_collect(args.source),
            "clean": step_clean,
            "normalize": step_normalize,
            "enrich": step_enrich,
            "aggregate": step_aggregate,
            "copy": copy_to_dashboard,
        }
        step_map[args.step]()
    else:
        # Run full pipeline
        step_collect(args.source)
        step_clean()
        step_normalize()
        step_enrich()
        step_aggregate()
        copy_to_dashboard()

    print_summary()


if __name__ == "__main__":
    main()
