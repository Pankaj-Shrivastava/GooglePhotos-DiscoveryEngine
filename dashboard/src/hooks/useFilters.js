import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL if present
  const [filters, setFilters] = useState({
    severity: searchParams.get('severity') || '',
    memoryCue: searchParams.get('memoryCue') || '',
    search: searchParams.get('search') || '',
  });

  // Sync state to URL whenever it changes
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ severity: '', memoryCue: '', search: '' });
  }, []);

  // Exclude 'search' from the active dropdown count
  const activeCount = useMemo(() => {
    const { search, ...dropdownFilters } = filters;
    return Object.values(dropdownFilters).filter(Boolean).length;
  }, [filters]);

  const applyFilters = useCallback(
    (items) => {
      if (!items || !Array.isArray(items)) return items;
      return items.filter((item) => {
        // Apply categorical filters
        if (filters.severity && item.severity !== filters.severity) return false;
        if (filters.memoryCue && !item.memory_cues?.includes(filters.memoryCue)) return false;
        
        // Apply text search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          // Check common fields across different JSON structures
          const textToSearch = [
            item.title, 
            item.description, 
            item.quote_excerpt, 
            item.pain_point_id, 
            item.problem_statement,
            ...(item.quotes || []).map(q => q.text)
          ].filter(Boolean).join(' ').toLowerCase();
          
          if (!textToSearch.includes(q)) return false;
        }
        
        return true;
      });
    },
    [filters]
  );

  return { filters, setFilter, resetFilters, activeCount, applyFilters };
}
