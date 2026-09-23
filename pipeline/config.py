"""
Configuration for the Discovery Engine data pipeline.
All shared constants, paths, and settings live here.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# ─────────────────────────────────────────────
# Date Range
# ─────────────────────────────────────────────
DATE_FROM = "2026-01-01"
DATE_TO = "2026-09-21"

# ─────────────────────────────────────────────
# API Keys (loaded from .env)
# ─────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ─────────────────────────────────────────────
# File Paths
# ─────────────────────────────────────────────
PIPELINE_DIR = Path(__file__).parent
DATA_DIR = PIPELINE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
CLEANED_DIR = DATA_DIR / "cleaned"
NORMALIZED_DIR = DATA_DIR / "normalized"
ENRICHED_DIR = DATA_DIR / "enriched"
OUTPUT_DIR = DATA_DIR / "output"

# Dashboard public data directory (for copying output)
DASHBOARD_DATA_DIR = PIPELINE_DIR.parent / "dashboard" / "public" / "data"

# ─────────────────────────────────────────────
# Apple App Store Configuration
# ─────────────────────────────────────────────
APP_STORE_APP_ID = "962194608"  # Google Photos iOS App ID
APP_STORE_MAX_PAGES = 10        # Max pages to fetch (50 items per page)

# ─────────────────────────────────────────────
# Google Photos Help Community Configuration
# ─────────────────────────────────────────────
COMMUNITY_URL = "https://support.google.com/photos/threads"

# ─────────────────────────────────────────────
# Play Store Configuration
# ─────────────────────────────────────────────
PLAY_STORE_APP_ID = "com.google.android.apps.photos"
PLAY_STORE_COUNTRIES = ["us", "in"]
PLAY_STORE_BATCH_SIZE = 200

# ─────────────────────────────────────────────
# Gemini Configuration
# ─────────────────────────────────────────────
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_BATCH_SIZE = 15
GEMINI_CONFIDENCE_THRESHOLD = 0.5
GEMINI_MAX_RETRIES = 3
GEMINI_RATE_LIMIT_RPM = 14  # Stay under 15 RPM free tier
GEMINI_TEMPERATURE = 0  # Maximum determinism for classification

# ─────────────────────────────────────────────
# Cleaning Configuration
# ─────────────────────────────────────────────
DEDUP_SIMILARITY_THRESHOLD = 0.85
MIN_WORD_COUNT = 10
MAX_QUOTE_LENGTH = 200  # Characters for dashboard display

RELEVANCE_KEYWORDS = [
    "photo", "picture", "image", "search", "find", "remember",
    "forgot", "album", "memory", "lost", "missing", "locate",
    "browse", "scroll", "look for", "can't find", "cannot find",
    "old photo", "retrieve", "retrieval",
]

SPAM_KEYWORDS = [
    "download now", "use code", "promo", "earn money", "click here",
    "free gift", "buy now", "discount", "coupon", "subscribe",
]

# ─────────────────────────────────────────────
# Pain Point Clusters (predefined for Gemini)
# ─────────────────────────────────────────────
PAIN_POINT_CLUSTERS = [
    "event_photo_retrieval",
    "temporal_recall",
    "person_based_retrieval",
    "location_based_recall",
    "object_document_retrieval",
    "shared_received_content",
    "screenshot_retrieval",
    "emotional_moment_recall",
    "activity_based_retrieval",
    "visual_attribute_recall",
]

# ─────────────────────────────────────────────
# Memory Cue Types
# ─────────────────────────────────────────────
MEMORY_CUE_TYPES = [
    "people",
    "places",
    "events",
    "time",
    "emotions",
    "objects",
    "activities",
    "context",
    "visual_attributes",
]

# ─────────────────────────────────────────────
# Severity Weights (for composite scoring)
# ─────────────────────────────────────────────
SEVERITY_WEIGHTS = {
    "critical": 4,
    "high": 3,
    "medium": 2,
    "low": 1,
}

# ─────────────────────────────────────────────
# Geography Inference Keywords
# ─────────────────────────────────────────────
INDIA_KEYWORDS = [
    "india", "indian", "mumbai", "delhi", "bangalore", "bengaluru",
    "hyderabad", "chennai", "kolkata", "pune", "jaipur", "goa",
    "kerala", "tamil", "hindi", "rupee", "₹", "rs.", "lakh", "crore",
    "diwali", "holi", "ganesh", "durga", "puja", "festival",
]

US_KEYWORDS = [
    "usa", "united states", "america", "american",
    "new york", "california", "texas", "florida", "chicago",
    "los angeles", "san francisco", "seattle", "boston",
    "dollar", "$", "thanksgiving", "halloween", "fourth of july",
]
