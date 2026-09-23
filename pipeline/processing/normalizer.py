import json
import logging
from datetime import datetime
from pathlib import Path

from config import CLEANED_DIR, NORMALIZED_DIR

logger = logging.getLogger(__name__)

class Normalizer:
    def __init__(self):
        self.cleaned_data = []
        self.normalized_data = []

    def load_cleaned(self):
        in_path = CLEANED_DIR / "all_cleaned.json"
        if not in_path.exists():
            logger.error(f"Cleaned data not found at {in_path}")
            return
            
        with open(in_path, "r", encoding="utf-8") as f:
            self.cleaned_data = json.load(f)

    def _normalize_date(self, date_str):
        if not date_str:
            return ""
        try:
            if isinstance(date_str, str) and "T" in date_str:
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                return dt.strftime("%Y-%m-%d")
        except:
            pass
        try:
            if isinstance(date_str, (int, float)):
                dt = datetime.fromtimestamp(date_str)
                return dt.strftime("%Y-%m-%d")
        except:
            pass
        return str(date_str)

    def normalize(self):
        logger.info("Normalizing data schemas...")
        for item in self.cleaned_data:
            source = item.get("_source", "unknown")
            norm_item = {
                "id": "",
                "source": source,
                "platform": "unknown",
                "geography": "unknown",
                "date": "",
                "text": "",
                "score": None
            }
            
            if source == "play_store":
                norm_item["id"] = f"playstore_{item.get('reviewId', '')}"
                norm_item["platform"] = "android"
                norm_item["geography"] = item.get("country", "unknown")
                norm_item["date"] = self._normalize_date(item.get("at"))
                norm_item["text"] = item.get("content", "")
                norm_item["score"] = item.get("score")
                
            elif source == "app_store":
                norm_item["id"] = f"appstore_{item.get('id', '')}"
                norm_item["platform"] = "ios"
                norm_item["geography"] = "us" # default to US storefront
                norm_item["date"] = self._normalize_date(item.get("date"))
                norm_item["text"] = f"{item.get('title', '')} \n {item.get('content', '')}"
                norm_item["score"] = item.get("score")
                
            elif source == "google_community":
                norm_item["id"] = f"community_{item.get('id', '')}"
                norm_item["platform"] = "web"
                norm_item["geography"] = "global"
                norm_item["date"] = self._normalize_date(item.get("date"))
                norm_item["text"] = item.get("content", "")
                norm_item["score"] = None
                
            elif source == "synthetic_memory":
                norm_item["id"] = item.get("id", "")
                norm_item["platform"] = "unknown"
                norm_item["geography"] = "unknown"
                norm_item["date"] = self._normalize_date(item.get("date"))
                norm_item["text"] = item.get("content", "")
                norm_item["score"] = item.get("score", 1)
                
            elif source == "google_actions":
                url = item.get("url", "")
                norm_item["id"] = f"action_{hash(url)}"
                norm_item["platform"] = "web"
                norm_item["geography"] = "global"
                norm_item["date"] = self._normalize_date(item.get("date"))
                norm_item["text"] = f"{item.get('title', '')} \n {item.get('description', '')}"
                norm_item["score"] = 5
                
            self.normalized_data.append(norm_item)

    def save_normalized(self):
        logger.info("Saving normalized data...")
        NORMALIZED_DIR.mkdir(parents=True, exist_ok=True)
        
        out_path = NORMALIZED_DIR / "all_normalized.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(self.normalized_data, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Saved {len(self.normalized_data)} normalized entries to {out_path}")

    def run(self):
        self.load_cleaned()
        if self.cleaned_data:
            self.normalize()
            self.save_normalized()
