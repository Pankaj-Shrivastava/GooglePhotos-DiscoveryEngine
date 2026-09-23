import json
import logging
from datetime import datetime, timezone
import uuid

from collectors.base_collector import BaseCollector

logger = logging.getLogger(__name__)

class SyntheticMemoryCollector(BaseCollector):
    def __init__(self):
        super().__init__()
        self.source_name = "synthetic_memory"
        
    def collect(self):
        logger.info("Generating synthetic memory problem data...")
        
        # Highly realistic user feedback demonstrating the "memory problem"
        # as defined in docs/context.md
        synthetic_feedback = [
            "I know I took a picture of that small café we went to during our Goa trip last year, but I can't find it. If I search 'Goa' it shows 500 photos, and I don't remember the name of the place to search for it.",
            "I'm looking for the picture of the medicine I took when I was sick last year. I remember the bottle was blue and it was sometime in the winter, but searching 'medicine' or 'blue' gives me nothing. I have to scroll through thousands of photos.",
            "Trying to find that funny face my daughter made at someone's birthday party. I don't remember whose party it was or exactly when, just that she was wearing a red dress and laughing. Google Photos is useless for this.",
            "I need the screenshot of that recipe someone sent me. I know it's in here somewhere, but I have no visual memory of the photo itself, just that it was a pasta recipe. Can't find it anywhere.",
            "I remember taking a photo of a really cool vintage car parked on a street in San Francisco, but that was like 3 years ago. I search 'car' and 'San Francisco' but it misses so many photos. I know it exists!",
            "I am trying to find a picture of my grandmother holding my son when he was a baby. I don't remember the date. I tried searching 'grandmother' but it only shows recent photos. The facial recognition isn't picking her up in older, blurry photos.",
            "Why can't I search by feeling? I'm looking for a photo from our anniversary dinner where the lighting was really romantic and dark. Searching 'dinner' just gives me food pictures.",
            "I took a picture of a receipt for a TV I bought, maybe 2024 or 2025. I remember the receipt was crumpled on a wooden table. Searching 'receipt' pulls up 100 things but not this one.",
            "Looking for a group photo from a conference. I remember I was standing next to a guy in a bright yellow shirt, but I don't remember the conference name or the city. I wish I could search for 'guy in yellow shirt'.",
            "I have a distinct memory of a photo where my dog is jumping into a lake. I search 'dog lake' or 'dog jumping' but Google Photos doesn't find it. I have 10,000 photos of my dog, I can't scroll through all of them.",
            "I'm trying to find a specific photo of a sunset. I remember the sky was incredibly purple and orange, and there were silhouettes of palm trees. Searching 'sunset' gives me hundreds of sunsets. I need to find THAT specific one.",
            "There's a photo of my friends and I at a concert. I remember the stage lights were crazy bright green. I don't remember the band or the year. I just remember the green lights and how happy we were.",
            "I photographed a handwritten note from my mom years ago. It was on yellow lined paper. Searching 'note' or 'handwriting' doesn't find it. I know it's there somewhere.",
            "I need to find a picture of my old apartment's living room before I painted it. I remember the old couch was in it. But I don't have a location tag and the date could be anywhere from 2018 to 2020.",
            "Trying to find a meme I saved about Monday mornings. I don't remember the exact text, just that it had a cat looking exhausted. Searching 'cat' shows my actual pets.",
        ]
        
        entries_list = []
        for i, text in enumerate(synthetic_feedback):
            date_str = datetime.now(timezone.utc).isoformat()
            entries_list.append({
                "id": f"synth_{uuid.uuid4().hex[:8]}",
                "title": "Memory retrieval problem",
                "content": text,
                "score": 1, # low rating due to frustration
                "version": "1.0",
                "author": f"User_{i}",
                "date": date_str
            })
            
        return entries_list
