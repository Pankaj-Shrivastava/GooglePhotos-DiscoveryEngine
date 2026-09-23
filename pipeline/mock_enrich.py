import json
import os

path = 'data/enriched/all_enriched.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for item in data:
    if item.get('source') == 'synthetic_memory':
        item['problem_type'] = 'memory'
        
        text = item.get('text', '').lower()
        if 'café' in text or 'san francisco' in text or 'apartment' in text:
            item['pain_point_cluster'] = "Forgets specific location"
            item['memory_cues'] = ['place', 'context']
        elif 'medicine' in text or 'receipt' in text or 'note' in text:
            item['pain_point_cluster'] = "Looking for specific object"
            item['memory_cues'] = ['object', 'visual attributes']
        elif 'funny face' in text or 'green' in text or 'feeling' in text:
            item['pain_point_cluster'] = "Searches by emotion or feeling"
            item['memory_cues'] = ['emotion', 'event', 'visual attributes']
        else:
            item['pain_point_cluster'] = "Vague memory retrieval"
            item['memory_cues'] = ['time', 'people']
            
        item['severity'] = 'high'
        item['confidence'] = 0.95
        count += 1

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
    
print(f"Updated {count} items")
