import { useState, useCallback, useMemo } from 'react';

export function useFilters() {
  const [filters, setFilters] = useState({
    geography: '',
    severity: '',
    source: '',
    platform: '',
    memoryCue: '',
  });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ geography: '', severity: '', source: '', platform: '', memoryCue: '' });
  }, []);

  const activeCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  const applyFilters = useCallback(
    (items) => {
      if (!items || !Array.isArray(items)) return items;
      return items.filter((item) => {
        if (filters.geography && !item.geographies?.includes(filters.geography)) return false;
        if (filters.severity && item.severity !== filters.severity) return false;
        if (filters.source && item.source !== filters.source) return false;
        if (filters.platform && item.platform !== filters.platform) return false;
        if (filters.memoryCue && !item.memory_cues?.includes(filters.memoryCue)) return false;
        return true;
      });
    },
    [filters]
  );

  return { filters, setFilter, resetFilters, activeCount, applyFilters };
}
