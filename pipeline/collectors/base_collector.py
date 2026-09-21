"""
Abstract base class for all data collectors.
Each source-specific collector inherits from this and implements collect().
"""

import json
import logging
import time
from abc import ABC, abstractmethod
from pathlib import Path

from config import RAW_DIR, DATE_FROM, DATE_TO

logger = logging.getLogger(__name__)


class BaseCollector(ABC):
    """Base class for all data source collectors."""

    def __init__(self):
        self.source_name: str = ""  # Override in subclass
        self.date_from: str = DATE_FROM
        self.date_to: str = DATE_TO
        self.entries: list[dict] = []

    @abstractmethod
    def collect(self) -> list[dict]:
        """
        Fetch raw data from the source.
        Returns a list of raw entry dicts.
        Must be implemented by each collector.
        """
        raise NotImplementedError

    def save(self, entries: list[dict] | None = None) -> Path:
        """Save raw entries to pipeline/data/raw/{source_name}.json"""
        data = entries if entries is not None else self.entries
        output_path = RAW_DIR / f"{self.source_name}.json"
        RAW_DIR.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)

        logger.info(f"Saved {len(data)} entries to {output_path}")
        return output_path

    def run(self) -> list[dict]:
        """Run collection and save results. Returns collected entries."""
        start_time = time.time()
        logger.info(f"Starting collection from {self.source_name}...")

        try:
            self.entries = self.collect()
            self.save()
            elapsed = time.time() - start_time
            logger.info(
                f"Collected {len(self.entries)} entries from {self.source_name} "
                f"in {elapsed:.1f}s"
            )
        except Exception as e:
            logger.error(f"Collection failed for {self.source_name}: {e}")
            raise

        return self.entries
