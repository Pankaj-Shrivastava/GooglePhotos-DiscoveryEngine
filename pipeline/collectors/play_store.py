import logging
from datetime import datetime
from google_play_scraper import Sort, reviews

from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class PlayStoreCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "play_store"
        self.app_id = "com.google.android.apps.photos"
        self.countries = ["us", "in"]

    def collect(self) -> list[dict]:
        entries = []

        date_format = "%Y-%m-%d"
        from_date = datetime.strptime(self.date_from, date_format)
        to_date = datetime.strptime(self.date_to, date_format)

        for country in self.countries:
            logger.info(f"Fetching Play Store reviews for country: {country.upper()}")
            try:
                # Fetching 4000 reviews per country to reach 8000 total
                result, _ = reviews(
                    self.app_id,
                    lang='en',
                    country=country,
                    sort=Sort.NEWEST,
                    count=4000
                )

                for review in result:
                    # review['at'] is a datetime object
                    if from_date <= review['at'] <= to_date:
                        entries.append({
                            "reviewId": review['reviewId'],
                            "content": review['content'],
                            "score": review['score'],
                            "at": review['at'].isoformat(),
                            "thumbsUpCount": review['thumbsUpCount'],
                            "reviewCreatedVersion": review.get('reviewCreatedVersion', 'unknown'),
                            "country": country.upper()
                        })

            except Exception as e:
                logger.error(f"Error fetching Play Store reviews for {country}: {e}")

        return entries
