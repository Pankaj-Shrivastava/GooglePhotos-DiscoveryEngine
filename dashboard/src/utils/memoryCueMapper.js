export const MEMORY_CUE_GROUPS = {
  'Time / Event': ['date', 'time period', 'event'],
  'People': ['relationship', 'people', 'friends'],
  'Location': ['apartment', 'living room', 'location'],
  'Device / System': ['Galaxy phone', 'cell phone', 'computer', 'device (phone)', 'device', 'cloud'],
  'Collections & Formats': ['deleted files', 'photo book', 'album', 'photo type (dental)', 'type'],
  'Visual Details': ['subject', 'green stage lights', 'old couch'],
  'Abstract / Emotional': ['word', 'happiness']
};

// Flatten to a map of raw_cue -> group_name for fast lookup
export const CUE_TO_GROUP = Object.entries(MEMORY_CUE_GROUPS).reduce((acc, [group, cues]) => {
  cues.forEach(cue => {
    acc[cue.toLowerCase()] = group;
  });
  return acc;
}, {});

// Helper to get group name safely
export const getMemoryCueGroup = (rawCue) => {
  if (!rawCue) return 'Other';
  return CUE_TO_GROUP[rawCue.toLowerCase()] || 'Other';
};
