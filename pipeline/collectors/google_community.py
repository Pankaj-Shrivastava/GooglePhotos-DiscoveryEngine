import os
import logging
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone

from config import COMMUNITY_URL
from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class GoogleCommunityCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "google_community"
        self.base_url = COMMUNITY_URL
        
    def collect(self):
        logger.info(f"Starting Google Community collection from {self.base_url}")
        entries_list = []
        seen_ids = set()
        
        try:
            resp = requests.get(self.base_url, timeout=15)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            threads = soup.find_all('a', class_='thread-list-thread')
            
            if not threads:
                logger.warning("No threads found. The HTML structure might have changed.")
                
            for t in threads:
                href = t.get('href', '')
                thread_id = href.split('/')[3] if len(href.split('/')) > 3 else href
                
                if thread_id in seen_ids:
                    continue
                seen_ids.add(thread_id)
                    
                text_content = t.text.strip()
                
                # We do not get exact dates from the thread list, so we'll use current UTC date
                # as an approximation for recent threads.
                date_str = datetime.now(timezone.utc).isoformat()
                
                entries_list.append({
                    "id": thread_id,
                    "url": f"https://support.google.com{href}",
                    "content": text_content,
                    "date": date_str
                })
                
            return entries_list
            
        except Exception as e:
            logger.error(f"Failed to collect from Google Community: {e}")
            return entries_list
