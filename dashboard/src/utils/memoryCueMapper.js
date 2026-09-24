export const MEMORY_CUE_GROUPS = {
  'Time / Event': ['date', 'time period', 'event', 'season', 'approximate time'],
  'People': ['relationship', 'people', 'friends', 'aging', 'relatives', 'child growing up'],
  'Location': ['apartment', 'living room', 'location', 'landmark', 'vacation spot'],
  'Where it was taken': ['Galaxy phone', 'cell phone', 'computer', 'device (phone)', 'device', 'cloud'],
  'Object / Thing': ['deleted files', 'photo book', 'album', 'photo type (dental)', 'type', 'pets', 'dogs', 'cats'],
  'Visual Details': ['subject', 'green stage lights', 'old couch', 'red dress', 'blue car', 'visuals', 'weather'],
  'Mood / Feeling': ['word', 'happiness', 'happy', 'sunset vibe', 'peaceful', 'vibe', 'inside joke', 'story', 'context', 'birthday party', 'wedding', 'anniversary']
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
