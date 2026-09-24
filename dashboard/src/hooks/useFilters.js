import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMemoryCueGroup } from '../utils/memoryCueMapper';
import { useDataContext } from '../context/DataContext';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useDataContext();
  
  // Derive state directly from URL
  const filters = useMemo(() => ({
    severity: searchParams.get('severity') || '',
    memoryCue: searchParams.get('memoryCue') || '',
    opportunity: searchParams.get('opportunity') || '',
    memoryGroup: searchParams.get('memoryGroup') || '',
    search: searchParams.get('search') || '',
  }), [searchParams]);

  const setFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Exclude 'search' and 'opportunity' from the active dropdown count, if needed, but here we exclude 'search'
  const activeCount = useMemo(() => {
    const { search, opportunity, ...dropdownFilters } = filters;
    return Object.values(dropdownFilters).filter(Boolean).length;
  }, [filters]);

  const applyFilters = useCallback(
    (items) => {
      if (!items || !Array.isArray(items)) return items;
      return items.filter((item) => {
        // Apply categorical filters
        if (filters.severity && item.severity !== filters.severity) return false;
        if (filters.memoryGroup && item.memory_group !== filters.memoryGroup) return false;
        if (filters.memoryCue) {
          const itemCueGroups = (item.memory_cues || []).map(getMemoryCueGroup);
          if (!itemCueGroups.includes(filters.memoryCue)) return false;
        }
        if (filters.opportunity) {
          const opp = (data.opportunity_areas || []).find(o => o.id === filters.opportunity);
          if (opp && opp.supported_by && !opp.supported_by.includes(item.id)) {
            return false;
          }
        }
        
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
    [filters, data.opportunity_areas]
  );

  return { filters, setFilter, resetFilters, activeCount, applyFilters };
}
