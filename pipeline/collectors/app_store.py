import os
import logging
import time
import requests
from datetime import datetime

from config import (
    APP_STORE_APP_ID,
    APP_STORE_MAX_PAGES
)
from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class AppStoreCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "app_store"
        self.app_id = APP_STORE_APP_ID
        self.base_url = f"https://itunes.apple.com/us/rss/customerreviews/id={self.app_id}/sortBy=mostRecent"
        
    def collect(self):
        logger.info(f"Starting App Store collection for App ID {self.app_id}")
        entries_list = []
        seen_ids = set()
        
        for page in range(1, APP_STORE_MAX_PAGES + 1):
            url = f"{self.base_url}/page={page}/json"
            logger.info(f"Fetching App Store reviews page {page}...")
            
            try:
                resp = requests.get(url, timeout=15)
                resp.raise_for_status()
                data = resp.json()
            except Exception as e:
                logger.error(f"Failed to fetch {url}: {e}")
                break
                
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                logger.info("No more entries found in the RSS feed.")
                break
                
            # RSS feed returns a dict for the first entry sometimes or list. It's usually a list.
            if isinstance(entries, dict):
                entries = [entries]
                
            for entry in entries:
                # The first entry in the feed is often metadata about the app itself.
                # Actual reviews have an 'author' field.
                if "author" not in entry:
                    continue
                    
                review_id = entry.get("id", {}).get("label", "")
                
                # Check for duplicates
                if review_id in seen_ids:
                    continue
                seen_ids.add(review_id)
                    
                # Extract data
                title = entry.get("title", {}).get("label", "")
                content = entry.get("content", {}).get("label", "")
                rating_str = entry.get("im:rating", {}).get("label", "0")
                version = entry.get("im:version", {}).get("label", "")
                author = entry.get("author", {}).get("name", {}).get("label", "")
                date_str = entry.get("updated", {}).get("label", "")
                
                try:
                    rating = int(rating_str)
                except ValueError:
                    rating = 0
                    
                entries_list.append({
                    "id": review_id,
                    "title": title,
                    "content": content,
                    "score": rating,
                    "version": version,
                    "author": author,
                    "date": date_str
                })
                
            # Be nice to the API
            time.sleep(1.0)
            
        return entries_list
