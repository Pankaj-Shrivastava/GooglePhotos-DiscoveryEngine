import os
import logging
from datetime import datetime, timezone
import praw

from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class RedditCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "reddit"
        self.subreddits = ["googlephotos", "google", "Android", "ios", "photography"]
        self.queries = [
            '"google photos" find',
            '"google photos" search',
            '"google photos" remember',
            '"google photos" lost',
            '"google photos" missing',
            '"google photos" album',
            '"google photos" memory',
            '"google photos" photo'
        ]

    def collect(self) -> list[dict]:
        client_id = os.getenv("REDDIT_CLIENT_ID")
        client_secret = os.getenv("REDDIT_CLIENT_SECRET")
        user_agent = os.getenv("REDDIT_USER_AGENT", "DiscoveryEngine/1.0")

        if not client_id or not client_secret or client_id == "your_id":
            logger.warning("Reddit API credentials missing or default in .env. Skipping Reddit collection.")
            return []

        try:
            reddit = praw.Reddit(
                client_id=client_id,
                client_secret=client_secret,
                user_agent=user_agent
            )
        except Exception as e:
            logger.error(f"Failed to initialize PRAW: {e}")
            return []

        entries = []
        seen_ids = set()

        date_format = "%Y-%m-%d"
        from_ts = datetime.strptime(self.date_from, date_format).replace(tzinfo=timezone.utc).timestamp()
        to_ts = datetime.strptime(self.date_to, date_format).replace(tzinfo=timezone.utc).timestamp()

        for sub_name in self.subreddits:
            logger.info(f"Searching subreddit: {sub_name}")
            try:
                subreddit = reddit.subreddit(sub_name)
                for query in self.queries:
                    for submission in subreddit.search(query, limit=200):
                        if submission.id in seen_ids:
                            continue

                        if not (from_ts <= submission.created_utc <= to_ts):
                            continue

                        entries.append({
                            "id": submission.id,
                            "subreddit": sub_name,
                            "title": submission.title,
                            "body": submission.selftext,
                            "score": submission.score,
                            "num_comments": submission.num_comments,
                            "created_utc": submission.created_utc,
                            "url": submission.url,
                            "author": str(submission.author) if submission.author else "[deleted]"
                        })
                        seen_ids.add(submission.id)
            except Exception as e:
                logger.error(f"Error scraping subreddit {sub_name}: {e}")

        return entries
