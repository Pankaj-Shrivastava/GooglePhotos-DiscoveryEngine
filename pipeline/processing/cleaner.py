import json
import logging
import re
from pathlib import Path
from collections import defaultdict
from langdetect import detect, LangDetectException

from config import RAW_DIR, CLEANED_DIR

logger = logging.getLogger(__name__)

class Cleaner:
    def __init__(self):
        self.raw_data = []
        self.cleaned_data = []
        self.report = {
            "initial_count": 0,
            "after_dedup": 0,
            "after_spam": 0,
            "after_lang": 0,
            "after_relevance": 0,
            "final_count": 0,
            "source_breakdown": defaultdict(int)
        }
        
        self.spam_keywords = ["download now", "promo", "discount", "click here", "subscribe", "buy now", "100% free"]
        self.relevance_keywords = ["photo", "picture", "image", "search", "find", "remember", "forgot", "album", "memory", "lost", "missing", "locate", "browse", "scroll", "look for", "can't find"]

    def _get_text(self, item):
        return item.get("content") or item.get("body") or item.get("description") or ""

    def load_raw(self):
        logger.info("Loading raw data...")
        files = list(RAW_DIR.glob("*.json"))
        for f in files:
            source = f.stem
            with open(f, "r", encoding="utf-8") as fh:
                try:
                    data = json.load(fh)
                    for item in data:
                        item['_source'] = source
                        self.raw_data.append(item)
                except Exception as e:
                    logger.error(f"Error loading {f.name}: {e}")
        
        self.report["initial_count"] = len(self.raw_data)
        logger.info(f"Loaded {self.report['initial_count']} raw entries.")

    def deduplicate(self):
        logger.info("Deduplicating...")
        unique_entries = []
        seen_texts = set()
        
        for item in self.raw_data:
            text = self._get_text(item).strip()
            if not text:
                continue
                
            text_lower = text.lower()
            if text_lower in seen_texts:
                continue
                
            seen_texts.add(text_lower)
            unique_entries.append(item)
            
        self.raw_data = unique_entries
        self.report["after_dedup"] = len(self.raw_data)
        
    def filter_spam(self):
        logger.info("Filtering spam...")
        filtered = []
        for item in self.raw_data:
            text = self._get_text(item).lower()
            words = text.split()
            
            if len(words) < 5:
                continue
                
            if any(spam_word in text for spam_word in self.spam_keywords):
                continue
                
            filtered.append(item)
            
        self.raw_data = filtered
        self.report["after_spam"] = len(self.raw_data)

    def filter_language(self):
        logger.info("Filtering language...")
        filtered = []
        for item in self.raw_data:
            text = self._get_text(item)
            try:
                if detect(text) == 'en':
                    filtered.append(item)
            except LangDetectException:
                pass
        
        self.raw_data = filtered
        self.report["after_lang"] = len(self.raw_data)

    def filter_relevance(self):
        logger.info("Filtering relevance...")
        filtered = []
        for item in self.raw_data:
            text = self._get_text(item).lower()
            if item.get("_source") == "google_actions":
                filtered.append(item)
                continue
                
            if any(keyword in text for keyword in self.relevance_keywords):
                filtered.append(item)
                
        self.raw_data = filtered
        self.report["after_relevance"] = len(self.raw_data)
        
    def scrub_pii(self):
        logger.info("Scrubbing PII...")
        email_pattern = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
        phone_pattern = re.compile(r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}')
        mention_pattern = re.compile(r'@\w+')
        
        for item in self.raw_data:
            text = self._get_text(item)
            text = email_pattern.sub('[REDACTED_EMAIL]', text)
            text = phone_pattern.sub('[REDACTED_PHONE]', text)
            text = mention_pattern.sub('[REDACTED_USER]', text)
            
            if "content" in item: item["content"] = text
            if "body" in item: item["body"] = text
            if "description" in item: item["description"] = text
            
            self.cleaned_data.append(item)
            self.report["source_breakdown"][item["_source"]] += 1
            
        self.report["final_count"] = len(self.cleaned_data)

    def save_cleaned(self):
        logger.info("Saving cleaned data...")
        CLEANED_DIR.mkdir(parents=True, exist_ok=True)
        
        out_path = CLEANED_DIR / "all_cleaned.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(self.cleaned_data, f, indent=2, ensure_ascii=False)
            
        report_path = CLEANED_DIR / "cleaning_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(self.report, f, indent=2)
            
        logger.info(f"Saved {len(self.cleaned_data)} cleaned entries to {out_path}")
        logger.info(f"Report: {self.report}")

    def run(self):
        self.load_raw()
        self.deduplicate()
        self.filter_spam()
        self.filter_language()
        self.filter_relevance()
        self.scrub_pii()
        self.save_cleaned()
