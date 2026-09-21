import json
import logging
import os
import time
from pathlib import Path

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from config import NORMALIZED_DIR, ENRICHED_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class GeminiEnricher:
    def __init__(self, limit=None):
        self.limit = limit
        self.normalized_data = []
        self.enriched_data = []
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_key_here":
            logger.error("Invalid GEMINI_API_KEY in .env")
            raise ValueError("Invalid GEMINI_API_KEY")
            
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3.6-flash',
                                          generation_config={"response_mime_type": "application/json"})
        
    def load_normalized(self):
        in_path = NORMALIZED_DIR / "all_normalized.json"
        if not in_path.exists():
            logger.error(f"Normalized data not found at {in_path}")
            return
            
        with open(in_path, "r", encoding="utf-8") as f:
            self.normalized_data = json.load(f)
            
        # Check for existing enriched data to resume
        out_path = ENRICHED_DIR / "all_enriched.json"
        self.already_enriched = {}
        if out_path.exists():
            with open(out_path, "r", encoding="utf-8") as f:
                try:
                    existing = json.load(f)
                    for item in existing:
                        if "problem_type" in item:
                            self.already_enriched[item["id"]] = item
                except:
                    pass
        
        # Filter out already enriched items from the batching pool, but we must keep them in self.enriched_data
        # Actually, self.enriched_data should start with the already enriched ones.
        self.enriched_data = list(self.already_enriched.values())
        
        # Keep only items not already enriched
        self.normalized_data = [item for item in self.normalized_data if item["id"] not in self.already_enriched]
            
        if self.limit:
            self.normalized_data = self.normalized_data[:self.limit]
            
        logger.info(f"Loaded {len(self.normalized_data)} NEW entries for enrichment (Skipping {len(self.already_enriched)} already enriched).")

    def build_prompt(self, batch):
        batch_json = json.dumps([{"id": item["id"], "text": item["text"]} for item in batch], ensure_ascii=False)
        prompt = f"""You are a UX research AI analyzing user feedback for Google Photos.
Read the following JSON list of user feedback items.
For each item, extract the following schema.
Output a JSON array of objects with the exact same 'id' and these fields:
- "problem_type": string (must be one of: "memory", "search", "other", "not_a_problem"). "memory" means they forgot a detail and are trying to retrieve a memory. "search" means the search engine failed them.
- "pain_point_cluster": string. A concise 3-6 word summary of the core UX issue (e.g., "Can't find old screenshots", "Forgets exact date", "Face recognition failed").
- "memory_cues": list of strings. What details did the user remember? (e.g., ["location", "people", "visual description"]). Empty list if none.
- "severity": string (must be one of: "critical", "high", "medium", "low").
- "confidence": float between 0.0 and 1.0 representing your confidence in this extraction.

Input Data:
{batch_json}

Return ONLY a valid JSON array of objects.
"""
        return prompt

    def process_batches(self, batch_size=20):
        logger.info(f"Processing in batches of {batch_size}...")
        
        for i in range(0, len(self.normalized_data), batch_size):
            batch = self.normalized_data[i:i+batch_size]
            logger.info(f"Processing batch {i//batch_size + 1}/{(len(self.normalized_data) + batch_size - 1)//batch_size}...")
            
            prompt = self.build_prompt(batch)
            
            try:
                for attempt in range(3):
                    try:
                        response = self.model.generate_content(
                            prompt,
                            safety_settings={
                                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                            }
                        )
                        
                        try:
                            results = json.loads(response.text)
                        except json.JSONDecodeError:
                            text = response.text
                            if text.startswith("```json"):
                                text = text[7:-3]
                            results = json.loads(text.strip())
                            
                        results_map = {res["id"]: res for res in results if "id" in res}
                        
                        for item in batch:
                            enriched_item = item.copy()
                            if item["id"] in results_map:
                                enriched_item.update(results_map[item["id"]])
                            self.enriched_data.append(enriched_item)
                            
                        break
                    except Exception as e:
                        logger.warning(f"Attempt {attempt+1} failed: {e}")
                        time.sleep(2)
                        if attempt == 2:
                            logger.error(f"Failed to process batch after 3 attempts.")
                            self.enriched_data.extend(batch)
            except Exception as e:
                 logger.error(f"Fatal error on batch: {e}")
                 
            # Simple rate limiting pause (15 RPM limit for free tier -> 4s between requests)
            time.sleep(5)

    def save_enriched(self):
        logger.info("Saving enriched data...")
        ENRICHED_DIR.mkdir(parents=True, exist_ok=True)
        
        out_path = ENRICHED_DIR / "all_enriched.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(self.enriched_data, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Saved {len(self.enriched_data)} enriched entries to {out_path}")

    def run(self):
        self.load_normalized()
        if self.normalized_data:
            self.process_batches()
            self.save_enriched()
