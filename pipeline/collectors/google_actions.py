import logging
import requests
from bs4 import BeautifulSoup
from datetime import datetime

from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class GoogleActionsCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "google_actions"

    def collect(self) -> list[dict]:
        entries = []

        # DuckDuckGo HTML search endpoint
        url = "https://html.duckduckgo.com/html/"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        queries = [
            "site:9to5google.com Google Photos 2026 update",
            "site:theverge.com Google Photos 2026 feature",
            "site:androidauthority.com Google Photos 2026 announcement",
            "site:blog.google Google Photos 2026"
        ]

        for query in queries:
            logger.info(f"Scraping query: {query}")
            try:
                response = requests.post(url, data={'q': query}, headers=headers, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    results = soup.find_all('div', class_='result')

                    for result in results:
                        title_elem = result.find('a', class_='result__a')
                        snippet_elem = result.find('a', class_='result__snippet')
                        url_elem = result.find('a', class_='result__url')

                        if title_elem and snippet_elem and url_elem:
                            href = url_elem.get('href', '')
                            # DuckDuckGo wraps links sometimes, try to extract direct URL if so
                            if "uddg=" in href:
                                import urllib.parse
                                parsed = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                                href = parsed.get("uddg", [href])[0]
                                
                            entries.append({
                                "title": title_elem.text.strip(),
                                "description": snippet_elem.text.strip(),
                                "url": href,
                                "date": datetime.now().isoformat()
                            })
                else:
                    logger.warning(f"DuckDuckGo returned status code {response.status_code}")
            except Exception as e:
                logger.error(f"Error scraping {query}: {e}")

        return entries
