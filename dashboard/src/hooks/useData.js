import { useState, useEffect } from 'react';

const DATA_FILES = [
  'pain_points',
  'memory_cues',
  'opportunity_areas',
  'journey_maps',
  'segmentation',
  'google_actions_2026',
  'references',
  'frameworks',
  'interview_guides',
];

export function useData() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const results = {};
        await Promise.all(
          DATA_FILES.map(async (name) => {
            const res = await fetch(`/data/${name}.json`);
            if (!res.ok) throw new Error(`Failed to load ${name}.json`);
            results[name] = await res.json();
          })
        );
        if (!cancelled) {
          setData(results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
